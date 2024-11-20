import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Switch, Divider, Icon, IconButton} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/Colors";
import { groupInfo } from "@/stores/groupInfoStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import DragList, {DragListRenderItemInfo} from "react-native-draglist";
import { TouchableOpacity } from "react-native";
import StandardButton from "@/components/StandardButton";
import { newLessonStore } from "@/stores/newLessonStore";
import { setLesson, setTasks, setScreens } from "@/features/createLesson/newLessonSlice";
import { Lesson, Task, Screen } from "@/dataTypes/LessonTypes";
import { router } from "expo-router";
import { Use } from "react-native-svg";

function updateLessonStore(lesson: Lesson, tasks: Task[], screens: Screen[][]) {
    newLessonStore.dispatch(setLesson(lesson));
    newLessonStore.dispatch(setTasks(tasks));
    newLessonStore.dispatch(setScreens(screens));
}

export default function lessonForm() {
    const initialState = newLessonStore.getState().newLesson;
    // states 
    const [title, setTitle] = React.useState(""); // title of the lesson (string)
    const [type, setType] = React.useState(true); // type of the lesson (client(f) or raiser(t))
    const [week, setWeek] = React.useState(0); // week of the lesson (number)
    const [tasks, setTasks] = React.useState(initialState.tasks); // tasks of the lesson (array of tasks)
    const [taskTitles, setTaskTitles] = React.useState(["Task 1"]); // titles of the tasks (array of strings)

    //colors
    const group = groupInfo.getState().group.group;
    const groupColor = Colors[group].color;
    const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');
    const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');

    React.useEffect(() => {
        const unsubscribe = newLessonStore.subscribe(() => {
            const state = newLessonStore.getState().newLesson;
            setTitle(state.lessonInfo.title);
            setType(state.lessonInfo.lessonType === "client");
            setWeek(state.lessonInfo.lessonWeek);
            setTasks(state.tasks);
            setTaskTitles(state.tasks.map(task => task.title));
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSwitchToggle = () => {
        setType(!type);
    };

    // Generate picker items 
    const pickerItems = [];
    for (let i = 0; i <= 256; i++) {
        pickerItems.push({ label: i.toString(), value: i.toString() });
    }

    const label = <ThemedText>Title</ThemedText>;

    return (
        <ThemedView>
            <View style={styles.textRow}>
                <TextInput
                    label={label}
                    value={title}
                    onChangeText={setTitle}
                    mode={'outlined'}
                    activeOutlineColor={groupColor}
                    theme={{ colors: { background: backgroundColor } }}
                    textColor={textColor}
                />
            </View>
            <Divider />
            <View style={styles.switchRow}>
                <ThemedText>Client Lesson</ThemedText>
                <Switch
                    value={type}
                    theme={{ colors: { primary: groupColor } }}
                    onValueChange={handleSwitchToggle}
                />
            </View>
            <View style={styles.switchRow}>
                <ThemedText>Raiser Lesson</ThemedText>
                <Switch style={{alignSelf: 'flex-end'}}
                    value={!type}
                    theme={{ colors: { primary: groupColor } }}
                    onValueChange={handleSwitchToggle}
                />
            </View>
            <Divider />
            <View style={styles.pickerRow}>
                <ThemedText>Week</ThemedText>
                <Dropdown 
                    itemAccessibilityLabelField="label"
                    data={pickerItems}
                    value={week.toString()}
                    labelField="label"
                    valueField="value"
                    maxHeight={150}
                    onChange={(item) => setWeek(parseInt(item.value))}
                    placeholder="Select Week"
                    placeholderStyle={{ color: textColor, fontSize: 14 }}
                    selectedTextStyle={{ color: textColor, fontSize: 14 }}
                    style={{ width: 125, height: 24, borderColor: tintColor }}
                    containerStyle={{ backgroundColor: backgroundColor, borderRadius: 1, borderColor: tintColor }}
                    itemContainerStyle={{ backgroundColor: backgroundColor }}
                    itemTextStyle={{ color: textColor, fontSize: 14 }}
                    activeColor={backgroundColor}
                    iconColor={textColor}
                />
            </View>
            <Divider />
            <View style={styles.textRow}>
                <DragList
                    data={taskTitles}
                    keyExtractor={(item) => item}
                    onReordered={(fromIndex, toIndex) => {
                        const newTasks = [...tasks];
                        const newTaskTitles = [...taskTitles];
                        const [removed] = newTaskTitles.splice(fromIndex, 1);
                        newTaskTitles.splice(toIndex, 0, removed);
                        setTaskTitles(newTaskTitles);
                        newTasks.splice(fromIndex, 1);
                        newTasks.splice(toIndex, 0, tasks[fromIndex]);
                        setTasks(newTasks);
                        // update the orderIndex of the tasks in the local state
                        newTasks.forEach((task, index) => {
                            task.orderIndex = index;
                        });
                    }}
                    renderItem={(info: DragListRenderItemInfo<string>) => {
                        const { item, onDragStart, onDragEnd, isActive } = info;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPressIn={onDragStart}
                                onPressOut={onDragEnd}
                            >   
                                <View style={styles.taskRow}>
                                <IconButton 
                                        icon="pencil" 
                                        iconColor={tintColor}
                                        size={12}
                                        mode="contained"
                                        style={{backgroundColor: groupColor}}
                                        onPress={() => {
                                            updateLessonStore({
                                                description: "",
                                                id: "",
                                                lessonType: type ? "client" : "raiser",
                                                lessonWeek: week,
                                                orderIndex: 0,
                                                title: title
                                            }, tasks, []);
                                            router.push({
                                                pathname: "../taskModal", 
                                                params: {taskIndex: JSON.stringify(taskTitles.indexOf(item))}
                                            });
                                        }}
                                    />
                                    <ThemedText style={{fontSize: 24}}>{item}</ThemedText>
                                    <Icon source="drag" color={tintColor} size={24} />
                                </View>
                                <Divider />
                            </TouchableOpacity>
                        );
                    }}
                />
                
                {tasks.length < 8 && <StandardButton
                    title="Add Task"
                    onPress={() => {
                        if (tasks.length >= 8) {
                            return;
                        }
                        const newTask = {
                            description: "",
                            id: "",
                            lessonId: "",
                            orderIndex: tasks.length,
                            title: `Task ${tasks.length + 1}`
                        };
                        setTasks([...tasks, newTask]);
                        setTaskTitles([...taskTitles, newTask.title]);
                    }}
                />}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 10,
    },
    textRow: {
        margin: 10,
    },
    pickerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        alignItems: "center",
    },
});