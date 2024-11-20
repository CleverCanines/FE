import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import StandardButton from '@/components/StandardButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, gql, useMutation } from '@apollo/client';
import { client } from '../../apolloClient';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';
import { groupInfo } from '@/stores/groupInfoStore';
import { WebView } from 'react-native-webview';
import { Bar }  from 'react-native-progress'
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

const GET_SCREENS_BY_TASK = gql`
    query GetScreensForTask($taskId: ID!) {
        getScreensByTaskId(taskId: $taskId) {
            id
            orderIndex
            title
            text
            videoUrl
            imageUrl
            taskId
        }
    }
`;

const SET_SCREEN_DONE = gql`
    mutation ScreenComplete($personId: ID!, $screenId: ID!) {
        addScreenInteraction(complete: true, personId: $personId, screenId: $screenId) {
            complete
            personId
            screenId
        }
    }
`;

export default function ScreenScreen() {
    // get the task we want to display the screens for
    const taskId = useLocalSearchParams().taskId;
    const router = useRouter();
    const personId = groupInfo.getState().group.id;

    //screen data
    const video = React.useRef(null);
    const availableHeight = Dimensions.get('window').height - 220;
    const tintColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');
    // Get screens from server for the current task
    const { loading, error, data } = useQuery(GET_SCREENS_BY_TASK, {
        client: client,
        variables: { taskId: taskId },
    });

    const [setScreenDone] = useMutation(SET_SCREEN_DONE, {
        client: client,
    });

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (data) {
            console.log("front end sucks");
        }
    }, [index, data]);

    if (loading) return <ThemedText>Loading...</ThemedText>;
    if (error) return <ThemedText>Error: {error.message}</ThemedText>;

    const screens = data.getScreensByTaskId;
    const numScreens = screens.length;
    const buttonTextRight = index < numScreens - 1 ? "Next" : "Done";

    if (index >= numScreens) {
        return <ThemedText>Loading...</ThemedText>;
    }

    const handleNext = async () => {
        console.log("setting screen done");
        setScreenDone({ variables: { personId: personId, screenId: screens[index].id } });
        if (index < numScreens - 1) {
            setIndex(index + 1);
        } else {
            router.back();
        }
    };

    // Display one screen at a time, with a StandardButton to go to the next screen
    return (
        <ThemedView>
            <View style={{height: availableHeight}}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <ThemedText style={styles.title}>{screens[index].title}</ThemedText>
                <ThemedText style={styles.text}>{screens[index].text}</ThemedText>
                {screens[index].imageUrl && (
                    <>
                        <ThemedText style={styles.CaptionText}>Example Image:</ThemedText>
                        <Image 
                            source={{ uri: screens[index].imageUrl }}
                            style={styles.image}
                            resizeMode='contain'
                        />
                    </>
                )}
                {screens[index].videoUrl && (
                    <>
                        <ThemedText style={styles.CaptionText}>Example Video:</ThemedText>
                        <WebView
                            ref={video}
                            source={{ uri: screens[index].videoUrl }}
                            style={styles.video}
                        />
                    </>
                )}
            </ScrollView>
            </View>
            <View style={styles.BottomBar}>
                <Bar 
                    progress={(index + 1) / numScreens}
                    width={null}
                    color='gold'
                    unfilledColor={tintColor}
                    borderWidth={0}
                />
                <View style={styles.Button}>
                    { index === 0 ? null : <StandardButton title="Back" onPress={() => setIndex(index - 1)} />}
                    <StandardButton title={buttonTextRight} onPress={handleNext} />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1
    },
    BottomBar: {
        padding: 10,
    },
    Button: {
        margin: 10,
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 24,
        width: '95%',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    text: {
        fontSize: 20,
        width: '95%',
        alignSelf: 'center',
        marginTop: 0,
        marginBottom: 10
    },
    CaptionText: {
        fontSize: 16,
        width: '95%',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 0
    },
    video: {
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        width: '95%',
        aspectRatio: 16/9
    },
    image: {
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        width: '95%',
        aspectRatio: 1
    }
});