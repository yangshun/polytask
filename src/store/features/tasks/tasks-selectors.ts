import { createSelector } from '@reduxjs/toolkit';
import { assignees } from '~/data/mock-assignees';
import { RootState } from '~/store/store';
import {
  TaskRaw,
  TaskObject,
  TaskStatus,
  TaskPriority,
} from '~/components/tasks/types';
import { TaskDisplayField, TaskSortDirection } from './tasks-slice';

function augmentTaskWithAssignee(task?: TaskRaw | null): TaskObject | null {
  if (task == null) {
    return null;
  }

  if (!task.assigneeId) {
    return { ...task, assignee: null };
  }

  const assignee = assignees.find((a) => a.id === task.assigneeId) ?? null;

  return {
    ...task,
    assignee,
  };
}

function augmentTasksWithAssignee(tasks: TaskRaw[]): Array<TaskObject> {
  return tasks.map(augmentTaskWithAssignee).flatMap((task) => task || []);
}

export const selectTasksCanUndo = (state: RootState) => {
  return state.tasks.past.length > 0;
};

export const selectTasksCanRedo = (state: RootState) => {
  return state.tasks.future.length > 0;
};

// Base selectors
export const selectRawTasks = (state: RootState) => state.tasks.present.tasks;

export const selectAllTasks = createSelector([selectRawTasks], (tasks) =>
  augmentTasksWithAssignee(tasks),
);

export function selectSelectedTaskId(state: RootState) {
  return state.tasks.present.selectedTaskId;
}

// Selected task selector
export const selectSelectedTask = createSelector(
  [selectAllTasks, selectSelectedTaskId],
  function (tasks, selectedTaskId) {
    if (!selectedTaskId) {
      return null;
    }

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

// Priority-based selectors
export function selectTasksByPriority(priority: TaskPriority) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.filter((task) => task.priority === priority);
  });
}

// Assignee-based selectors
export function selectTasksByAssignee(assigneeId: string) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.filter((task) => task.assignee?.id === assigneeId);
  });
}

export const selectUnassignedTasks = createSelector(
  [selectAllTasks],
  function (tasks) {
    return tasks.filter((task) => task.assignee != null);
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
      inReview: tasks.filter((task) => task.status === 'in-review').length,
      done: tasks.filter((task) => task.status === 'done').length,
      cancelled: tasks.filter((task) => task.status === 'cancelled').length,
      p0: tasks.filter((task) => task.priority === 0).length,
      p1: tasks.filter((task) => task.priority === 1).length,
      p2: tasks.filter((task) => task.priority === 2).length,
      p3: tasks.filter((task) => task.priority === 3).length,
      p4: tasks.filter((task) => task.priority === 4).length,
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
    if (selectedTaskId == null) {
      return -1;
    }
    return tasks.findIndex((task) => task.id === selectedTaskId);
  },
);

export const selectHasNextTask = createSelector(
  [selectAllTasks, selectSelectedTaskIndex],
  function (tasks, selectedIndex) {
    if (selectedIndex === -1 || tasks.length === 0) {
      return false;
    }

    return selectedIndex < tasks.length - 1;
  },
);

export const selectHasPreviousTask = createSelector(
  [selectSelectedTaskIndex],
  function (selectedIndex) {
    if (selectedIndex === -1) {
      return false;
    }

    return selectedIndex > 0;
  },
);

// Display-related selectors
export const selectVisibleFields = (state: RootState): TaskDisplayField[] =>
  state.tasks.present.visibleFields;

export const selectIsFieldVisible =
  (field: TaskDisplayField) =>
  (state: RootState): boolean =>
    state.tasks.present.visibleFields.includes(field);

export const selectSortBy = (state: RootState): TaskDisplayField =>
  state.tasks.present.sortBy;

export const selectSortDirection = (state: RootState): TaskSortDirection =>
  state.tasks.present.sortDirection;

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
