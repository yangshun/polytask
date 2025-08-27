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

export type SortDirection = 'asc' | 'desc';

export interface DisplayState {
  visibleFields: TaskDisplayField[];
  sortBy: TaskDisplayField;
  sortDirection: SortDirection;
}

const defaultDisplayConfig: DisplayState = {
  visibleFields: [
    'priority',
    'id',
    'status',
    'title',
    'assignee',
    'createdAt',
    'updatedAt',
  ],
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

const initialState: DisplayState = {
  ...defaultDisplayConfig,
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
    setSortBy: (state, action: PayloadAction<TaskDisplayField>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload;
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    resetToDefault: (state) => {
      state.visibleFields = [...defaultDisplayConfig.visibleFields];
      state.sortBy = defaultDisplayConfig.sortBy;
      state.sortDirection = defaultDisplayConfig.sortDirection;
    },
  },
});

export const { 
  toggleField, 
  setVisibleFields, 
  setSortBy, 
  setSortDirection, 
  toggleSortDirection, 
  resetToDefault 
} = displaySlice.actions;

export default displaySlice.reducer;
