import { z } from 'zod';
import { tool } from 'ai';
import { assignees } from '~/data/mock-assignees';
import { taskStatusSchema, taskPrioritySchema } from '~/components/tasks/types';

const taskId = z.string().describe('The task ID (e.g. MUL-101)');

const taskStatus = taskStatusSchema;

const taskPriority = taskPrioritySchema.describe(
  '0=no priority, 1=urgent, 2=high, 3=medium, 4=low',
);

const toolSchemas = {
  getTasks: z.object({}),
  createTask: z.object({
    title: z.string().describe('The task title'),
    description: z.string().optional().describe('Optional task description'),
    status: taskStatus.optional().default('todo'),
    priority: taskPriority.optional().default(4),
    labels: z.array(z.string()).optional().describe('Optional labels'),
    assigneeId: z
      .string()
      .optional()
      .describe('Optional assignee ID to assign on creation'),
  }),
  updateTask: z.object({
    id: taskId,
    title: z.string().optional(),
    description: z.string().optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
  }),
  deleteTask: z.object({ id: taskId }),
  assignTask: z.object({
    id: taskId,
    assigneeId: z
      .string()
      .describe(
        `ID of the assignee. Available: ${assignees.map((a) => `${a.id}=${a.name}`).join(', ')}`,
      ),
  }),
  unassignTask: z.object({ id: taskId }),
  addTaskLabel: z.object({
    id: taskId,
    label: z.string().describe('The label to add'),
  }),
  removeTaskLabel: z.object({
    id: taskId,
    label: z.string().describe('The label to remove'),
  }),
};

export type ToolName = keyof typeof toolSchemas;

export type ToolInputMap = {
  [K in ToolName]: z.infer<(typeof toolSchemas)[K]>;
};

export const tools = {
  getTasks: tool({
    description:
      'Retrieve the current list of tasks. Call this whenever you need to look up tasks, answer questions about them, or before modifying them.',
    inputSchema: toolSchemas.getTasks,
  }),
  createTask: tool({
    description: 'Create a new task.',
    inputSchema: toolSchemas.createTask,
  }),
  updateTask: tool({
    description:
      'Update an existing task. Use to change title, description, status, or priority.',
    inputSchema: toolSchemas.updateTask,
  }),
  deleteTask: tool({
    description: 'Permanently delete a task.',
    inputSchema: toolSchemas.deleteTask,
  }),
  assignTask: tool({
    description: 'Assign a task to one of the available team members.',
    inputSchema: toolSchemas.assignTask,
  }),
  unassignTask: tool({
    description: 'Remove the current assignee from a task.',
    inputSchema: toolSchemas.unassignTask,
  }),
  addTaskLabel: tool({
    description: 'Add a label/tag to a task.',
    inputSchema: toolSchemas.addTaskLabel,
  }),
  removeTaskLabel: tool({
    description: 'Remove a label/tag from a task.',
    inputSchema: toolSchemas.removeTaskLabel,
  }),
};
