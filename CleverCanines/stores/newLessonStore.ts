import { configureStore } from '@reduxjs/toolkit';
import newLessonReducer from '@/features/createLesson/newLessonSlice';

export const newLessonStore = configureStore({
  reducer: {
    newLesson: newLessonReducer
  }
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof newLessonStore.getState>;
// Inferred type: {newLesson: NewLessonState}
export type AppDispatch = typeof newLessonStore.dispatch;
export type AppStore = typeof newLessonStore;