import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark' | 'system';
}

const initialState: ThemeState = {
  mode: 'system',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    resetTheme: () => {
      return initialState;
    },
  },
});

export const { setTheme, toggleTheme, resetTheme } = themeSlice.actions;

export default themeSlice.reducer;
