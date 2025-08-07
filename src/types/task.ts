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
  assigneeId?: string;
  labels?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskObject = Omit<Task, 'assigneeId'> & {
  assignee?: TaskAssignee;
};
