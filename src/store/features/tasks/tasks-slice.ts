import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskRaw, TaskStatus } from '~/types/task';
import { mockTasks } from '~/data/mock-tasks';

export interface TasksState {
  tasks: TaskRaw[];
  selectedTaskId: string | null;
}

const initialState: TasksState = {
  tasks: mockTasks,
  selectedTaskId: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Task CRUD operations
    addTask: (state, action: PayloadAction<TaskRaw>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TaskRaw> }>,
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
      const currentIndex = state.tasks.findIndex(
        (task) => task.id === taskIdToDelete,
      );

      // If the task being deleted is currently selected, select the next task
      if (state.selectedTaskId === taskIdToDelete) {
        if (currentIndex !== -1 && state.tasks.length > 1) {
          // Try to select the next task, or the previous one if this is the last task
          const nextIndex =
            currentIndex < state.tasks.length - 1
              ? currentIndex + 1
              : currentIndex - 1;
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
      action: PayloadAction<{ id: string; status: TaskStatus }>,
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
    // Assignee operations
    assignTask: (
      state,
      action: PayloadAction<{ id: string; assigneeId: string }>,
    ) => {
      const { id, assigneeId } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.assigneeId = assigneeId;
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
    selectNextTask: (state) => {
      if (state.tasks.length === 0) return;

      if (!state.selectedTaskId) {
        // No task selected, select the first one
        state.selectedTaskId = state.tasks[0].id;
        return;
      }

      const currentIndex = state.tasks.findIndex(
        (task) => task.id === state.selectedTaskId,
      );
      if (currentIndex !== -1 && currentIndex < state.tasks.length - 1) {
        // Select the next task
        state.selectedTaskId = state.tasks[currentIndex + 1].id;
      }
      // If already at the last task, do nothing (stay at current)
    },
    selectPreviousTask: (state) => {
      if (state.tasks.length === 0) return;

      if (!state.selectedTaskId) {
        // No task selected, select the last one
        state.selectedTaskId = state.tasks[state.tasks.length - 1].id;
        return;
      }

      const currentIndex = state.tasks.findIndex(
        (task) => task.id === state.selectedTaskId,
      );
      if (currentIndex > 0) {
        // Select the previous task
        state.selectedTaskId = state.tasks[currentIndex - 1].id;
      }
      // If already at the first task, do nothing (stay at current)
    },
    toggleSelectedTaskStatus: (state) => {
      if (state.selectedTaskId) {
        const task = state.tasks.find(
          (task) => task.id === state.selectedTaskId,
        );
        if (task) {
          task.status = task.status === 'done' ? 'todo' : 'done';
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    // Loading and error states
    clearCompletedTasks: (state) => {
      state.tasks = state.tasks.filter((task) => task.status !== 'done');
    },
    resetTasks: (state) => {
      state.tasks = mockTasks;
      state.selectedTaskId = null;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  toggleTaskStatus,
  assignTask,
  addTaskLabel,
  removeTaskLabel,
  setSelectedTask,
  clearSelectedTask,
  selectNextTask,
  selectPreviousTask,
  toggleSelectedTaskStatus,
  clearCompletedTasks,
  resetTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
