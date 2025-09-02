import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DisplayState {
  aiChatSidebarVisible: boolean;
}

const initialState: DisplayState = {
  aiChatSidebarVisible: false,
};

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    toggleAiChatSidebar: (state) => {
      state.aiChatSidebarVisible = !state.aiChatSidebarVisible;
    },
    setAiChatSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.aiChatSidebarVisible = action.payload;
    },
  },
});

export const { toggleAiChatSidebar, setAiChatSidebarVisible } =
  displaySlice.actions;

export default displaySlice.reducer;
