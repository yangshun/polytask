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

export interface DisplayState {
  visibleFields: TaskDisplayField[];
}

const defaultVisibleFields: TaskDisplayField[] = [
  'priority',
  'id',
  'status',
  'title',
  'assignee',
  'createdAt',
  'updatedAt',
];

const initialState: DisplayState = {
  visibleFields: defaultVisibleFields,
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
    resetToDefault: (state) => {
      state.visibleFields = [...defaultVisibleFields];
    },
  },
});

export const { toggleField, setVisibleFields, resetToDefault } =
  displaySlice.actions;

export default displaySlice.reducer;
