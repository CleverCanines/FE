import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import StandardButton from '@/components/StandardButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, gql } from '@apollo/client';
import { client } from '../../apolloClient';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';

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

export default function ScreenScreen() {
    // get the task we want to display the screens for
    const taskId = useLocalSearchParams().taskId;
    const router = useRouter();

    // Get screens from server for the current task
    const { loading, error, data } = useQuery(GET_SCREENS_BY_TASK, {
        client: client,
        variables: { taskId: taskId },
    });

    const [index, setIndex] = useState(0);
    const [availableHeight, setAvailableHeight] = useState(Dimensions.get('window').height - (95 + 64));

    useEffect(() => {
        const updateHeight = () => {
            const screenHeight = Dimensions.get('window').height;
            setAvailableHeight(screenHeight - (115 + 64));
        };

        const subscription = Dimensions.addEventListener('change', updateHeight);

        // Clean up the event listener
        return () => {
            subscription?.remove();
        };
    }, []);

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
                        <iframe 
                            style={styles.video}
                            src={screens[index].videoUrl} 
                            title="Video player"  
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen
                        ></iframe>
                    </>
                )}
            </ScrollView>
            </View>
            <View style={styles.Button}>
                { index === 0 ? null : <StandardButton title="Back" onPress={() => setIndex(index - 1)} />}
                <StandardButton title={buttonTextRight} onPress={() => {
                    if (index < numScreens - 1) {
                        setIndex(index + 1);
                    } else {
                        router.back();
                    }
                }} />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1
    },
    Button: {
        position: 'absolute',
        bottom: 10, 
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