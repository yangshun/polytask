import undoable, { groupByActionTypes } from 'redux-undo';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskPriority, TaskRaw, TaskStatus } from '@/components/tasks/types';
import { mockTasks } from '@/data/mock-tasks';

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

export type TaskBulkEditOperation =
  | { type: 'create'; task: TaskRaw }
  | { type: 'update'; id: string; updates: Partial<TaskRaw> }
  | { type: 'delete'; id: string }
  | { type: 'assign'; id: string; assigneeId: string }
  | { type: 'unassign'; id: string }
  | { type: 'addLabel'; id: string; label: string }
  | { type: 'removeLabel'; id: string; label: string };

const defaultSortField: TaskSortField = 'id';
const defaultSortDirection: TaskSortDirection = 'desc';

function parseTaskId(id: string) {
  const match = id.match(/^([A-Z]+)-(\d+)$/);

  if (match) {
    return { prefix: match[1], number: parseInt(match[2], 10) };
  }

  return { prefix: id, number: 0 };
}

function sortTasks(
  tasks: TaskRaw[],
  sortBy: TaskSortField,
  sortDirection: TaskSortDirection,
): TaskRaw[] {
  return [...tasks].sort((a, b) => {
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
        const statusOrder: TaskStatus[] = [
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
        const priorityOrder: TaskPriority[] = [0, 4, 3, 2, 1];
        valueA = priorityOrder.indexOf(a.priority);
        valueB = priorityOrder.indexOf(b.priority);
        break;
      case 'updatedAt':
        valueA = new Date(a.updatedAt).getTime();
        valueB = new Date(b.updatedAt).getTime();
        break;
      case 'createdAt':
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
}

const initialState: TasksState = {
  tasks: sortTasks(mockTasks, defaultSortField, defaultSortDirection),
  selectedTaskId: null,
  visibleFields: defaultVisibleFields,
  sortBy: defaultSortField,
  sortDirection: defaultSortDirection,
  sortFieldHidden: false,
};

function resortTasks(state: TasksState) {
  state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
}

function addTaskToState(state: TasksState, task: TaskRaw) {
  state.tasks.unshift(task);
  resortTasks(state);
}

function updateTaskInState(
  state: TasksState,
  payload: { id: string; updates: Partial<TaskRaw> },
  updatedAt: string = new Date().toISOString(),
) {
  const { id, updates } = payload;
  const taskIndex = state.tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return;
  }

  state.tasks[taskIndex] = {
    ...state.tasks[taskIndex],
    ...updates,
    updatedAt,
  };
  resortTasks(state);
}

function deleteTaskFromState(state: TasksState, taskIdToDelete: string) {
  const currentIndex = state.tasks.findIndex(
    (task) => task.id === taskIdToDelete,
  );

  if (state.selectedTaskId === taskIdToDelete) {
    if (currentIndex !== -1 && state.tasks.length > 1) {
      const nextIndex =
        currentIndex < state.tasks.length - 1
          ? currentIndex + 1
          : currentIndex - 1;
      state.selectedTaskId = state.tasks[nextIndex].id;
    } else {
      state.selectedTaskId = null;
    }
  }

  state.tasks = state.tasks.filter((task) => task.id !== taskIdToDelete);
}

function assignTaskInState(
  state: TasksState,
  payload: { id: string; assigneeId: string },
  updatedAt: string = new Date().toISOString(),
) {
  const { id, assigneeId } = payload;
  const task = state.tasks.find((task) => task.id === id);

  if (task == null) {
    return;
  }

  task.assigneeId = assigneeId;
  task.updatedAt = updatedAt;
  resortTasks(state);
}

function unassignTaskInState(
  state: TasksState,
  id: string,
  updatedAt: string = new Date().toISOString(),
) {
  const task = state.tasks.find((task) => task.id === id);

  if (task == null) {
    return;
  }

  task.assigneeId = undefined;
  task.updatedAt = updatedAt;
  resortTasks(state);
}

function addTaskLabelInState(
  state: TasksState,
  payload: { id: string; label: string },
  updatedAt: string = new Date().toISOString(),
) {
  const { id, label } = payload;
  const task = state.tasks.find((task) => task.id === id);

  if (task == null) {
    return;
  }

  if (!task.labels) {
    task.labels = [];
  }

  if (!task.labels.includes(label)) {
    task.labels.push(label);
    task.updatedAt = updatedAt;
    resortTasks(state);
  }
}

function removeTaskLabelInState(
  state: TasksState,
  payload: { id: string; label: string },
  updatedAt: string = new Date().toISOString(),
) {
  const { id, label } = payload;
  const task = state.tasks.find((task) => task.id === id);

  if (task == null || task.labels == null) {
    return;
  }

  task.labels = task.labels.filter((label_) => label_ !== label);
  task.updatedAt = updatedAt;
}

function applyTaskBulkEditOperation(
  state: TasksState,
  operation: TaskBulkEditOperation,
  updatedAt: string = new Date().toISOString(),
) {
  switch (operation.type) {
    case 'create':
      addTaskToState(state, operation.task);
      return;
    case 'update':
      updateTaskInState(
        state,
        { id: operation.id, updates: operation.updates },
        updatedAt,
      );
      return;
    case 'delete':
      deleteTaskFromState(state, operation.id);
      return;
    case 'assign':
      assignTaskInState(
        state,
        { id: operation.id, assigneeId: operation.assigneeId },
        updatedAt,
      );
      return;
    case 'unassign':
      unassignTaskInState(state, operation.id, updatedAt);
      return;
    case 'addLabel':
      addTaskLabelInState(
        state,
        { id: operation.id, label: operation.label },
        updatedAt,
      );
      return;
    case 'removeLabel':
      removeTaskLabelInState(
        state,
        { id: operation.id, label: operation.label },
        updatedAt,
      );
      return;
  }
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskRaw>) => {
      addTaskToState(state, action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TaskRaw> }>,
    ) => {
      updateTaskInState(state, action.payload);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      deleteTaskFromState(state, action.payload);
    },
    assignTask: (
      state,
      action: PayloadAction<{ id: string; assigneeId: string }>,
    ) => {
      assignTaskInState(state, action.payload);
    },
    addTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      addTaskLabelInState(state, action.payload);
    },
    removeTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      removeTaskLabelInState(state, action.payload);
    },
    bulkEditTasks: (state, action: PayloadAction<TaskBulkEditOperation[]>) => {
      const updatedAt = new Date().toISOString();

      action.payload.forEach((operation) => {
        applyTaskBulkEditOperation(state, operation, updatedAt);
      });
    },
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTaskId = null;
    },
    selectNextTask: (state) => {
      if (state.tasks.length === 0) {
        return;
      }

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
      if (state.tasks.length === 0) {
        return;
      }

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
      state.tasks = sortTasks(mockTasks, state.sortBy, state.sortDirection);
      state.selectedTaskId = null;
    },
    toggleFieldVisibility: (state, action: PayloadAction<TaskDisplayField>) => {
      const field = action.payload;
      const index = state.visibleFields.indexOf(field);

      if (index === -1) {
        // Field is not visible, add it
        state.visibleFields.push(field);
        if (field === state.sortBy) {
          state.sortFieldHidden = false;
        }

        return;
      }

      // Field is visible, remove it (but keep at least title)
      if (field === 'title') {
        return;
      }

      state.visibleFields.splice(index, 1);
      if (field === state.sortBy) {
        state.sortFieldHidden = true;
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
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    setFieldsSortDirection: (
      state,
      action: PayloadAction<TaskSortDirection>,
    ) => {
      state.sortDirection = action.payload;
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    toggleFieldsSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    resetFieldsToDefault: (state) => {
      state.visibleFields = [...defaultVisibleFields];
      state.sortBy = initialState.sortBy;
      state.sortDirection = initialState.sortDirection;
      state.sortFieldHidden = initialState.sortFieldHidden;
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
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
  bulkEditTasks,
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

export function applyTaskBulkEdits(
  state: TasksState,
  operations: TaskBulkEditOperation[],
) {
  return tasksSlice.reducer(state, bulkEditTasks(operations));
}

const undoableTasks = undoable(tasksSlice.reducer, {
  groupBy: groupByActionTypes([selectNextTask.type, selectPreviousTask.type]),
});

export default undoableTasks;
