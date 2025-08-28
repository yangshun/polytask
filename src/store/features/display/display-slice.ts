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
  aiChatSidebarVisible: boolean;
  sortFieldHidden: boolean;
}

const initialState: DisplayState = {
  visibleFields: defaultVisibleFields,
  sortBy: 'title',
  sortDirection: 'desc',
  aiChatSidebarVisible: false,
  sortFieldHidden: false,
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
    setVisibleFields: (state, action: PayloadAction<TaskDisplayField[]>) => {
      // Always ensure title is included
      const fields = action.payload;

      if (!fields.includes('title')) {
        fields.push('title');
      }

      state.visibleFields = fields;
    },
    setSortBy: (state, action: PayloadAction<TaskSortField>) => {
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
      state.sortFieldHidden = initialState.sortFieldHidden;
    },
    toggleAiChatSidebar: (state) => {
      state.aiChatSidebarVisible = !state.aiChatSidebarVisible;
    },
    setAiChatSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.aiChatSidebarVisible = action.payload;
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
  toggleAiChatSidebar,
  setAiChatSidebarVisible,
} = displaySlice.actions;

export default displaySlice.reducer;
