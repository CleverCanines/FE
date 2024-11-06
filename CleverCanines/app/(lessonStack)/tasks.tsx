
import { gql, useQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { client } from "../../apolloClient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { groupInfo } from "@/stores/groupInfo";
import TaskButton from "@/components/TaskButton";
import TaskPath from "@/components/TaskPath";
import React, { useEffect } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";


const GET_TASKS_BY_LESSON = gql`
        query GetTasksForLesson($lessonId: ID!, $personId: ID!) {
            getTasksByLessonId(lessonId: $lessonId) {
                description
                id
                lessonId
                orderIndex
                title
            }
            getTaskInteractionsByPersonId(personId: $personId) {
                personId
                taskId
                progress
            }
        }
    `;

// define the task interface (matches backend and gql schema)
interface Task {
    description: string;
    id: string;
    lessonId: string;
    orderIndex: number;
    title: string;
}
 // define the interaction interface (matches backend and gql schema)
interface Interaction {
    personId: string;
    taskId: string;
    progress: number;
}


export default function TaskScreen() {
    // get the lesson we want to display the tasks for
    const lessonId = useLocalSearchParams().lessonId;
    const personId = groupInfo.getState().group.id;
    const router = useRouter();

    // states for task data and interactions
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [interactions, setInteractions] = React.useState<Interaction[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    // Get tasks from server for the current lesson
    const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_LESSON, {
        client: client,
        variables: { lessonId: lessonId, personId: personId },
    });

    useEffect(() => {
        if (data) {
            setTasks(data.getTasksByLessonId);
            setInteractions(data.getTaskInteractionsByPersonId);
        }
    }, [data]);

    const onRefresh = () => {
        setRefreshing(true);
        refetch().then(() => setRefreshing(false));
    }


    if (loading) return (
        <ThemedView>
            <ThemedText>Loading Lesson Data...</ThemedText>
        </ThemedView>
    );
    if (error) return (
        <ThemedView>
            <ThemedText>Error fetching lesson data</ThemedText>
            <ThemedText>Error: {error.message}</ThemedText>
        </ThemedView>
    );

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <ThemedView>
                {tasks.map((task: Task, index: number) => (
                    <React.Fragment key={task.id}>
                        <TaskButton 
                            title={task.title} 
                            progress={(() => {
                                const interaction = interactions.find((interaction: Interaction) => interaction.taskId === task.id);
                                return interaction ? interaction.progress : 0;
                            })()} 
                            unlocked={index === 0 || interactions.find((interaction: Interaction) => interaction.taskId === tasks[index - 1].id)?.progress === 100}
                            onPress={() => {
                                if (index > 0 && interactions.find((interaction: Interaction) => interaction.taskId === tasks[index - 1].id)?.progress !== 100) {
                                    return;
                                }
                                router.push({
                                    pathname: '/screen',
                                    params: {
                                        taskId: task.id,
                                        title: task.title
                                    }
                                });
                        }} />
                        {index < tasks.length - 1 && (
                            <TaskPath 
                            fill={interactions.find((interaction: Interaction) => interaction.taskId === task.id)?.progress === 100}
                            left={ index%2 === 1 } />
                        )}
                    </React.Fragment>
                ))}
            </ThemedView>
        </ScrollView>
    );
}

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