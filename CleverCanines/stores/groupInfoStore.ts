import { configureStore } from '@reduxjs/toolkit';
import groupReducer from '@/features/groupInfo/groupInfoSlice';

export const groupInfo = configureStore({
  reducer: {
    group: groupReducer
  }
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof groupInfo.getState>;
// Inferred type: {group: GroupsState}
export type AppDispatch = typeof groupInfo.dispatch;
export type AppStore = typeof groupInfo;