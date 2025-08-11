'use client';

import { Button } from '~/components/ui/button';
import { useAppSelector } from '~/store/hooks';
import { NewTaskDialog } from '~/components/tasks/new-task-dialog';
import { useCommands } from '~/components/commands/commands-context';

import {
  selectTasksCanRedo,
  selectTasksCanUndo,
} from '~/store/features/tasks/tasks-selectors';
import { taskRedoCommand, taskUndoCommand } from './task-commands';
import { useEffect } from 'react';

export function TaskToolbar() {
  const { registerCommand } = useCommands();

  const tasksCanUndo = useAppSelector(selectTasksCanUndo);
  const tasksCanRedo = useAppSelector(selectTasksCanRedo);

  const taskUndoCommandObj = taskUndoCommand();
  const taskRedoCommandObj = taskRedoCommand();

  useEffect(() => {
    const unregisterUndo = registerCommand(taskUndoCommand());
    const unregisterRedo = registerCommand(taskRedoCommand());

    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [registerCommand]);

  return (
    <div className="flex items-center gap-2">
      <NewTaskDialog />
      <Button
        variant="ghost"
        aria-label={taskUndoCommandObj.name}
        tooltip={taskUndoCommandObj.name}
        shortcut={taskUndoCommandObj.shortcut}
        size="sm"
        disabled={!tasksCanUndo}
        onClick={() => {
          taskUndoCommandObj.action();
        }}
        icon={taskUndoCommandObj.icon}
      />
      <Button
        variant="ghost"
        aria-label={taskRedoCommandObj.name}
        tooltip={taskRedoCommandObj.name}
        shortcut={taskRedoCommandObj.shortcut}
        size="sm"
        disabled={!tasksCanRedo}
        onClick={() => {
          taskRedoCommandObj.action();
        }}
        icon={taskRedoCommandObj.icon}
      />
    </div>
  );
}
