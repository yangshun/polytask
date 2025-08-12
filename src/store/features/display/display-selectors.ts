import { RootState } from '~/store/store';
import { TaskDisplayField } from './display-slice';

export const selectVisibleFields = (state: RootState): TaskDisplayField[] =>
  state.display.visibleFields;

export const selectIsFieldVisible =
  (field: TaskDisplayField) =>
  (state: RootState): boolean =>
    state.display.visibleFields.includes(field);

export const selectFieldLabels = (): Record<TaskDisplayField, string> => ({
  id: 'ID',
  priority: 'Priority',
  status: 'Status',
  title: 'Title',
  assignee: 'Assignee',
  createdAt: 'Created',
  updatedAt: 'Updated',
  labels: 'Labels',
});
