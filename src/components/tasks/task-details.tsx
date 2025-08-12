import { TaskObject } from '~/components/tasks/types';
import { Button } from '~/components/ui/button';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { TaskDescriptionField } from './description/task-description-field';
import { TaskTitleField } from './title/task-title-field';

import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { assignTask, updateTask } from '~/store/features/tasks/tasks-slice';
import {
  taskDeleteCommandCreator,
  taskSelectNextCommandCreator,
  taskSelectPreviousCommandCreator,
  taskUnselectCommandCreator,
} from './task-commands';
import { useCommands } from '../commands/commands-context';
import { useEffect, useMemo } from 'react';
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
  const taskSelectNextCommand = taskSelectNextCommandCreator();
  const taskSelectPreviousCommand = taskSelectPreviousCommandCreator();
  const taskDeleteCommand = useMemo(
    () => taskDeleteCommandCreator(task.id),
    [task.id],
  );
  const taskUnselectCommand = useMemo(() => taskUnselectCommandCreator(), []);

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(taskDeleteCommand);
    const unregisterTaskUnselect = registerCommand(taskUnselectCommand);

    return () => {
      unregisterTaskDelete();
      unregisterTaskUnselect();
    };
  }, [registerCommand, taskDeleteCommand, taskUnselectCommand]);

  return (
    <div className={cn('divide-y divide-input')}>
      <div
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-3')}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            tooltip={taskSelectNextCommand.name}
            shortcut={taskSelectNextCommand.shortcut}
            size="sm"
            onClick={() => {
              taskSelectNextCommand.action();
            }}
            disabled={!hasNextTask}
            aria-label={taskSelectNextCommand.name}
            icon={taskSelectNextCommand.icon}
          />
          <Button
            variant="outline"
            tooltip={taskSelectPreviousCommand.name}
            shortcut={taskSelectPreviousCommand.shortcut}
            size="sm"
            onClick={() => {
              taskSelectPreviousCommand.action();
            }}
            disabled={!hasPreviousTask}
            aria-label={taskSelectPreviousCommand.name}
            icon={taskSelectPreviousCommand.icon}
          />
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            tooltip={taskDeleteCommand.name}
            shortcut={taskDeleteCommand.shortcut}
            variant="ghost"
            size="sm"
            onClick={() => {
              taskDeleteCommand.action();
            }}
            aria-label={taskDeleteCommand.name}
            icon={taskDeleteCommand.icon}
          />
          <Button
            aria-label={taskUnselectCommand.name}
            tooltip={taskUnselectCommand.name}
            shortcut={taskUnselectCommand.shortcut}
            variant="ghost"
            size="sm"
            onClick={() => {
              taskUnselectCommand.action();
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
                dispatch(
                  updateTask({ id: task.id, updates: { status: newStatus } }),
                );
              }
            }}
          />
          <TaskPrioritySelector
            value={task.priority}
            onChange={(p) => {
              if (p !== task.priority) {
                dispatch(updateTask({ id: task.id, updates: { priority: p } }));
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
