'use client';

import { CheckCircle2, Circle, Clock, Plus } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  toggleTaskStatus,
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
import { Todo } from '~/types/todo';
import { Button } from '~/components/ui/button';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
} from './task-commands';
import { useEffect } from 'react';

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

  function handleStatusChange(id: string) {
    dispatch(toggleTaskStatus(id));
  }

  function handleStatusUpdate(id: string, status: Todo['status']) {
    dispatch(updateTaskStatus({ id, status }));
  }

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
            icon={Plus}
            variant="default"
            size="sm"
            shortcut="c">
            New issue
          </Button>
          {selectedTask && <TaskToolbar selectedTask={selectedTask} />}
        </div>
        <div className="flex items-center gap-6 text-muted-foreground shrink-0 px-1">
          <div className="flex items-center gap-2">
            <Circle className="size-4" />
            <span className="text-xs">{taskCounts.todo} Todo</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-blue-600" />
            <span className="text-xs">{taskCounts.inProgress} In progress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-600" />
            <span className="text-xs">{taskCounts.done} Done</span>
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
                    onStatusChange={handleStatusChange}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDeleteTask}
                    isSelected={selectedTask?.id === task.id}
                  />
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                <TaskDetails task={selectedTask} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
