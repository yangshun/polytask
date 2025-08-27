import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface DisplayState {
  visibleFields: TaskDisplayField[];
  sortBy: TaskSortField;
  sortDirection: TaskSortDirection;
}

const initialState: DisplayState = {
  visibleFields: defaultVisibleFields,
  sortBy: 'title',
  sortDirection: 'desc',
};

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    toggleField: (state, action: PayloadAction<TaskDisplayField>) => {
      const field = action.payload;
      const index = state.visibleFields.indexOf(field);

      if (index === -1) {
        // Field is not visible, add it
        state.visibleFields.push(field);
      } else {
        // Field is visible, remove it (but keep at least title)
        if (field !== 'title') {
          state.visibleFields.splice(index, 1);
        }
      }
    },
    setVisibleFields: (state, action: PayloadAction<TaskDisplayField[]>) => {
      // Always ensure title is included
      const fields = action.payload;

      if (!fields.includes('title')) {
        fields.push('title');
      }

      state.visibleFields = fields;
    },
    setSortBy: (state, action: PayloadAction<TaskSortField>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<TaskSortDirection>) => {
      state.sortDirection = action.payload;
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    resetToDefault: (state) => {
      state.visibleFields = [...defaultVisibleFields];
      state.sortBy = initialState.sortBy;
      state.sortDirection = initialState.sortDirection;
    },
  },
});

export const {
  toggleField,
  setVisibleFields,
  setSortBy,
  setSortDirection,
  toggleSortDirection,
  resetToDefault,
} = displaySlice.actions;

export default displaySlice.reducer;
