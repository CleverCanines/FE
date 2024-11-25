import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, SegmentedButtons, Divider, Icon, IconButton, Portal, Dialog, PaperProvider } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/Colors";
import { groupInfo } from "@/stores/groupInfoStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import DragList, {DragListRenderItemInfo} from "react-native-draglist";
import { TouchableOpacity } from "react-native";
import StandardButton from "@/components/StandardButton";
import { newLessonStore } from "@/stores/newLessonStore";
import { setLesson, setTasks, setScreens, reset } from "@/features/createLesson/newLessonSlice";
import { Lesson, Task, Screen } from "@/dataTypes/LessonTypes";
import { router, Stack } from "expo-router";
import { Use } from "react-native-svg";
import { gql, useMutation } from "@apollo/client";
import { client } from "@/apolloClient";

function updateLessonStore(lesson: Lesson, tasks: Task[], screens: Screen[][]) {
    newLessonStore.dispatch(setLesson(lesson));
    newLessonStore.dispatch(setTasks(tasks));
    newLessonStore.dispatch(setScreens(screens));
}

const ADD_LESSON = gql`
    mutation AddLessonAndGetItsId($lesson_week: Int!, $orderIndex: Int!, $lesson_type: LessonType!, $description: String!, $title: String!) {
    addLesson(
        description: $description
        lesson_type: $lesson_type
        lesson_week: $lesson_week
        orderIndex: $orderIndex
        title: $title
    ) { id }
    }
`;

const ADD_TASK = gql`
    mutation AddTaskAndGetItsId($title: String!, $orderIndex: Int!, $lessonId: ID!, $description: String!) {
    addTask(
        description: $description
        lessonId: $lessonId
        orderIndex: $orderIndex
        title: $title
    ) { id }
    }
`;

const ADD_SCREEN = gql`
    mutation AddScreen($imageUrl: String, $onlyInstruction: Boolean = false, $orderIndex: Int!, $taskId: ID!, $text: String!, $title: String!, $videoUrl: String) {
    addScreen(
        orderIndex: $orderIndex
        taskId: $taskId
        text: $text
        title: $title
        onlyInstruction: $onlyInstruction
        imageUrl: $imageUrl
        videoUrl: $videoUrl
    ) { id }
    }
`;

const saveToBackend = async (addLesson: (options: any) => Promise<any>, addTask: (options: any) => Promise<any>, addScreen: (options: any) => Promise<any>) => {
    // console.log("Saving to backend");
    let lessonId = "";
    let taskIds: string[] = [];
    // save the lesson to backend
    // get the lesson ID from the backend
    const lesson = newLessonStore.getState().newLesson.lessonInfo;
    addLesson({
        variables: {
            lesson_week: lesson.lessonWeek,
            orderIndex: lesson.orderIndex,
            lesson_type: lesson.lessonType,
            description: lesson.description,
            title: lesson.title
        }
    }).then(({ data }) => {
        lessonId = data.addLesson.id;
    }).then(() => {
        // save the tasks to the backend
        // get the task IDs from the backend
        const tasks = newLessonStore.getState().newLesson.tasks;
        tasks.forEach(task => {
            addTask({
                variables: {
                    title: task.title,
                    orderIndex: task.orderIndex,
                    lessonId: lessonId,
                    description: task.description
                }
            }).then(({ data }) => {
                taskIds.push(data.addTask.id);
            }).then(() => {
                const screens = newLessonStore.getState().newLesson.screens;
                // console.log("Screens in save func: ", screens);
                // save the screens to the backend for this task
                screens[tasks.indexOf(task)].forEach(screen => {
                    // console.log("here: ", screen);
                    // console.log(taskIds[tasks.indexOf(task)]);
                    addScreen({
                        variables: {
                            imageUrl: screen.imageUrl,
                            onlyInstruction: screen.onlyInstruction,
                            orderIndex: screen.orderIndex,
                            taskId: taskIds[tasks.indexOf(task)],
                            text: screen.text,
                            title: screen.title,
                            videoUrl: screen.videoUrl
                        }
                    }).catch(error => { console.error(error); });
                });
            }).catch(error => { console.error(error); });
        });
    }).catch(error => { console.error(error); });
};

