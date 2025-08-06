'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useAppDispatch } from '~/store/hooks';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import {
  toggleTaskStatus,
  deleteTask,
  clearSelectedTask,
} from '~/store/features/tasks/tasks-slice';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  taskUnselectCommand,
  TaskUnselectCommandIcon,
} from './task-commands';
import { useEffect } from 'react';
import { Todo } from '~/types/todo';

export function TaskToolbar({ selectedTask }: { selectedTask: Todo }) {
  const { registerCommand, unregisterCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const taskDeleteCommandItem = taskDeleteCommand(selectedTask.id);
    const taskUnselectCommandItem = taskUnselectCommand();

    registerCommand(taskDeleteCommandItem);
    registerCommand(taskUnselectCommandItem);

    return () => {
      unregisterCommand(taskDeleteCommandItem.id);
      unregisterCommand(taskUnselectCommandItem.id);
    };
  }, [registerCommand, unregisterCommand, selectedTask.id]);

  function handleDeleteSelected() {
    dispatch(deleteTask(selectedTask.id));
  }

  function handleToggleSelectedStatus() {
    dispatch(toggleTaskStatus(selectedTask.id));
  }

  function handleUnselect() {
    dispatch(clearSelectedTask());
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleSelectedStatus}
        className="gap-2">
        <RefreshCw className="size-4" />
        {selectedTask.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDeleteSelected}
        aria-label="Delete"
        className="gap-2">
        <TaskDeleteCommandIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleUnselect}
        aria-label="Clear selection"
        className="gap-2">
        <TaskUnselectCommandIcon className="size-4" />
      </Button>
    </>
  );
}
