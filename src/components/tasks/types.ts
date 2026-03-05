import { z } from 'zod';

export const taskStatusSchema = z.enum([
  'todo',
  'in-progress',
  'in-review',
  'done',
  'cancelled',
]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskPrioritySchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export type TaskPriority = z.infer<typeof taskPrioritySchema>;

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
