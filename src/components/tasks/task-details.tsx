import { type Todo } from '~/types/todo';
import { Button } from '~/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAppDispatch } from '~/store/hooks';
import { toggleTaskStatus } from '~/store/features/tasks/tasks-slice';
import { taskDeleteCommand, taskUnselectCommand } from './task-commands';
import { useCommandsRegistry } from '../commands/commands-context';
import { useEffect } from 'react';

export type TaskDetailsProps = {
  task: Todo;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const assigneeName = task.assignee?.name || 'No assignee';
  const dueDate = task.dueDate || 'No due date';
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
    <div className="py-4 px-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            dispatch(toggleTaskStatus(task.id));
          }}
          icon={RefreshCw}>
          {task.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
        </Button>
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
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Not started
        </span>
      </div>
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
  );
}
