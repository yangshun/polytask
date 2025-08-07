export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';

export interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  labels?: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}
