'use client';

import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
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

export function TaskList() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);

  const selectedTask = useAppSelector(selectSelectedTask);

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
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
      <div className={cn('flex items-center w-full', 'py-2 px-2')}>
        <TaskToolbar />
      </div>
      <div className="h-0 grow">
        <PanelGroup direction="horizontal">
          <Panel minSize={50} defaultSize={selectedTask ? 70 : 100}>
            <div
              className={cn(
                'flex flex-col size-full',
                'divide-y divide-input',
              )}>
              <ScrollArea className="h-0 grow">
                <div className="size-full">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onAssigneeChange={(assigneeId) => {
                        dispatch(assignTask({ id: task.id, assigneeId }));
                      }}
                      onStatusChange={(status) => {
                        dispatch(updateTaskStatus({ id: task.id, status }));
                      }}
                      onPriorityChange={(priority) => {
                        dispatch(updateTaskPriority({ id: task.id, priority }));
                      }}
                      onDelete={handleDeleteTask}
                      isSelected={selectedTask?.id === task.id}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <RiCheckboxBlankCircleLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No issues yet</p>
                      <p className="text-sm">
                        Create your first issue to get started
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <TaskStatusSummary />
            </div>
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
    </div>
  );
}
