'use client';

import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  toggleTaskStatus,
  deleteTask,
  updateTaskStatus,
} from '~/store/features/tasks/tasks-slice';
import {
  selectAllTasks,
  selectTaskCounts,
  selectSelectedTaskId,
  selectSelectedTask,
} from '~/store/features/tasks/tasks-selectors';
import { TaskItem } from '~/components/tasks/task-item';
import { Todo } from '~/types/todo';

export function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const taskCounts = useAppSelector(selectTaskCounts);
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const selectedTask = useAppSelector(selectSelectedTask);

  function handleStatusChange(id: string) {
    dispatch(toggleTaskStatus(id));
  }

  function handleStatusUpdate(id: string, status: Todo['status']) {
    dispatch(updateTaskStatus({ id, status }));
  }

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  function handleDeleteSelected() {
    if (selectedTaskId) {
      dispatch(deleteTask(selectedTaskId));
    }
  }

  function handleToggleSelectedStatus() {
    if (selectedTaskId) {
      dispatch(toggleTaskStatus(selectedTaskId));
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="justify-start gap-2">
            <Plus className="h-4 w-4" />
            New issue
          </Button>
          {selectedTask && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSelectedStatus}
                className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {selectedTask.status === 'done'
                  ? 'Mark as Todo'
                  : 'Mark as Done'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDeleteSelected}
                aria-label="Delete"
                className="gap-2">
                <Trash2 className="size-4" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            <span>{taskCounts.todo} To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{taskCounts.inProgress} In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{taskCounts.done} Done</span>
          </div>
        </div>
      </div>
      <div className={cn('border border-input mb-4 p-1', 'rounded-md')}>
        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteTask}
              isSelected={selectedTaskId === task.id}
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
