import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/theme/theme-slice';
import tasksReducer from './features/tasks/tasks-slice';
import displayReducer from './features/display/display-slice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tasks: tasksReducer,
    display: displayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
