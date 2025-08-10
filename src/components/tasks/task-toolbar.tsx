'use client';

import { Button } from '~/components/ui/button';
import { useAppSelector } from '~/store/hooks';
import { NewTaskDialog } from '~/components/tasks/new-task-dialog';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import {
  selectHasNextTask,
  selectHasPreviousTask,
  selectSelectedTask,
} from '~/store/features/tasks/tasks-selectors';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
} from './task-commands';
import { useEffect } from 'react';

export function TaskToolbar() {
  const { registerCommand } = useCommandsRegistry();

  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);
  const selectedTask = useAppSelector(selectSelectedTask);

  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();

  useEffect(() => {
    const unregisterNext = registerCommand(taskSelectNextCommand());
    const unregisterPrevious = registerCommand(taskSelectPreviousCommand());

    return () => {
      unregisterNext();
      unregisterPrevious();
    };
  }, [registerCommand]);

  return (
    <div className="flex items-center gap-2">
      <NewTaskDialog />
      {selectedTask && (
        <>
          <Button
            variant="outline"
            tooltip={taskSelectNextCommandObj.name}
            shortcut={taskSelectNextCommandObj.shortcut}
            size="sm"
            onClick={() => {
              taskSelectNextCommandObj.action();
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
              taskSelectPreviousCommandObj.action();
            }}
            disabled={!hasPreviousTask}
            aria-label={taskSelectPreviousCommandObj.name}
            icon={taskSelectPreviousCommandObj.icon}
          />
        </>
      )}
    </div>
  );
}
