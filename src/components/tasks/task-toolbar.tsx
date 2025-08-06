'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import {
  toggleTaskStatus,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '~/store/features/tasks/tasks-slice';
import {
  selectHasNextTask,
  selectHasPreviousTask,
} from '~/store/features/tasks/tasks-selectors';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  TaskSelectNextCommandIcon,
  TaskSelectPreviousCommandIcon,
  taskUnselectCommand,
} from './task-commands';
import { useEffect } from 'react';
import { Todo } from '~/types/todo';

export function TaskToolbar({ selectedTask }: { selectedTask: Todo }) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(
      taskDeleteCommand(selectedTask.id),
    );
    const unregisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterTaskDelete();
      unregisterTaskUnselect();
    };
  }, [registerCommand, selectedTask.id]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          dispatch(toggleTaskStatus(selectedTask.id));
        }}
        className="gap-2">
        <RefreshCw className="size-4" />
        {selectedTask.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          dispatch(deleteTask(selectedTask.id));
        }}
        aria-label="Delete"
        className="gap-2">
        <TaskDeleteCommandIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          dispatch(selectNextTask());
        }}
        disabled={!hasNextTask}
        aria-label="Next task"
        className="gap-2">
        <TaskSelectNextCommandIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          dispatch(selectPreviousTask());
        }}
        disabled={!hasPreviousTask}
        aria-label="Prev task"
        className="gap-2">
        <TaskSelectPreviousCommandIcon className="size-4" />
      </Button>
    </>
  );
}
