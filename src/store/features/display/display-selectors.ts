import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/store/store';
import { TaskObject } from '~/components/tasks/types';
import { TaskDisplayField, TaskSortDirection } from './display-slice';
import { selectAllTasks } from '../tasks/tasks-selectors';

export const selectVisibleFields = (state: RootState): TaskDisplayField[] =>
  state.display.visibleFields;

export const selectIsFieldVisible =
  (field: TaskDisplayField) =>
  (state: RootState): boolean =>
    state.display.visibleFields.includes(field);

export const selectSortBy = (state: RootState): TaskDisplayField =>
  state.display.sortBy;

export const selectSortDirection = (state: RootState): TaskSortDirection =>
  state.display.sortDirection;

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

function parseTaskId(id: string) {
  const match = id.match(/^([A-Z]+)-(\d+)$/);

  if (match) {
    return { prefix: match[1], number: parseInt(match[2], 10) };
  }

  return { prefix: id, number: 0 };
}

export const selectSortedTasks = createSelector(
  [selectAllTasks, selectSortBy, selectSortDirection],
  (tasks, sortBy, sortDirection): TaskObject[] => {
    const sortedTasks = [...tasks].sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (sortBy) {
        case 'id':
          const idA = parseTaskId(a.id);
          const idB = parseTaskId(b.id);

          if (idA.prefix !== idB.prefix) {
            valueA = idA.prefix;
            valueB = idB.prefix;
          } else {
            valueA = idA.number;
            valueB = idB.number;
          }
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'status':
          // TODO: Consolidate with statuses enum.
          const statusOrder = [
            'cancelled',
            'done',
            'todo',
            'in-progress',
            'in-review',
          ];
          valueA = statusOrder.indexOf(a.status);
          valueB = statusOrder.indexOf(b.status);
          break;
        case 'priority':
          // TODO: Consolidate with priorities values.
          const priorityOrder = [0, 4, 3, 2, 1];
          valueA = priorityOrder.indexOf(a.priority);
          valueB = priorityOrder.indexOf(b.priority);
          break;
        case 'assignee':
          valueA = a.assignee?.name?.toLowerCase() || '';
          valueB = b.assignee?.name?.toLowerCase() || '';
          break;
        case 'updatedAt':
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
          break;
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
      }

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return sortedTasks;
  },
);
