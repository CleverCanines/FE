import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import LessonWeekContainer from "@/components/LessonWeekContainer";
import { client } from "@/apolloClient";
import { gql, useQuery } from "@apollo/client";
import { groupInfo } from "@/stores/groupInfo";
import React from "react";

export default function LessonScreen() {
    const GET_LESSONS_BY_LESSON_TYPE = gql`
        query getLessonsByLessonType($lesson_type: LessonType!) {
            getLessonsByLessonType(lesson_type: $lesson_type) {
                description
                id
                lessonType
                lessonWeek
                orderIndex
                title
            }
        }
    `;

    // Retrieve the lesson_type from the groupInfo store
    const lesson_type = groupInfo.getState().group.value;

    console.log("querying for lesson type: ", lesson_type);
    // Get lessons from server for the current group
    const { loading, error, data } = useQuery(GET_LESSONS_BY_LESSON_TYPE, {
        client: client,
        variables: { lesson_type: lesson_type },
    });
    
    console.log("data: ", data);
    console.log("error: ", error);
    console.log("loading: ", loading);

    if (loading) return <ThemedText>Loading...</ThemedText>;
    if (error) return <ThemedText>Error: {error.message}</ThemedText>;
    let lessons = data.getLessonsByLessonType;

    console.log("lessons: ", lessons);
    
    interface Lesson {
        description: string;
        id: string;
        lessonType: string;
        lessonWeek: number;
        orderIndex: number;
        title: string;
    }

    type LessonWeeks = Lesson[][];

    // Group lessons by lesson week (max amount of weeks is 128)
    let lessonWeeks: LessonWeeks = new Array(128).fill(null).map(() => []);
    let currentWeekLessons: Lesson[] = [];

    lessons.forEach((lesson: Lesson) => {
        lessonWeeks[lesson.lessonWeek].push(lesson);
    });

    lessonWeeks = lessonWeeks.filter((week) => week.length > 0);

    console.log("lessonWeeks: ", lessonWeeks);

    return (
        <ThemedView>
            {lessonWeeks.map((lessons) => (  
                <React.Fragment key={`week-${lessons[0].lessonWeek}`}>
                    <LessonWeekContainer lessons={lessons} />
                </React.Fragment>
            ))}
        </ThemedView>
    );
}