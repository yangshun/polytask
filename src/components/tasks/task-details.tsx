import { TaskObject, TaskStatus } from '~/types/task';
import { Button } from '~/components/ui/button';
import { TaskStatusSelector } from './status/task-status-selector';
import { useAppDispatch } from '~/store/hooks';
import { updateTaskStatus } from '~/store/features/tasks/tasks-slice';
import { taskDeleteCommand, taskUnselectCommand } from './task-commands';
import { useCommandsRegistry } from '../commands/commands-context';
import { useEffect } from 'react';
import { cn } from '~/lib/utils';

export type TaskDetailsProps = {
  task: TaskObject;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const taskDeleteCommandObj = taskDeleteCommand(task.id);

  function handleStatusChange(newStatus: TaskStatus) {
    if (newStatus !== task.status) {
      dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
    }
  }

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(taskDeleteCommand(task.id));
    const unregisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterTaskDelete();
      unregisterTaskUnselect();
    };
  }, [registerCommand, task.id]);

  return (
    <div className={cn('divide-y divide-input')}>
      <div
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-2')}>
        <TaskStatusSelector value={task.status} onChange={handleStatusChange} />
        <Button
          tooltip={taskDeleteCommandObj.name}
          shortcut={taskDeleteCommandObj.shortcut}
          variant="outline"
          size="sm"
          onClick={() => {
            dispatch(taskDeleteCommandObj.action());
          }}
          aria-label={taskDeleteCommandObj.name}
          icon={taskDeleteCommandObj.icon}
        />
      </div>
      <div className={cn('px-3 py-3')}>
        <h2 className="text-lg font-bold mb-2">{task.title}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Assignee:</span>
          {task.assignee && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <img
                src={task.assignee?.avatar}
                alt={task.assignee?.name}
                className="size-6 rounded-full"
              />
              <span className="font-medium">
                {task.assignee?.name || 'Unassigned'}
              </span>
            </div>
          )}
        </div>
        <div className="mb-2 text-sm font-semibold">Description</div>
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {task.description}
        </div>
      </div>
    </div>
  );
}