function checkMinInfo(): [boolean, string] {
    const state = newLessonStore.getState().newLesson;
    const lesson = state.lessonInfo;
    const tasks = state.tasks;
    const screens = state.screens;
    
    /*
    Lessons must have a title, type, and week
    There must be at least one task
        every task must have a title 
        and at least one screen
            every screen must have a title and text 
    */
    if (lesson.title === "") { return [false, "Lesson is missing a title"]; }
    if (lesson.lessonType === "") { return [false, "Lesson is missing a type"]; }
    if (lesson.lessonWeek === null) { return [false, "Lesson is missing a week"]; }
    if (tasks.length === 0) { return [false, "Lesson has no tasks"]; }
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].title === "") { return [false, `Task ${i + 1} is missing a title`]; }
        if (screens[i].length === 0) { return [false, `Task ${i + 1} has no screens`]; }
        for (let j = 0; j < screens[i].length; j++) {
            if (screens[i][j].title === "") { return [false, `Task ${i + 1} has a screen with no title`]; }
            if (screens[i][j].text === "") { return [false, `Task ${i + 1} has a screen with no text`]; }
        }
    }
    return [true, ""];
}

export default function lessonForm() {
    const initialState = newLessonStore.getState().newLesson;
    // states 
    const [title, setTitle] = React.useState(""); // title of the lesson (string)
    const [type, setType] = React.useState(true); // type of the lesson (client(f) or raiser(t))
    const [week, setWeek] = React.useState(0); // week of the lesson (number)
    const [tasks, setTasks] = React.useState(initialState.tasks); // tasks of the lesson (array of tasks)
    const [taskTitles, setTaskTitles] = React.useState(["Task 1"]); // titles of the tasks (array of strings)
    const [screens, setScreens] = React.useState(initialState.screens); // screens of the lesson (array of arrays of screens)
    const [areYouSure, setAreYouSure] = React.useState(false); // are you sure you want to leave the page (boolean)
    
    // backend mutators
    const [addLesson] = useMutation(ADD_LESSON, { client: client, });
    const [addTask] = useMutation(ADD_TASK, { client: client, });
    const [addScreen] = useMutation(ADD_SCREEN, { client: client, });

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
            setScreens(state.screens);
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
    for (let i = 1; i <= 256; i++) {
        pickerItems.push({ label: i.toString(), value: i.toString() });
    }

    const label = <ThemedText>Title</ThemedText>;
    let taskCount = tasks.length;

    return (
        <PaperProvider>
        <Stack.Screen options={{ 
            title: "Create a new lesson", 
            headerLeft: () => (
                <IconButton
                    icon="arrow-left"
                    iconColor={groupColor}
                    size={24}
                    onPress={() => setAreYouSure(true)}
                />
            ),
            }}
        />
        <ThemedView>
            <View style={styles.textRow}>
                <SegmentedButtons
                    buttons={[
                        { 
                            label: "Client", 
                            value: "client", 
                            checkedColor: groupColor, 
                            uncheckedColor: textColor,
                        },
                        { 
                            label: "Raiser",
                            value: "raiser", 
                            checkedColor: groupColor, 
                            uncheckedColor: textColor,
                        }
                    ]}
                    value={type ? "client" : "raiser"}
                    onValueChange={(value) => setType(value === "client")}
                    theme={{ colors: { 
                        secondaryContainer: backgroundColor,
                        primary: groupColor,
                    } }}
                />
            </View>
            <Divider />
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
                    keyExtractor={(item, index) => `${item}-${index}`}
                    onReordered={(fromIndex, toIndex) => {
                        const newTasks = [...tasks];
                        const newTaskTitles = [...taskTitles];
                        const newScreens = [...screens];
                        const [removed] = newTaskTitles.splice(fromIndex, 1);
                        newTaskTitles.splice(toIndex, 0, removed);
                        setTaskTitles(newTaskTitles);
                        newTasks.splice(fromIndex, 1);
                        newTasks.splice(toIndex, 0, tasks[fromIndex]);
                        newScreens.splice(fromIndex, 1);
                        newScreens.splice(toIndex, 0, screens[fromIndex]);
                        setTasks(newTasks);
                        setScreens(newScreens);
                        // update the orderIndex of the tasks in the local state
                        newTasks.forEach((task, index) => {
                            task.orderIndex = index;
                        });
                    }}
                    renderItem={(info: DragListRenderItemInfo<string>) => {
                        const { item, onDragStart, onDragEnd, isActive } = info;
                        return (
                            <TouchableOpacity
                                key={`${item}-${taskTitles.indexOf(item)}`}
                                onPressIn={onDragStart}
                                onPressOut={onDragEnd}
                            >   
                                <View style={styles.taskRow}>
                                <IconButton 
                                        icon="pencil" 
                                        iconColor={"white"}
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
                                            }, tasks, screens);
                                            router.push({
                                                pathname: "../taskModal", 
                                                params: {taskIndex: JSON.stringify(taskTitles.indexOf(item))}
                                            });
                                        }}
                                    />
                                    <ThemedText style={{fontSize: 24}}>{item}</ThemedText>
                                    <IconButton 
                                        icon="trash-can" 
                                        iconColor={tintColor} 
                                        size={24}
                                        onPress={() => {
                                            const newTasks = [...tasks];
                                            const newTaskTitles = [...taskTitles];
                                            const newScreens = [...screens];
                                            newTasks.splice(taskTitles.indexOf(item), 1);
                                            newTaskTitles.splice(taskTitles.indexOf(item), 1);
                                            newScreens.splice(taskTitles.indexOf(item), 1);
                                            setTasks(newTasks);
                                            setTaskTitles(newTaskTitles);
                                            setScreens(newScreens);
                                        }}
                                    />
                                </View>
                                <Divider />
                            </TouchableOpacity>
                        );
                    }}
                />
                
                {tasks.length < 8 && <IconButton
                    icon="plus"
                    iconColor={tintColor}
                    size={24}
                    onPress={() => {
                        if (tasks.length >= 8) {
                            return;
                        }
                        const newTask = {
                            description: "",
                            id: "",
                            lessonId: "",
                            orderIndex: tasks.length,
                            title: `Task ${taskCount + 1}`
                        };
                        setTasks([...tasks, newTask]);
                        setTaskTitles([...taskTitles, newTask.title]);
                        // put a filler screen in the screens array for the tasks index so that Screens[taskIndex] is not undefined
                        setScreens([...screens, 
                            [{ 
                            orderIndex: 0,
                            title: "Screen 1",
                            text: "",
                            videoUrl: "",
                            imageUrl: "",
                            onlyInstruction: false,
                            taskId: ""
                            }]
                        ]);
                        taskCount = taskCount + 1;
                    }}
                />}
            </View>
            <View style={styles.textRow}>
                <StandardButton
                    title="Save"
                    onPress={() => {
                        updateLessonStore({
                            description: "",
                            id: "",
                            lessonType: type ? "client" : "raiser",
                            lessonWeek: week,
                            orderIndex: 0,
                            title: title
                        }, tasks, screens);
                        // console.log("New lesson screens state: ", newLessonStore.getState().newLesson.screens);
                        const [valid, message] = checkMinInfo();
                        if (!valid) {
                            alert(message);
                            return;
                        }
                        saveToBackend(addLesson, addTask, addScreen);
                        router.back();
                    }}
                />
            </View>
            <Portal>
                <Dialog visible={areYouSure} onDismiss={() => setAreYouSure(false)}>
                    <Dialog.Title>Are you sure you want to leave? All progress will be lost.</Dialog.Title>
                    <Dialog.Actions>
                        <StandardButton title="Cancel" onPress={() => setAreYouSure(false)} />
                        <StandardButton title="Go Back" onPress={() => {
                            setAreYouSure(false);
                            newLessonStore.dispatch(reset());
                            router.back();
                        }} />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ThemedView>
        </PaperProvider>
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