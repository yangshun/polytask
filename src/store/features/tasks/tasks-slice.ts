import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '~/types/todo';
import { mockTodos } from '~/data/mock-todos';

export interface TasksState {
  tasks: Todo[];
  selectedTaskId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: mockTodos,
  selectedTaskId: null,
  loading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Task CRUD operations
    addTask: (state, action: PayloadAction<Todo>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Todo> }>,
    ) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskIdToDelete = action.payload;
      const currentIndex = state.tasks.findIndex((task) => task.id === taskIdToDelete);
      
      // If the task being deleted is currently selected, select the next task
      if (state.selectedTaskId === taskIdToDelete) {
        if (currentIndex !== -1 && state.tasks.length > 1) {
          // Try to select the next task, or the previous one if this is the last task
          const nextIndex = currentIndex < state.tasks.length - 1 ? currentIndex + 1 : currentIndex - 1;
          state.selectedTaskId = state.tasks[nextIndex].id;
        } else {
          // No other tasks available, clear selection
          state.selectedTaskId = null;
        }
      }
      
      // Remove the task from the list
      state.tasks = state.tasks.filter((task) => task.id !== taskIdToDelete);
    },
    // Status operations
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: Todo['status'] }>,
    ) => {
      const { id, status } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
      }
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.status = task.status === 'done' ? 'todo' : 'done';
        task.updatedAt = new Date().toISOString();
      }
    },
    // Priority operations
    updateTaskPriority: (
      state,
      action: PayloadAction<{ id: string; priority: Todo['priority'] }>,
    ) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.priority = priority;
        task.updatedAt = new Date().toISOString();
      }
    },
    // Assignee operations
    assignTask: (
      state,
      action: PayloadAction<{ id: string; assignee: Todo['assignee'] }>,
    ) => {
      const { id, assignee } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.assignee = assignee;
        task.updatedAt = new Date().toISOString();
      }
    },
    // Labels operations
    addTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      const { id, label } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        if (!task.labels) {
          task.labels = [];
        }
        if (!task.labels.includes(label)) {
          task.labels.push(label);
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    removeTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      const { id, label } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task && task.labels) {
        task.labels = task.labels.filter((l) => l !== label);
        task.updatedAt = new Date().toISOString();
      }
    },
    // Task selection operations
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTaskId = null;
    },
    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Bulk operations
    clearCompletedTasks: (state) => {
      state.tasks = state.tasks.filter((task) => task.status !== 'done');
    },
    resetTasks: (state) => {
      state.tasks = mockTodos;
      state.selectedTaskId = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  toggleTaskStatus,
  updateTaskPriority,
  assignTask,
  addTaskLabel,
  removeTaskLabel,
  setSelectedTask,
  clearSelectedTask,
  setLoading,
  setError,
  clearCompletedTasks,
  resetTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
