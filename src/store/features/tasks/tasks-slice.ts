import undoable, { groupByActionTypes } from 'redux-undo';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskRaw } from '~/components/tasks/types';
import { mockTasks } from '~/data/mock-tasks';

export type TaskDisplayField =
  | 'id'
  | 'priority'
  | 'status'
  | 'title'
  | 'assignee'
  | 'createdAt'
  | 'updatedAt'
  | 'labels';

const defaultVisibleFields: TaskDisplayField[] = [
  'priority',
  'id',
  'status',
  'title',
  'assignee',
  'createdAt',
  'updatedAt',
];

export const taskSortFields = [
  'id',
  'priority',
  'status',
  'title',
  'assignee',
  'createdAt',
  'updatedAt',
] as const;
export type TaskSortField = (typeof taskSortFields)[number];
export type TaskSortDirection = 'asc' | 'desc';

export interface TasksState {
  tasks: TaskRaw[];
  selectedTaskId: string | null;
  visibleFields: TaskDisplayField[];
  sortBy: TaskSortField;
  sortDirection: TaskSortDirection;
  sortFieldHidden: boolean;
}

const initialState: TasksState = {
  tasks: mockTasks,
  selectedTaskId: null,
  visibleFields: defaultVisibleFields,
  sortBy: 'title',
  sortDirection: 'desc',
  sortFieldHidden: false,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskRaw>) => {
      state.tasks.unshift(action.payload);
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
    resetTasks: (state) => {
      state.tasks = mockTasks;
      state.selectedTaskId = null;
    },
    // Display-related reducers
    toggleFieldVisibility: (state, action: PayloadAction<TaskDisplayField>) => {
      const field = action.payload;
      const index = state.visibleFields.indexOf(field);

      if (index === -1) {
        // Field is not visible, add it
        state.visibleFields.push(field);
        if (field === state.sortBy) {
          state.sortFieldHidden = false;
        }
      } else {
        // Field is visible, remove it (but keep at least title)
        if (field !== 'title') {
          state.visibleFields.splice(index, 1);
          if (field === state.sortBy) {
            state.sortFieldHidden = true;
          }
        }
      }
    },
    setFieldsVisibility: (state, action: PayloadAction<TaskDisplayField[]>) => {
      // Always ensure title is included
      const fields = action.payload;

      if (!fields.includes('title')) {
        fields.push('title');
      }

      state.visibleFields = fields;
    },
    setFieldsSortBy: (state, action: PayloadAction<TaskSortField>) => {
      const newSortField = action.payload;
      const currentSortField = state.sortBy;

      if (state.sortFieldHidden && currentSortField !== 'title') {
        const fieldIndex = state.visibleFields.indexOf(currentSortField);
        if (fieldIndex !== -1) {
          state.visibleFields.splice(fieldIndex, 1);
        }
      }

      const isNewFieldHidden = !state.visibleFields.includes(newSortField);
      if (isNewFieldHidden) {
        state.visibleFields.push(newSortField);
      }

      state.sortBy = newSortField;
      state.sortFieldHidden = isNewFieldHidden;
    },
    setFieldsSortDirection: (
      state,
      action: PayloadAction<TaskSortDirection>,
    ) => {
      state.sortDirection = action.payload;
    },
    toggleFieldsSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    resetFieldsToDefault: (state) => {
      state.visibleFields = [...defaultVisibleFields];
      state.sortBy = initialState.sortBy;
      state.sortDirection = initialState.sortDirection;
      state.sortFieldHidden = initialState.sortFieldHidden;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  assignTask,
  addTaskLabel,
  removeTaskLabel,
  setSelectedTask,
  clearSelectedTask,
  selectNextTask,
  selectPreviousTask,
  resetTasks,
  toggleFieldVisibility,
  setFieldsVisibility,
  setFieldsSortBy,
  setFieldsSortDirection,
  toggleFieldsSortDirection,
  resetFieldsToDefault,
} = tasksSlice.actions;

const undoableTasks = undoable(tasksSlice.reducer, {
  groupBy: groupByActionTypes([selectNextTask.type, selectPreviousTask.type]),
});

export default undoableTasks;
