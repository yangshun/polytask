export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'in-review'
  | 'done'
  | 'cancelled';

export type TaskPriority = 0 | 1 | 2 | 3 | 4;

export interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface TaskRaw {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  labels?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskObject = Omit<TaskRaw, 'assigneeId'> & {
  assignee: TaskAssignee | null;
};
