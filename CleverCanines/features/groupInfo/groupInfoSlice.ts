import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Group {
    Unknown,
    Client,
    Raiser,
    Staff
};

// Define a type for the slice state
export interface GroupState {
  value: Group
};

// Define the initial state using that type
const initialState: GroupState = {
  value: Group.Unknown
} as GroupState;

export const GroupSlice = createSlice({
  name: 'group',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<Group>) => {
      state.value = action.payload
    }
  }
});

export const { setGroup } = GroupSlice.actions;
export default GroupSlice.reducer;