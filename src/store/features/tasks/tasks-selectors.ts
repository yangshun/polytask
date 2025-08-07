import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '~/store/store';
import { Todo } from '~/types/todo';

// Base selectors
export const selectTasksState = (state: RootState) => state.tasks;
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectSelectedTaskId = (state: RootState) =>
  state.tasks.selectedTaskId;

// Selected task selector
export const selectSelectedTask = createSelector(
  [selectAllTasks, selectSelectedTaskId],
  (tasks, selectedTaskId) => {
    if (!selectedTaskId) return null;
    return tasks.find((task) => task.id === selectedTaskId) || null;
  },
);

// Task by ID selector
export const selectTaskById = (taskId: string) =>
  createSelector([selectAllTasks], (tasks) =>
    tasks.find((task) => task.id === taskId),
  );

// Status-based selectors
export const selectTasksByStatus = (status: Todo['status']) =>
  createSelector([selectAllTasks], (tasks) =>
    tasks.filter((task) => task.status === status),
  );

export const selectTodoTasks = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task) => task.status === 'todo'),
);

export const selectInProgressTasks = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task) => task.status === 'in-progress'),
);

export const selectDoneTasks = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task) => task.status === 'done'),
);

export const selectCancelledTasks = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task) => task.status === 'cancelled'),
);

// Assignee-based selectors
export const selectTasksByAssignee = (assigneeId: string) =>
  createSelector([selectAllTasks], (tasks) =>
    tasks.filter((task) => task.assignee?.id === assigneeId),
  );

export const selectUnassignedTasks = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task) => !task.assignee),
);

// Label-based selectors
export const selectTasksByLabel = (label: string) =>
  createSelector([selectAllTasks], (tasks) =>
    tasks.filter((task) => task.labels?.includes(label)),
  );

export const selectAllLabels = createSelector([selectAllTasks], (tasks) => {
  const labels = new Set<string>();
  tasks.forEach((task) => {
    task.labels?.forEach((label) => labels.add(label));
  });
  return Array.from(labels).sort();
});

// Statistics selectors
export const selectTaskCounts = createSelector([selectAllTasks], (tasks) => ({
  total: tasks.length,
  todo: tasks.filter((task) => task.status === 'todo').length,
  inProgress: tasks.filter((task) => task.status === 'in-progress').length,
  done: tasks.filter((task) => task.status === 'done').length,
  cancelled: tasks.filter((task) => task.status === 'cancelled').length,
}));

// Overdue tasks selector
export const selectOverdueTasks = createSelector([selectAllTasks], (tasks) => {
  const now = new Date();
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < now;
  });
});

// Recently updated tasks selector
export const selectRecentlyUpdatedTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
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
  (tasks, selectedTaskId) => {
    if (!selectedTaskId) return -1;
    return tasks.findIndex((task) => task.id === selectedTaskId);
  },
);

export const selectHasNextTask = createSelector(
  [selectAllTasks, selectSelectedTaskIndex],
  (tasks, selectedIndex) => {
    if (selectedIndex === -1 || tasks.length === 0) return false;
    return selectedIndex < tasks.length - 1;
  },
);

export const selectHasPreviousTask = createSelector(
  [selectSelectedTaskIndex],
  (selectedIndex) => {
    if (selectedIndex === -1) return false;
    return selectedIndex > 0;
  },
);
