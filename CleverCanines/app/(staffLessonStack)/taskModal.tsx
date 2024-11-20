import React, { useState } from 'react';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Task, Screen, Lesson } from "@/dataTypes/LessonTypes";
import { StyleSheet, View } from "react-native";
import { TextInput, Divider, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { groupInfo } from "@/stores/groupInfoStore";
import { newLessonStore } from "@/stores/newLessonStore";
import { setLesson, setTasks, setScreens } from "@/features/createLesson/newLessonSlice";

function updateLessonStore(lesson: Lesson, tasks: Task[], screens: Screen[][]) {
    newLessonStore.dispatch(setLesson(lesson));
    newLessonStore.dispatch(setTasks(tasks));
    newLessonStore.dispatch(setScreens(screens));
    console.log("newLessonStore.getState().newLesson: ", newLessonStore.getState().newLesson);
}

export default function TaskModal() {
    //colors
    const group = groupInfo.getState().group.group;
    const groupColor = Colors[group].color;
    const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
    const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');
    const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');

    //router
    const router = useRouter();

    // get which task we are editing from the params
    console.log("useLocalSearchParams().taskIndex: ", useLocalSearchParams().taskIndex);
    const taskIndex = Number(useLocalSearchParams().taskIndex);
    console.log("taskIndex: ", taskIndex);
    const [task, setTask] = useState(newLessonStore.getState().newLesson.tasks[taskIndex]);
    
    const initScreen: Screen = { orderIndex: 0, title: "Screen 1", text: "", videoUrl: "", imageUrl: "", onlyInstruction: false, taskId: task.id };
    const [screens, setScreens] = useState([initScreen]);

    const handleTitleChange = (title: string) => {
        const newTask = { ...task};
        newTask.title = title;
        setTask(newTask);
    };

    return (
        <>
            <Stack.Screen options={{ 
                headerTitle: () => <ThemedText>Edit Task</ThemedText>,
                headerRight: () => (
                    <IconButton
                        icon="content-save"
                        iconColor={tintColor}
                        size={20}
                        onPress={() => {
                            const newTasks = [...newLessonStore.getState().newLesson.tasks]
                            newTasks[taskIndex] = task;
                            updateLessonStore(newLessonStore.getState().newLesson.lessonInfo, newTasks, newLessonStore.getState().newLesson.screens);
                            router.back();
                        }}
                    />
                ),
                headerLeft: () => (
                    <IconButton
                        icon="close"
                        iconColor={tintColor}
                        size={20}
                        onPress={() => {
                            router.back();
                        }}
                    />
                ),
            }} />
            <ThemedView>
                <View style={styles.textRow}>
                    <TextInput
                        label={"Task Title"}
                        value={task.title}
                        onChangeText={handleTitleChange}
                        mode={'outlined'}
                        activeOutlineColor={groupColor}
                        theme={{ colors: { background: backgroundColor } }}
                        textColor={textColor}
                    />
                </View>
                <Divider />
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    textRow: {
        margin: 10,
    },
});