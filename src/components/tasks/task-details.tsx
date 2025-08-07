import { TaskStatus, type Task } from '~/types/task';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useAppDispatch } from '~/store/hooks';
import { updateTaskStatus } from '~/store/features/tasks/tasks-slice';
import { taskDeleteCommand, taskUnselectCommand } from './task-commands';
import { useCommandsRegistry } from '../commands/commands-context';
import { useEffect } from 'react';
import { TaskStatusIcon } from './status/task-status-icon';
import { taskStatusList, taskStatusRecord } from './status/task-status-list';
import { cn } from '~/lib/utils';

export type TaskDetailsProps = {
  task: Task;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const assigneeName = task.assignee?.name || 'No assignee';
  const dueDate = task.dueDate || 'No due date';
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              aria-label="Change status">
              <TaskStatusIcon status={task.status} />
              <span className="capitalize text-xs font-medium">
                {task.status.replace('-', ' ')}
              </span>
              <RiArrowDownSLine className="w-3 h-3 ml-1 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {taskStatusList.map((status) => {
              const taskStatus = taskStatusRecord[status];

              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}>
                  <TaskStatusIcon status={status} className="mr-2" size="md" />
                  {taskStatus.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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
          <span className="font-medium">{assigneeName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Due date:</span>
          <span className="font-medium">{dueDate}</span>
        </div>
        <div className="mb-2 text-sm font-semibold">Description</div>
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {task.description}
        </div>
      </div>
    </div>
  );
}
