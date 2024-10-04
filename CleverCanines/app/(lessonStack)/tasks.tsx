
import { gql, useQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { client } from "../../apolloClient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TaskButton from "@/components/TaskButton";
import TaskPath from "@/components/TaskPath";
import React from "react";


export default function TaskScreen() {
    // get the lesson we want to display the tasks for
    const lessonId = useLocalSearchParams().lessonId;
    const router = useRouter();

    // get the tasks for the lesson
    const GET_TASKS_BY_LESSON = gql`
        query GetTasksForLesson($lessonId: ID!) {
            getTasksByLessonId(lessonId: $lessonId) {
                description
                id
                lessonId
                orderIndex
                title
            }
        }
    `;

    // Get tasks from server for the current lesson
    const { loading, error, data } = useQuery(GET_TASKS_BY_LESSON, {
        client: client,
        variables: { lessonId: lessonId },
    });

    if (loading) return <ThemedText>Loading...</ThemedText>;
    if (error) return <ThemedText>Error: {error.message}</ThemedText>;
    let tasks = data.getTasksByLessonId;

    interface Task {
        description: string;
        id: string;
        lessonId: string;
        orderIndex: number;
        title: string;
    }

    return (
        <ThemedView>
            {tasks.map((task: Task, index: number) => (
                <React.Fragment key={task.id}>
                    <TaskButton title={task.title} progress={55} onPress={() => {
                        router.push({
                            pathname: '/screen',
                            params: {
                                taskId: task.id,
                                title: task.title
                            }
                        });
                    }} />
                    {index < tasks.length - 1 && (
                        <TaskPath fill={ true } left={ index%2 === 1 } />
                    )}
                </React.Fragment>
            ))}
        </ThemedView>
    );
}