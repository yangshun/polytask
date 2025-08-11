'use client';

import { TaskStatusIcon } from './task-status-icon';
import { taskStatusRecord } from './task-status-list';
import { useAppSelector } from '~/store/hooks';
import { selectTaskCounts } from '~/store/features/tasks/tasks-selectors';
import { cn } from '~/lib/utils';

export function TaskStatusSummary() {
  const taskCounts = useAppSelector(selectTaskCounts);

  return (
    <div
      className={cn(
        'flex items-center gap-3 md:gap-6 justify-end',
        'px-3 py-2',
      )}>
      <div className="flex items-center gap-2">
        <TaskStatusIcon status="todo" size="lg" />
        <span className="text-muted-foreground text-xs">
          {taskCounts.todo}
          <span className="max-md:hidden"> {taskStatusRecord.todo.label}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <TaskStatusIcon status="in-progress" size="lg" />
        <span className="text-muted-foreground text-xs">
          {taskCounts.inProgress}
          <span className="max-md:hidden">
            {' '}
            {taskStatusRecord['in-progress'].label}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <TaskStatusIcon status="in-review" size="lg" />
        <span className="text-muted-foreground text-xs">
          {taskCounts.inReview}
          <span className="max-md:hidden">
            {' '}
            {taskStatusRecord['in-review'].label}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <TaskStatusIcon status="done" size="lg" />
        <span className="text-muted-foreground text-xs">
          {taskCounts.done}
          <span className="max-md:hidden"> {taskStatusRecord.done.label}</span>
        </span>
      </div>
    </div>
  );
}
