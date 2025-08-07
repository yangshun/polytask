import { type Todo } from '~/types/todo';

export type TaskDetailsProps = {
  task: Todo;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  // Placeholder fields for demo; replace with real data as needed
  const assigneeName = task.assignee?.name || 'No assignee';
  const dueDate = task.dueDate || 'No due date';

  return (
    <div className="py-4 px-4">
      <div className="flex items-center gap-2 mb-2">
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
