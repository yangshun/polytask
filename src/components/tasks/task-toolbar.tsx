'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import { toggleTaskStatus } from '~/store/features/tasks/tasks-slice';
import {
  selectHasNextTask,
  selectHasPreviousTask,
} from '~/store/features/tasks/tasks-selectors';
import {
  taskDeleteCommand,
  taskSelectNextCommand,
  taskSelectPreviousCommand,
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

  const taskDeleteCommandObj = taskDeleteCommand(selectedTask.id);
  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          dispatch(toggleTaskStatus(selectedTask.id));
        }}
        icon={RefreshCw}>
        {selectedTask.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
      </Button>
      <Button
        tooltip={taskDeleteCommandObj.name}
        shortcut={taskDeleteCommandObj.shortcut}
        variant="outline"
        size="sm"
        onClick={() => {
          dispatch(taskDeleteCommandObj.action());
        }}
        aria-label={taskDeleteCommandObj.name}
        icon={taskDeleteCommandObj.icon}
      />
      <Button
        variant="outline"
        tooltip={taskSelectNextCommandObj.name}
        shortcut={taskSelectNextCommandObj.shortcut}
        size="sm"
        onClick={() => {
          dispatch(taskSelectNextCommandObj.action());
        }}
        disabled={!hasNextTask}
        aria-label={taskSelectNextCommandObj.name}
        icon={taskSelectNextCommandObj.icon}
      />
      <Button
        variant="outline"
        tooltip={taskSelectPreviousCommandObj.name}
        shortcut={taskSelectPreviousCommandObj.shortcut}
        size="sm"
        onClick={() => {
          dispatch(taskSelectPreviousCommandObj.action());
        }}
        disabled={!hasPreviousTask}
        aria-label={taskSelectPreviousCommandObj.name}
        icon={taskSelectPreviousCommandObj.icon}
      />
    </>
  );
}
