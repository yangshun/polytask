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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="justify-start gap-2">
            <Plus className="h-4 w-4" />
            New issue
          </Button>
          {selectedTask && <TaskToolbar selectedTask={selectedTask} />}
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            <span>{taskCounts.todo} Todo</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{taskCounts.inProgress} In progress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{taskCounts.done} Done</span>
          </div>
        </div>
      </div>
      <div className={cn('border border-input mb-4 p-1', 'rounded-lg')}>
        <div className="space-y-1">
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
        </div>
        {tasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No issues yet</p>
            <p className="text-sm">Create your first issue to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
