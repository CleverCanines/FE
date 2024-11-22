import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lesson, Task, Screen } from '@/dataTypes/LessonTypes';

//define a type for the slice state
export interface NewLessonState {
    lessonInfo: Lesson;

    // all the tasks in the lesson
    tasks: Task[];

    // all the screens in the lesson separated by task, 
    // task index must match the index in the tasks array
    screens: Screen[][];
};

// define the initial state using that type
const initialTask: Task = { 
    description: "", 
    id: "", 
    lessonId: "", 
    orderIndex: 0, 
    title: "Task 1" 
};

const initialScreen: Screen = {
    orderIndex: 0,
    title: "Screen 1",
    text: "",
    videoUrl: "",
    imageUrl: "",
    onlyInstruction: false,
    taskId: ""
};

const initialState: NewLessonState = {
    lessonInfo: {
        description: "",
        id: "",
        lessonType: "client",
        lessonWeek: 0,
        orderIndex: 0,
        title: ""
    },
    tasks: [initialTask] as Task[],
    screens: [[initialScreen]] as Screen[][]
} as NewLessonState;

// Define the slice
export const newLessonSlice = createSlice({
    name: 'newLesson',
    initialState,
    reducers: {
        setLesson: (state, action: PayloadAction<Lesson>) => {
            state.lessonInfo = action.payload;
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
        setScreens: (state, action: PayloadAction<Screen[][]>) => {
            state.screens = action.payload;
        },
        setLessonType: (state, action: PayloadAction<string>) => {
            state.lessonInfo.lessonType = action.payload;
        }
    }
});

export const { setLesson, setTasks, setScreens, setLessonType } = newLessonSlice.actions;
export default newLessonSlice.reducer;