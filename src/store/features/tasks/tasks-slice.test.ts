import { describe, expect, it } from 'vitest';
import { TaskRaw } from '@/components/tasks/types';
import {
  tasksSlice,
  addTask,
  updateTask,
  deleteTask,
  assignTask,
  addTaskLabel,
  removeTaskLabel,
  setSelectedTask,
  clearSelectedTask,
  selectNextTask,
  selectPreviousTask,
  toggleFieldVisibility,
  setFieldsVisibility,
  setFieldsSortBy,
  setFieldsSortDirection,
  toggleFieldsSortDirection,
  TasksState,
} from './tasks-slice';

const reducer = tasksSlice.reducer;

function makeTask(overrides: Partial<TaskRaw> = {}): TaskRaw {
  return {
    id: 'TST-1',
    title: 'Test task',
    status: 'todo',
    priority: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeState(overrides: Partial<TasksState> = {}): TasksState {
  return {
    tasks: [],
    selectedTaskId: null,
    visibleFields: [
      'priority',
      'id',
      'status',
      'title',
      'assignee',
      'createdAt',
      'updatedAt',
    ],
    sortBy: 'id',
    sortDirection: 'desc',
    sortFieldHidden: false,
    ...overrides,
  };
}

describe('tasks-slice reducers', () => {
  describe('addTask', () => {
    it('adds a task to the list', () => {
      const state = makeState();
      const task = makeTask();
      const next = reducer(state, addTask(task));
      expect(next.tasks).toHaveLength(1);
      expect(next.tasks[0].id).toBe('TST-1');
    });

    it('maintains sort order after adding', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-3' }), makeTask({ id: 'TST-1' })],
        sortBy: 'id',
        sortDirection: 'asc',
      });
      const next = reducer(state, addTask(makeTask({ id: 'TST-2' })));
      expect(next.tasks.map((t) => t.id)).toEqual(['TST-1', 'TST-2', 'TST-3']);
    });
  });

  describe('updateTask', () => {
    it('updates an existing task', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(
        state,
        updateTask({ id: 'TST-1', updates: { title: 'Updated' } }),
      );
      expect(next.tasks[0].title).toBe('Updated');
    });

    it('does nothing for a non-existent task', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(
        state,
        updateTask({ id: 'NOPE-1', updates: { title: 'Updated' } }),
      );
      expect(next.tasks[0].title).toBe('Test task');
    });

    it('updates the updatedAt timestamp', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(
        state,
        updateTask({ id: 'TST-1', updates: { title: 'Updated' } }),
      );
      expect(next.tasks[0].updatedAt).not.toBe('2025-01-01T00:00:00Z');
    });
  });

  describe('deleteTask', () => {
    it('removes a task from the list', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
      });
      const next = reducer(state, deleteTask('TST-1'));
      expect(next.tasks).toHaveLength(1);
      expect(next.tasks[0].id).toBe('TST-2');
    });

    it('selects the next task when the selected task is deleted', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
        selectedTaskId: 'TST-1',
      });
      const next = reducer(state, deleteTask('TST-1'));
      expect(next.selectedTaskId).toBe('TST-2');
    });

    it('selects the previous task when the last task is deleted', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
        selectedTaskId: 'TST-2',
      });
      const next = reducer(state, deleteTask('TST-2'));
      expect(next.selectedTaskId).toBe('TST-1');
    });

    it('clears selection when the only task is deleted', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' })],
        selectedTaskId: 'TST-1',
      });
      const next = reducer(state, deleteTask('TST-1'));
      expect(next.selectedTaskId).toBeNull();
    });
  });

  describe('assignTask', () => {
    it('assigns an assignee to a task', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(state, assignTask({ id: 'TST-1', assigneeId: '5' }));
      expect(next.tasks[0].assigneeId).toBe('5');
    });

    it('does nothing for a non-existent task', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(
        state,
        assignTask({ id: 'NOPE-1', assigneeId: '5' }),
      );
      expect(next.tasks[0].assigneeId).toBeUndefined();
    });
  });

  describe('label operations', () => {
    it('adds a label to a task', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(state, addTaskLabel({ id: 'TST-1', label: 'bug' }));
      expect(next.tasks[0].labels).toContain('bug');
    });

    it('does not add duplicate labels', () => {
      const state = makeState({
        tasks: [makeTask({ labels: ['bug'] })],
      });
      const next = reducer(state, addTaskLabel({ id: 'TST-1', label: 'bug' }));
      expect(next.tasks[0].labels).toEqual(['bug']);
    });

    it('removes a label from a task', () => {
      const state = makeState({
        tasks: [makeTask({ labels: ['bug', 'feature'] })],
      });
      const next = reducer(
        state,
        removeTaskLabel({ id: 'TST-1', label: 'bug' }),
      );
      expect(next.tasks[0].labels).toEqual(['feature']);
    });
  });

  describe('task selection', () => {
    it('sets the selected task', () => {
      const state = makeState({ tasks: [makeTask()] });
      const next = reducer(state, setSelectedTask('TST-1'));
      expect(next.selectedTaskId).toBe('TST-1');
    });

    it('clears the selected task', () => {
      const state = makeState({ selectedTaskId: 'TST-1' });
      const next = reducer(state, clearSelectedTask());
      expect(next.selectedTaskId).toBeNull();
    });
  });

  describe('selectNextTask', () => {
    it('selects the first task when nothing is selected', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
      });
      const next = reducer(state, selectNextTask());
      expect(next.selectedTaskId).toBe('TST-1');
    });

    it('selects the next task', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
        selectedTaskId: 'TST-1',
      });
      const next = reducer(state, selectNextTask());
      expect(next.selectedTaskId).toBe('TST-2');
    });

    it('stays at the last task', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
        selectedTaskId: 'TST-2',
      });
      const next = reducer(state, selectNextTask());
      expect(next.selectedTaskId).toBe('TST-2');
    });

    it('does nothing when tasks are empty', () => {
      const state = makeState();
      const next = reducer(state, selectNextTask());
      expect(next.selectedTaskId).toBeNull();
    });
  });

  describe('selectPreviousTask', () => {
    it('selects the last task when nothing is selected', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
      });
      const next = reducer(state, selectPreviousTask());
      expect(next.selectedTaskId).toBe('TST-2');
    });

    it('selects the previous task', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
        selectedTaskId: 'TST-2',
      });
      const next = reducer(state, selectPreviousTask());
      expect(next.selectedTaskId).toBe('TST-1');
    });

    it('stays at the first task', () => {
      const state = makeState({
        tasks: [makeTask({ id: 'TST-1' }), makeTask({ id: 'TST-2' })],
        selectedTaskId: 'TST-1',
      });
      const next = reducer(state, selectPreviousTask());
      expect(next.selectedTaskId).toBe('TST-1');
    });
  });

  describe('sorting', () => {
    it('sorts by id ascending', () => {
      const state = makeState({
        tasks: [
          makeTask({ id: 'TST-3' }),
          makeTask({ id: 'TST-1' }),
          makeTask({ id: 'TST-2' }),
        ],
        sortBy: 'id',
        sortDirection: 'desc',
      });
      const next = reducer(state, setFieldsSortDirection('asc'));
      expect(next.tasks.map((t) => t.id)).toEqual(['TST-1', 'TST-2', 'TST-3']);
    });

    it('sorts by id descending', () => {
      const state = makeState({
        tasks: [
          makeTask({ id: 'TST-1' }),
          makeTask({ id: 'TST-3' }),
          makeTask({ id: 'TST-2' }),
        ],
        sortBy: 'id',
        sortDirection: 'asc',
      });
      const next = reducer(state, setFieldsSortDirection('desc'));
      expect(next.tasks.map((t) => t.id)).toEqual(['TST-3', 'TST-2', 'TST-1']);
    });

    it('sorts by title', () => {
      const state = makeState({
        tasks: [
          makeTask({ id: 'TST-1', title: 'Charlie' }),
          makeTask({ id: 'TST-2', title: 'Alpha' }),
          makeTask({ id: 'TST-3', title: 'Bravo' }),
        ],
      });
      const next = reducer(state, setFieldsSortBy('title'));
      // Default direction after setting sortBy stays the same (desc)
      const titles = next.tasks.map((t) => t.title);
      expect(titles).toEqual(['Charlie', 'Bravo', 'Alpha']);
    });

    it('sorts by priority', () => {
      const state = makeState({
        tasks: [
          makeTask({ id: 'TST-1', priority: 1 }),
          makeTask({ id: 'TST-2', priority: 4 }),
          makeTask({ id: 'TST-3', priority: 2 }),
        ],
      });
      const next = reducer(state, setFieldsSortBy('priority'));
      // Priority order: [0, 4, 3, 2, 1], desc reverses
      const priorities = next.tasks.map((t) => t.priority);
      expect(priorities).toEqual([1, 2, 4]);
    });

    it('sorts by status', () => {
      const state = makeState({
        tasks: [
          makeTask({ id: 'TST-1', status: 'done' }),
          makeTask({ id: 'TST-2', status: 'in-progress' }),
          makeTask({ id: 'TST-3', status: 'todo' }),
        ],
      });
      const next = reducer(state, setFieldsSortBy('status'));
      // Status order: ['cancelled', 'done', 'todo', 'in-progress', 'in-review'], desc reverses
      const statuses = next.tasks.map((t) => t.status);
      expect(statuses).toEqual(['in-progress', 'todo', 'done']);
    });

    it('toggles sort direction', () => {
      const state = makeState({ sortDirection: 'asc' });
      const next = reducer(state, toggleFieldsSortDirection());
      expect(next.sortDirection).toBe('desc');
      const next2 = reducer(next, toggleFieldsSortDirection());
      expect(next2.sortDirection).toBe('asc');
    });

    it('sorts by createdAt', () => {
      const state = makeState({
        tasks: [
          makeTask({ id: 'TST-1', createdAt: '2025-03-01T00:00:00Z' }),
          makeTask({ id: 'TST-2', createdAt: '2025-01-01T00:00:00Z' }),
          makeTask({ id: 'TST-3', createdAt: '2025-02-01T00:00:00Z' }),
        ],
        sortDirection: 'asc',
      });
      const next = reducer(state, setFieldsSortBy('createdAt'));
      expect(next.tasks.map((t) => t.id)).toEqual(['TST-2', 'TST-3', 'TST-1']);
    });
  });

  describe('field visibility', () => {
    it('toggles a field on', () => {
      const state = makeState({ visibleFields: ['title'] });
      const next = reducer(state, toggleFieldVisibility('labels'));
      expect(next.visibleFields).toContain('labels');
    });

    it('toggles a field off', () => {
      const state = makeState({
        visibleFields: ['title', 'priority'],
      });
      const next = reducer(state, toggleFieldVisibility('priority'));
      expect(next.visibleFields).not.toContain('priority');
    });

    it('does not allow removing title', () => {
      const state = makeState({ visibleFields: ['title'] });
      const next = reducer(state, toggleFieldVisibility('title'));
      expect(next.visibleFields).toContain('title');
    });

    it('setFieldsVisibility always includes title', () => {
      const state = makeState();
      const next = reducer(state, setFieldsVisibility(['priority', 'status']));
      expect(next.visibleFields).toContain('title');
    });
  });
});
