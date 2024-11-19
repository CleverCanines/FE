import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Switch, Divider, Icon, IconButton} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/Colors";
import { groupInfo } from "@/stores/groupInfo";
import { useThemeColor } from "@/hooks/useThemeColor";
import DragList, {DragListRenderItemInfo} from "react-native-draglist";
import { TouchableOpacity } from "react-native";
import StandardButton from "@/components/StandardButton";


export default function lessonForm() {
    // states 
    const [title, setTitle] = React.useState(""); // title of the lesson (string)
    const [type, setType] = React.useState(true); // type of the lesson (client(f) or raiser(t))
    const [week, setWeek] = React.useState(0); // week of the lesson (number)
    const [tasks, setTasks] = React.useState(["Task 1"]); // tasks of the lesson (array of tasks)

    //colors
    const group = groupInfo.getState().group.group;
    const groupColor = Colors[group].color;
    const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');
    const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');

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
                    data={tasks}
                    keyExtractor={(item) => item}
                    onReordered={(fromIndex, toIndex) => {
                        const newTasks = [...tasks];
                        const [removed] = newTasks.splice(fromIndex, 1);
                        newTasks.splice(toIndex, 0, removed);
                        setTasks(newTasks);
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
                                    />
                                    <ThemedText style={{fontSize: 24}}>{item}</ThemedText>
                                    <Icon source="drag" color={tintColor} size={24} />
                                </View>
                                <Divider />
                            </TouchableOpacity>
                        );
                    }}
                />
                
                {tasks.length < 10 && <StandardButton
                    title="Add Task"
                    onPress={() => {
                        if (tasks.length >= 10) {
                            return;
                        }
                        setTasks([...tasks, "Task " + (tasks.length + 1)]);
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
    },
});