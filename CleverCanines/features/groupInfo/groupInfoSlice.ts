import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Group {
    Client = "client",
    Raiser = "raiser",
    Staff = "staff"
};

// Define a type for the slice state
export interface GroupState {
  group: Group
  id: string
};

// Define the initial state using that type
const initialState: GroupState = {
  group: Group.Client,
  id: ""
} as GroupState;

export interface SetGroupPayload {
  group: Group;
  id: string;
}

export const GroupSlice = createSlice({
  name: 'group',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<SetGroupPayload>) => {
      state.group = action.payload.group
      state.id = action.payload.id
    }
  }
});

export const { setGroup } = GroupSlice.actions;
export default GroupSlice.reducer;