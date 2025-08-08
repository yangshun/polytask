import { TaskObject } from '~/types/task';
import { Button } from '~/components/ui/button';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { Textarea } from '~/components/ui/textarea';
import { TaskTitleField } from './title/task-title-field';

import { useAppDispatch } from '~/store/hooks';
import {
  assignTask,
  updateTaskStatus,
  updateTask,
} from '~/store/features/tasks/tasks-slice';
import { taskDeleteCommand, taskUnselectCommand } from './task-commands';
import { useCommandsRegistry } from '../commands/commands-context';
import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';
import { Label } from '../ui/label';

export type TaskDetailsProps = {
  task: TaskObject;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const taskDeleteCommandObj = taskDeleteCommand(task.id);

  const [description, setDescription] = useState<string>(
    task.description || '',
  );

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
        <TaskStatusSelector
          value={task.status}
          onChange={(newStatus) => {
            if (newStatus !== task.status) {
              dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
            }
          }}
        />
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
      <div className={cn('flex flex-col gap-2 px-3 py-3')}>
        <TaskTitleField
          key={task.id}
          value={task.title}
          onChange={(value) =>
            dispatch(updateTask({ id: task.id, updates: { title: value } }))
          }
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {task.assignee ? (
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
          ) : (
            <span className="font-medium">Unassigned</span>
          )}
        </div>
        <div className="grid w-full gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              if (description !== task.description) {
                dispatch(updateTask({ id: task.id, updates: { description } }));
              }
            }}
            placeholder="Add a description..."
          />
        </div>
      </div>
    </div>
  );
}
