'use client';

import { cn } from '~/lib/utils';
import { taskCreateDialogOpenCommandCreator } from './task-commands';

const taskCreateCommand = taskCreateDialogOpenCommandCreator();

export function TaskEmptyState() {
  return (
    <div
      className={cn(
        'size-full',
        'flex flex-col items-center justify-center',
        'text-center py-12 text-muted-foreground',
      )}>
      <taskCreateCommand.icon className="size-12 mx-auto mb-4 opacity-50" />
      <p>No issues yet</p>
      <p className="text-sm">Create your first issue to get started</p>
      {/* TODO: Fix this such that mounting it doesn't override the keyboard shortcut in the toolbar */}
      {/* <div className="mt-2">
        <TaskCreateDialog />
      </div> */}
    </div>
  );
}
