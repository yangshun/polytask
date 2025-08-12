import { TaskObject } from '~/types/task';
import { Button } from '~/components/ui/button';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { TaskDescriptionField } from './description/task-description-field';
import { TaskTitleField } from './title/task-title-field';

import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  assignTask,
  updateTaskStatus,
  updateTask,
  updateTaskPriority,
} from '~/store/features/tasks/tasks-slice';
import {
  taskDeleteCommand,
  taskSelectNextCommand,
  taskSelectPreviousCommand,
  taskUnselectCommand,
} from './task-commands';
import { useCommands } from '../commands/commands-context';
import { useEffect } from 'react';
import { cn } from '~/lib/utils';
import { TaskPrioritySelector } from './priority/task-priority-selector';
import {
  selectHasNextTask,
  selectHasPreviousTask,
} from '~/store/features/tasks/tasks-selectors';
import { RiContractRightLine } from 'react-icons/ri';

export type TaskDetailsProps = {
  task: TaskObject;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommands();

  const dispatch = useAppDispatch();

  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);
  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();
  const taskDeleteCommandObj = taskDeleteCommand(task.id);
  const taskUnselectCommandObj = taskUnselectCommand();

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
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-3')}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            tooltip={taskSelectNextCommandObj.name}
            shortcut={taskSelectNextCommandObj.shortcut}
            size="sm"
            onClick={() => {
              taskSelectNextCommandObj.action();
            }}
            disabled={!hasNextTask}
            aria-label={taskSelectNextCommandObj.name}
            icon={taskSelectNextCommandObj.icon}
          />
          <Button
            variant="outline"
            tooltip={taskSelectPreviousCommandObj.name}
            shortcut={taskSelectPreviousCommandObj.shortcut}
            size="sm"
            onClick={() => {
              taskSelectPreviousCommandObj.action();
            }}
            disabled={!hasPreviousTask}
            aria-label={taskSelectPreviousCommandObj.name}
            icon={taskSelectPreviousCommandObj.icon}
          />
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            tooltip={taskDeleteCommandObj.name}
            shortcut={taskDeleteCommandObj.shortcut}
            variant="ghost"
            size="sm"
            onClick={() => {
              taskDeleteCommandObj.action();
            }}
            aria-label={taskDeleteCommandObj.name}
            icon={taskDeleteCommandObj.icon}
          />
          <Button
            aria-label={taskUnselectCommandObj.name}
            tooltip={taskUnselectCommandObj.name}
            shortcut={taskUnselectCommandObj.shortcut}
            variant="ghost"
            size="sm"
            onClick={() => {
              taskUnselectCommandObj.action();
            }}
            icon={RiContractRightLine}
          />
        </div>
      </div>
      <div className={cn('flex flex-col gap-2 px-3 py-3')}>
        <TaskTitleField
          key={task.id}
          value={task.title}
          onChange={(value) =>
            dispatch(updateTask({ id: task.id, updates: { title: value } }))
          }
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 -ml-2">
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
          <TaskAssigneeSelector
            value={task.assignee?.id ?? undefined}
            onChange={(assigneeId) => {
              if (assigneeId !== task.assignee?.id) {
                dispatch(
                  assignTask({
                    id: task.id,
                    assigneeId,
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
