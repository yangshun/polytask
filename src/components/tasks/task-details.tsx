import { TaskObject, TaskStatus, TaskAssignee } from '~/types/task';
import { Button } from '~/components/ui/button';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';

import { useAppDispatch } from '~/store/hooks';
import {
  assignTask,
  updateTaskStatus,
} from '~/store/features/tasks/tasks-slice';
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

  function handleAssigneeChange(newAssignee: TaskAssignee) {
    if (newAssignee?.id !== task.assignee?.id) {
      dispatch(
        assignTask({
          id: task.id,
          assigneeId: newAssignee.id,
        }),
      );
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
          {task.assignee ? (
            <TaskAssigneeSelector
              value={task.assignee ?? undefined}
              onChange={handleAssigneeChange}
            />
          ) : (
            <span className="font-medium">Unassigned</span>
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
