export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
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

export interface TodoProject {
  id: string;
  name: string;
  color: string;
}
