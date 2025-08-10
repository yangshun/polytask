import { TaskObject } from '~/types/task';
import { Button } from '~/components/ui/button';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { TaskDescriptionField } from './description/task-description-field';
import { TaskTitleField } from './title/task-title-field';

import { useAppDispatch } from '~/store/hooks';
import {
  assignTask,
  updateTaskStatus,
  updateTask,
  updateTaskPriority,
} from '~/store/features/tasks/tasks-slice';
import { taskDeleteCommand, taskUnselectCommand } from './task-commands';
import { useCommandsRegistry } from '../commands/commands-context';
import { useEffect } from 'react';
import { cn } from '~/lib/utils';
import { TaskPrioritySelector } from './priority/task-priority-selector';

export type TaskDetailsProps = {
  task: TaskObject;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const taskDeleteCommandObj = taskDeleteCommand(task.id);

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
        <div className="flex items-center gap-2">
          <TaskStatusSelector
            value={task.status}
            onChange={(newStatus) => {
              if (newStatus !== task.status) {
                dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
              }
            }}
          />
          <TaskPrioritySelector
            value={task.priority}
            onChange={(p) => {
              if (p !== task.priority) {
                dispatch(updateTaskPriority({ id: task.id, priority: p }));
              }
            }}
          />
        </div>
        <Button
          tooltip={taskDeleteCommandObj.name}
          shortcut={taskDeleteCommandObj.shortcut}
          variant="outline"
          size="sm"
          onClick={() => {
            taskDeleteCommandObj.action();
          }}
          aria-label={taskDeleteCommandObj.name}
          icon={taskDeleteCommandObj.icon}
        />
      </div>
      <div className={cn('flex flex-col gap-2 px-3 py-3')}>
        <TaskTitleField
          key={task.id}
          value={task.title}
          onChange={(value) =>
            dispatch(updateTask({ id: task.id, updates: { title: value } }))
          }
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <TaskAssigneeSelector
            value={task.assignee ?? undefined}
            onChange={(newAssignee) => {
              if (newAssignee?.id !== task.assignee?.id) {
                dispatch(
                  assignTask({
                    id: task.id,
                    assigneeId: newAssignee.id,
                  }),
                );
              }
            }}
          />
        </div>
        <TaskDescriptionField
          value={task.description || ''}
          onChange={(newDescription) => {
            if (newDescription !== task.description) {
              dispatch(
                updateTask({
                  id: task.id,
                  updates: { description: newDescription },
                }),
              );
            }
          }}
        />
      </div>
    </div>
  );
}
