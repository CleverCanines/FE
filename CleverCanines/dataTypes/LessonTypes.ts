// define the lesson type (matches backend and gql schema)
export interface Lesson {
    description: string;
    id: string;
    lessonType: string;
    lessonWeek: number;
    orderIndex: number;
    title: string;
} 

export type LessonInteraction = {
    lessonId: string,
    personId: string,
    progress: number
  };

export interface Task {
    description: string;
    id: string;
    lessonId: string;
    orderIndex: number;
    title: string;
}

export interface TaskInteraction {
    personId: string;
    taskId: string;
    progress: number;
}

export type Screen = {
    // has an id as well but set automatically by the backend
    orderIndex: number;
    title: string;
    text: string;
    videoUrl: string;
    imageUrl: string;
    onlyInstruction: boolean;
    taskId: string;
}