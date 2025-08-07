import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '~/store/store';
import { TaskStatus } from '~/types/task';

// Base selectors
export function selectTasksState(state: RootState) {
  return state.tasks;
}
export function selectAllTasks(state: RootState) {
  return state.tasks.tasks;
}
export function selectTasksLoading(state: RootState) {
  return state.tasks.loading;
}
export function selectTasksError(state: RootState) {
  return state.tasks.error;
}
export function selectSelectedTaskId(state: RootState) {
  return state.tasks.selectedTaskId;
}

// Selected task selector
export const selectSelectedTask = createSelector(
  [selectAllTasks, selectSelectedTaskId],
  function (tasks, selectedTaskId) {
    if (!selectedTaskId) return null;
    return tasks.find((task) => task.id === selectedTaskId) || null;
  },
);

// Task by ID selector
export function selectTaskById(taskId: string) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.find((task) => task.id === taskId);
  });
}

// Status-based selectors
export function selectTasksByStatus(status: TaskStatus) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.filter((task) => task.status === status);
  });
}

export const selectTodoTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    return tasks.filter((task) => task.status === 'todo');
  },
);

export const selectInProgressTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    return tasks.filter((task) => task.status === 'in-progress');
  },
);

export const selectDoneTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    return tasks.filter((task) => task.status === 'done');
  },
);

export const selectCancelledTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    return tasks.filter((task) => task.status === 'cancelled');
  },
);

// Assignee-based selectors
export function selectTasksByAssignee(assigneeId: string) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.filter((task) => task.assignee?.id === assigneeId);
  });
}

export const selectUnassignedTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    return tasks.filter((task) => !task.assignee);
  },
);

// Label-based selectors
export function selectTasksByLabel(label: string) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.filter((task) => task.labels?.includes(label));
  });
}

export const selectAllLabels = createSelector(
  [selectAllTasks],
  function (tasks) {
    const labels = new Set<string>();
    tasks.forEach((task) => {
      task.labels?.forEach((label) => labels.add(label));
    });
    return Array.from(labels).sort();
  },
);

// Statistics selectors
export const selectTaskCounts = createSelector(
  [selectAllTasks],
  function (tasks) {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      done: tasks.filter((task) => task.status === 'done').length,
      cancelled: tasks.filter((task) => task.status === 'cancelled').length,
    };
  },
);

// Recently updated tasks selector
export const selectRecentlyUpdatedTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return tasks
      .filter((task) => new Date(task.updatedAt) > oneDayAgo)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  },
);

// Navigation availability selectors
export const selectSelectedTaskIndex = createSelector(
  [selectAllTasks, selectSelectedTaskId],
  function (tasks, selectedTaskId) {
    if (!selectedTaskId) return -1;
    return tasks.findIndex((task) => task.id === selectedTaskId);
  },
);

export const selectHasNextTask = createSelector(
  [selectAllTasks, selectSelectedTaskIndex],
  function (tasks, selectedIndex) {
    if (selectedIndex === -1 || tasks.length === 0) return false;
    return selectedIndex < tasks.length - 1;
  },
);

export const selectHasPreviousTask = createSelector(
  [selectSelectedTaskIndex],
  function (selectedIndex) {
    if (selectedIndex === -1) return false;
    return selectedIndex > 0;
  },
);
