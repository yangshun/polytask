'use client';

import { cn } from '~/lib/utils';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  assignTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
} from '~/store/features/tasks/tasks-slice';
import {
  selectAllTasks,
  selectSelectedTask,
  selectSelectedTaskId,
} from '~/store/features/tasks/tasks-selectors';
import { TaskItem } from '~/components/tasks/task-item';
import { TaskToolbar } from '~/components/tasks/task-toolbar';
import { TaskDetails } from '~/components/tasks/task-details';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useEffect } from 'react';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
  taskUnselectCommand,
} from './task-commands';
import { useCommands } from '~/components/commands/commands-context';
import { TaskStatusSummary } from '~/components/tasks/status/task-status-summary';
import type { TaskObject } from '~/types/task';
import { TaskEmptyState } from '~/components/tasks/task-empty-state';

export function TaskList() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();
  const tasks: TaskObject[] = useAppSelector(selectAllTasks);

  const selectedTask: TaskObject | null = useAppSelector(selectSelectedTask);
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const hasSelection = !!selectedTaskId;

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  function renderListSection() {
    return (
      <div className={cn('flex flex-col size-full', 'divide-y divide-input')}>
        <ScrollArea className="h-0 grow">
          <div className="size-full">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onAssigneeChange={function (assigneeId) {
                  dispatch(assignTask({ id: task.id, assigneeId }));
                }}
                onStatusChange={function (status) {
                  dispatch(updateTaskStatus({ id: task.id, status }));
                }}
                onPriorityChange={function (priority) {
                  dispatch(updateTaskPriority({ id: task.id, priority }));
                }}
                onDelete={handleDeleteTask}
                isSelected={selectedTaskId === task.id}
              />
            ))}
            {tasks.length === 0 && <TaskEmptyState />}
          </div>
        </ScrollArea>
        <TaskStatusSummary />
      </div>
    );
  }

  useEffect(() => {
    const unregisterNext = registerCommand(taskSelectNextCommand());
    const unregisterPrevious = registerCommand(taskSelectPreviousCommand());
    const unregisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterNext();
      unregisterPrevious();
      unregisterTaskUnselect();
    };
  }, [registerCommand]);

  return (
    <div
      className={cn(
        'flex flex-col',
        'border border-input',
        'rounded-sm',
        'divide-y divide-input',
        'h-full bg-background',
      )}>
      <div className={cn('flex items-center w-full', 'py-2 pr-2 pl-3')}>
        <TaskToolbar />
      </div>
      <div className="h-0 grow">
        {/* Desktop and larger: split view */}
        <div className="hidden md:block h-full">
          <PanelGroup direction="horizontal">
            <Panel minSize={50} defaultSize={hasSelection ? 70 : 100}>
              {renderListSection()}
            </Panel>
            {selectedTask && (
              <>
                <PanelResizeHandle className="w-px bg-border cursor-col-resize" />
                <Panel minSize={20}>
                  <TaskDetails key={selectedTask.id} task={selectedTask} />
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
        {/* Mobile: show either list or details */}
        <div className="md:hidden h-full">
          {selectedTask ? (
            <TaskDetails key={selectedTask.id} task={selectedTask} />
          ) : (
            renderListSection()
          )}
        </div>
      </div>
    </div>
  );
}
