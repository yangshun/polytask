'use client';

import { RiAddLine, RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { cn } from '~/lib/utils';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  assignTask,
  deleteTask,
  updateTaskStatus,
} from '~/store/features/tasks/tasks-slice';
import {
  selectAllTasks,
  selectSelectedTask,
  selectTaskCounts,
} from '~/store/features/tasks/tasks-selectors';
import { TaskItem } from '~/components/tasks/task-item';
import { TaskToolbar } from '~/components/tasks/task-toolbar';
import { TaskDetails } from '~/components/tasks/task-details';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '~/components/ui/button';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
} from './task-commands';
import { useEffect } from 'react';
import { TaskStatusIcon } from './status/task-status-icon';
import { taskStatusRecord } from './status/task-status-list';

export function TaskList() {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);

  const selectedTask = useAppSelector(selectSelectedTask);
  const taskCounts = useAppSelector(selectTaskCounts);

  useEffect(() => {
    const unregisterNext = registerCommand(taskSelectNextCommand());
    const unregisterPrevious = registerCommand(taskSelectPreviousCommand());

    return () => {
      unregisterNext();
      unregisterPrevious();
    };
  }, [registerCommand]);

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        'border border-input',
        'rounded-sm',
        'divide-y divide-input',
        'h-full bg-background',
      )}>
      <div
        className={cn('flex items-center justify-between w-full', 'py-2 px-2')}>
        <div className="flex items-center gap-2">
          <Button
            tooltip="Create new issue"
            icon={RiAddLine}
            variant="default"
            size="sm"
            shortcut="c">
            New issue
          </Button>
          {selectedTask && <TaskToolbar />}
        </div>
        <div className="flex items-center gap-6 text-muted-foreground shrink-0 px-1">
          <div className="flex items-center gap-2">
            <TaskStatusIcon status="todo" size="lg" />
            <span className="text-xs">
              {taskCounts.todo} {taskStatusRecord.todo.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusIcon status="in-progress" size="lg" />
            <span className="text-xs">
              {taskCounts.inProgress} {taskStatusRecord['in-progress'].label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusIcon status="in-review" size="lg" />
            <span className="text-xs">
              {taskCounts.inReview} {taskStatusRecord['in-review'].label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusIcon status="done" size="lg" />
            <span className="text-xs">
              {taskCounts.done} {taskStatusRecord.done.label}
            </span>
          </div>
        </div>
      </div>
      <div className="h-0 grow">
        <PanelGroup direction="horizontal">
          <Panel
            className="p-1"
            minSize={50}
            defaultSize={selectedTask ? 70 : 100}>
            <ScrollArea className="h-full">
              <div className="size-full space-y-1">
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
