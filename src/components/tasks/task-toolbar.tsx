'use client';

import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { TaskCreateDialog } from '~/components/tasks/create/task-create-dialog';
import { useCommands } from '~/components/commands/commands-context';
import { TaskDisplayDropdown } from '~/components/tasks/display/task-display-dropdown';
import { toggleAiChatSidebar } from '~/store/features/display/display-slice';
import { selectAiChatSidebarVisible } from '~/store/features/display/display-selectors';
import { RiArrowRightDoubleLine, RiSparkling2Fill } from 'react-icons/ri';

import {
  selectTasksCanRedo,
  selectTasksCanUndo,
} from '~/store/features/tasks/tasks-selectors';
import {
  taskRedoCommandCreator,
  taskUndoCommandCreator,
} from './task-commands';
import { useEffect, useMemo } from 'react';

export function TaskToolbar() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();

  const tasksCanUndo = useAppSelector(selectTasksCanUndo);
  const tasksCanRedo = useAppSelector(selectTasksCanRedo);
  const aiChatSidebarVisible = useAppSelector(selectAiChatSidebarVisible);

  const taskUndoCommand = useMemo(() => taskUndoCommandCreator(), []);
  const taskRedoCommand = useMemo(() => taskRedoCommandCreator(), []);

  useEffect(() => {
    const unregisterUndo = registerCommand(taskUndoCommand);
    const unregisterRedo = registerCommand(taskRedoCommand);

    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [registerCommand, taskUndoCommand, taskRedoCommand]);

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <div className="flex items-center gap-x-0.5">
        <TaskCreateDialog />
        <Button
          variant="ghost"
          aria-label={taskUndoCommand.name}
          tooltip={taskUndoCommand.name}
          shortcut={taskUndoCommand.shortcut}
          size="sm"
          disabled={!tasksCanUndo}
          onClick={() => {
            taskUndoCommand.action();
          }}
          icon={taskUndoCommand.icon}
        />
        <Button
          variant="ghost"
          aria-label={taskRedoCommand.name}
          tooltip={taskRedoCommand.name}
          shortcut={taskRedoCommand.shortcut}
          size="sm"
          disabled={!tasksCanRedo}
          onClick={() => {
            taskRedoCommand.action();
          }}
          icon={taskRedoCommand.icon}
        />
      </div>
      <div className="flex items-center gap-x-0.5">
        <TaskDisplayDropdown />
        <Button
          variant={'ghost'}
          aria-label="Toggle AI Chat"
          tooltip="Toggle AI Chat"
          size="sm"
          onClick={() => {
            dispatch(toggleAiChatSidebar());
          }}
          icon={
            aiChatSidebarVisible ? RiArrowRightDoubleLine : RiSparkling2Fill
          }>
          {aiChatSidebarVisible ? undefined : 'Chat'}
        </Button>
      </div>
    </div>
  );
}
