import React, { useState } from 'react';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Task, Screen, Lesson } from "@/dataTypes/LessonTypes";
import { StyleSheet, View, ScrollView } from "react-native";
import { TextInput, Divider, IconButton, List } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { groupInfo } from "@/stores/groupInfoStore";
import { newLessonStore } from "@/stores/newLessonStore";
import { setLesson, setTasks, setScreens } from "@/features/createLesson/newLessonSlice";

function updateLessonStore(lesson: Lesson, tasks: Task[], screens: Screen[][]) {
    newLessonStore.dispatch(setLesson(lesson));
    newLessonStore.dispatch(setTasks(tasks));
    newLessonStore.dispatch(setScreens(screens));
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
    const taskIndex = Number(useLocalSearchParams().taskIndex);
    const [task, setTask] = useState(newLessonStore.getState().newLesson.tasks[taskIndex]);
    // get the screens for the task (1D array of screens)
    const [screens, setScreens] = useState(newLessonStore.getState().newLesson.screens[taskIndex]);
    // get the screen titles, texts, imageUrls, and videoUrls and keep them in sync with the screens
    const [screenTitles, setScreenTitles] = useState([...screens.map(screen => screen.title)]);
    const [screenTexts, setScreenTexts] = useState([...screens.map(screen => screen.text)]);
    const [screenImageUrls, setScreenImageUrls] = useState([...screens.map(screen => screen.imageUrl)]);
    const [screenVideoUrls, setScreenVideoUrls] = useState([...screens.map(screen => screen.videoUrl)]);
    const [infoToggle, setInfoToggle] = useState(false);    

    const handleTaskTitleChange = (title: string) => {
        const newTask = { ...task};
        newTask.title = title;
        setTask(newTask);
    };
    const handleScreenTitleChange = (title: string, index: number) => {
        const newTitles = [...screenTitles];
        const newScreens = screens.map((screen, i) => 
            i === index ? { ...screen, title } : screen
        );
        newTitles[index] = title;
        setScreenTitles(newTitles);
        setScreens(newScreens);
    }
    const handleScreenTextChange = (text: string, index: number) => {
        const newTexts = [...screenTexts];
        const newScreens = screens.map((screen, i) =>
            i === index ? { ...screen, text } : screen
        );
        newTexts[index] = text;
        setScreenTexts(newTexts);
        setScreens(newScreens);
    }
    const handleScreenImageUrlChange = (imageUrl: string, index: number) => {
        const newImageUrls = [...screenImageUrls];
        const newScreens = screens.map((screen, i) =>
            i === index ? { ...screen, imageUrl } : screen
        );
        newImageUrls[index] = imageUrl;
        setScreenImageUrls(newImageUrls);
        setScreens(newScreens);
    }
    const handleScreenVideoUrlChange = (videoUrl: string, index: number) => {
        const newVideoUrls = [...screenVideoUrls];
        const newScreens = screens.map((screen, i) =>
            i === index ? { ...screen, videoUrl } : screen
        );
        newVideoUrls[index] = videoUrl;
        setScreenVideoUrls(newVideoUrls);
        setScreens(newScreens);
    }

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
                            const newScreens = [...newLessonStore.getState().newLesson.screens];
                            newTasks[taskIndex] = task;
                            newScreens[taskIndex] = screens;
                            // console.log("NewTasks: ", newTasks);
                            // console.log("NewScreens: ", newScreens);
                            updateLessonStore(
                                newLessonStore.getState().newLesson.lessonInfo, 
                                newTasks, 
                                newScreens
                            );
                            // console.log("newLessonStore.getState().newLesson.screens: ", newLessonStore.getState().newLesson.screens);
                            // console.log("newLessonStore.getState().newLesson.tasks: ", newLessonStore.getState().newLesson.tasks);
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
            <ScrollView
                contentContainerStyle={styles.scrollView}
            >
            <ThemedView>
                <View style={styles.textRow}>
                    <TextInput
                        label={"Task Title"}
                        value={task.title}
                        onChangeText={handleTaskTitleChange}
                        mode={'outlined'}
                        activeOutlineColor={groupColor}
                        theme={{ colors: { background: backgroundColor } }}
                        textColor={textColor}
                    />
                </View>
                <Divider />
                <List.Section>
                    {screens.map((screen, index) => (
                        <List.Accordion
                            key={index}
                            title={screenTitles[index]}
                            left={props => <List.Icon {...props} icon="cellphone-text" />}
                            theme={{ colors: { primary: groupColor, background: backgroundColor } }}
                            titleStyle={{ color: textColor }}
                        >
                            <View style={styles.textRow}>
                                <TextInput
                                    label={"Page Title"}
                                    value={screenTitles[index]}
                                    onChangeText={(text: string) => {
                                        handleScreenTitleChange(text, index);
                                    }}
                                    mode={'outlined'}
                                    activeOutlineColor={groupColor}
                                    theme={{ colors: { background: backgroundColor } }}
                                    textColor={textColor}
                                />
                                {infoToggle && <ThemedText style={styles.helpText}>The title of the page</ThemedText>}
                            </View>
                            <View style={styles.textRow}>
                                <TextInput
                                    label={"Page Text"}
                                    value={screenTexts[index]}
                                    onChangeText={(text) => {
                                        handleScreenTextChange(text, index);
                                    }}
                                    mode={'outlined'}
                                    activeOutlineColor={groupColor}
                                    theme={{ colors: { background: backgroundColor } }}
                                    textColor={textColor}
                                    multiline={true}
                                />
                                {infoToggle && 
                                <ThemedText style={styles.helpText}>
                                    The textual description of what the page is trying to inform the user of, or teach the user to do
                                </ThemedText>
                                }
                            </View>
                            <View style={styles.textRow}>
                                <TextInput
                                    label={"Page Image URL"}
                                    value={screenImageUrls[index]}
                                    onChangeText={(imageUrl) => {
                                        handleScreenImageUrlChange(imageUrl, index);
                                    }}
                                    mode={'outlined'}
                                    activeOutlineColor={groupColor}
                                    theme={{ colors: { background: backgroundColor } }}
                                    textColor={textColor}
                                />
                                {infoToggle && 
                                <ThemedText style={styles.helpText}>
                                    (optional) The URL of the image to display on the page. For example a diagram, picture, screenshot, etc...
                                </ThemedText>
                                }
                            </View>
                            <View style={styles.textRow}>
                                <TextInput
                                    label={"Page Video URL"}
                                    value={screenVideoUrls[index]}
                                    onChangeText={(videoUrl) => {
                                        handleScreenVideoUrlChange(videoUrl, index);
                                    }}
                                    mode={'outlined'}
                                    activeOutlineColor={groupColor}
                                    theme={{ colors: { background: backgroundColor } }}
                                    textColor={textColor}
                                />
                                {infoToggle &&
                                <ThemedText style={styles.helpText}>
                                    (optional) The URL of the video to display on the page. For example a tutorial, demonstration, etc...
                                </ThemedText>
                                }
                            </View>
                            {index > 0 && <View style={styles.textRow}>
                                <IconButton
                                    icon="trash-can"
                                    iconColor={tintColor}
                                    size={20}
                                    onPress={() => {
                                        const newScreens = [...screens];
                                        newScreens.splice(index, 1);
                                        setScreens(newScreens);
                                        const newTitles = [...screenTitles];
                                        newTitles.splice(index, 1);
                                        setScreenTitles(newTitles);
                                        const newTexts = [...screenTexts];
                                        newTexts.splice(index, 1);
                                        setScreenTexts(newTexts);
                                        const newImageUrls = [...screenImageUrls];
                                        newImageUrls.splice(index, 1);
                                        setScreenImageUrls(newImageUrls);
                                        const newVideoUrls = [...screenVideoUrls];
                                        newVideoUrls.splice(index, 1);
                                        setScreenVideoUrls(newVideoUrls);
                                    }}
                                />
                            </View>
                            }   
                            <Divider />
                        </List.Accordion>
                    ))}
                    <View style={styles.buttonRow}>
                        <IconButton
                            icon="plus"
                            iconColor={tintColor}
                            size={20}
                            onPress={() => {
                                const newScreens = [...screens];
                                newScreens.push({
                                    orderIndex: screens.length,
                                    title: "Page " + (screens.length + 1),
                                    text: "",
                                    videoUrl: "",
                                    imageUrl: "",
                                    onlyInstruction: false,
                                    taskId: task.id
                                });
                                setScreens(newScreens);
                                const newTitles = [...screenTitles];
                                newTitles.push("Page " + (screens.length + 1));
                                setScreenTitles(newTitles);
                                const newTexts = [...screenTexts];
                                newTexts.push("");
                                setScreenTexts(newTexts);
                                const newImageUrls = [...screenImageUrls];
                                newImageUrls.push("");
                                setScreenImageUrls(newImageUrls);
                                const newVideoUrls = [...screenVideoUrls];
                                newVideoUrls.push("");
                                setScreenVideoUrls(newVideoUrls);
                            }}
                        />
                        <IconButton
                            icon="help"
                            iconColor={tintColor}
                            size={20}
                            onPress={() => {
                                setInfoToggle(!infoToggle);
                            }}
                        />
                    </View>
                </List.Section>                
            </ThemedView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    textRow: {
        margin: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 10,
    },
    helpText: {
        fontSize: 12,
    },
    scrollView: {
        flexGrow: 1,
    },
});