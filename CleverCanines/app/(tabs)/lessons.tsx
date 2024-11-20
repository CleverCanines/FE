import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { client } from '@/apolloClient';
import { groupInfo } from '@/stores/groupInfoStore';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import LessonWeekContainer from '@/components/LessonWeekContainer';
import StandardButton from '@/components/StandardButton';
import { useRouter } from 'expo-router';
import { Lesson } from '@/dataTypes/LessonTypes';

const GET_LESSONS_BY_LESSON_TYPE = gql`
    query getLessonsByLessonType($lesson_type: LessonType!, $personId: ID = "") {
        getLessonsByLessonType(lesson_type: $lesson_type) {
            description
            id
            lessonType
            lessonWeek
            orderIndex
            title
        }
        getLessonInteractionsByPersonId(personId: $personId) {
            lessonId
            personId
            progress
        }
    }
`;

const LessonsScreen = () => {
    // Router to navigate to the lesson form
    const router = useRouter();
    // Retrieve the lesson_type and personId from the groupInfo store
    const lesson_type = groupInfo.getState().group.group;
    const personId = groupInfo.getState().group.id;

    // State for lesson data and interactions
    const [lessonData, setLessonData] = useState([]);
    const [interactions, setInteractions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Use the useQuery hook to fetch lessons and interactions
    const { loading, error, data, refetch } = useQuery(GET_LESSONS_BY_LESSON_TYPE, {
        variables: { lesson_type: lesson_type, personId: personId },
        client: client,
    });

    useEffect(() => {
        if (data) {
            setLessonData(data.getLessonsByLessonType);
            setInteractions(data.getLessonInteractionsByPersonId);
        }
    }, [data]);

    const onRefresh = () => {
        console.log('Refreshing...');
        setRefreshing(true);
        refetch().then(() => {
            setRefreshing(false);
        });
    };

    if (loading) return (
        <ThemedView>
            <ThemedText>Loading Lesson Data...</ThemedText>
        </ThemedView>
    );
    if (error) return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <ThemedView>
                <ThemedText>Error fetching lesson data</ThemedText>
                <ThemedText>Error: {error.message}</ThemedText>
            </ThemedView>
        </ScrollView>
    );

    // Group lessons by week
    type LessonWeeks = Lesson[][];

    // Group lessons by week (max amount of weeks is 256)
    let lessonWeeks: LessonWeeks = Array.from({ length: 256 }, () => []);
    let currentWeekLessons: Lesson[] = [];

    lessonData.forEach((lesson: Lesson) => {
        lessonWeeks[lesson.lessonWeek].push(lesson);
    });

    // Remove empty weeks
    lessonWeeks = lessonWeeks.filter((week) => week.length > 0);

    return (
        lesson_type === 'client' || lesson_type === 'raiser' ? (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <ThemedView>
                {refreshing && <ThemedText>Refreshing...</ThemedText>}
                {lessonWeeks.map((lessonData, weekIndex) => (  
                    <React.Fragment key={`week-${lessonData[0].lessonWeek}`}>
                        <LessonWeekContainer 
                            lessons={lessonData} 
                            interactions={interactions} 
                            unlocked={
                                // Check if all lessons in the week before are completed
                                weekIndex === 0 || lessonWeeks[weekIndex - 1].every((lesson) => {
                                    const interaction = interactions.find((interaction: { lessonId: string; progress: number }) => interaction.lessonId === lesson.id) as { lessonId: string; progress: number } | undefined;
                                    return interaction?.progress === 100;
                                })
                            }
                        />
                    </React.Fragment>
                ))}
            </ThemedView>
        </ScrollView>
        ) : (
        <ScrollView 
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  
        >
            <ThemedView>
                <StandardButton
                    title="Create Lesson"
                    onPress={() => {
                        // Navigate to the lesson form
                        router.push('../(staffLessonStack)/lessonForm');
                        }
                    }
                />
            </ThemedView>
        </ScrollView>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    lessonContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LessonsScreen;