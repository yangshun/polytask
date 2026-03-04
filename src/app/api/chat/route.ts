import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import { assignees } from '~/data/mock-assignees';

export const runtime = 'edge';

const taskId = z.string().describe('The task ID (e.g. MUL-101)');

const taskStatus = z.enum([
  'todo',
  'in-progress',
  'in-review',
  'done',
  'cancelled',
]);

const taskPriority = z
  .number()
  .int()
  .min(0)
  .max(4)
  .describe('0=no priority, 1=low, 2=medium, 3=high, 4=urgent');

const tools = {
  createTask: tool({
    description: 'Create a new task.',
    inputSchema: z.object({
      title: z.string().describe('The task title'),
      description: z.string().optional().describe('Optional task description'),
      status: taskStatus.optional().default('todo'),
      priority: taskPriority.optional().default(1),
      labels: z.array(z.string()).optional().describe('Optional labels'),
      assigneeId: z
        .string()
        .optional()
        .describe('Optional assignee ID to assign on creation'),
    }),
  }),
  updateTask: tool({
    description:
      'Update an existing task. Use to change title, description, status, or priority.',
    inputSchema: z.object({
      id: taskId,
      title: z.string().optional(),
      description: z.string().optional(),
      status: taskStatus.optional(),
      priority: taskPriority.optional(),
    }),
  }),
  deleteTask: tool({
    description: 'Permanently delete a task.',
    inputSchema: z.object({ id: taskId }),
  }),
  assignTask: tool({
    description: 'Assign a task to one of the available team members.',
    inputSchema: z.object({
      id: taskId,
      assigneeId: z
        .string()
        .describe(
          `ID of the assignee. Available: ${assignees.map((a) => `${a.id}=${a.name}`).join(', ')}`,
        ),
    }),
  }),
  unassignTask: tool({
    description: 'Remove the current assignee from a task.',
    inputSchema: z.object({ id: taskId }),
  }),
  addTaskLabel: tool({
    description: 'Add a label/tag to a task.',
    inputSchema: z.object({
      id: taskId,
      label: z.string().describe('The label to add'),
    }),
  }),
  removeTaskLabel: tool({
    description: 'Remove a label/tag from a task.',
    inputSchema: z.object({
      id: taskId,
      label: z.string().describe('The label to remove'),
    }),
  }),
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, tasks } = body;

    const assigneeList = assignees
      .map((a) => `  - ID ${a.id}: ${a.name}`)
      .join('\n');

    const systemPrompt = `You are an AI assistant for a task management app called Polytask.

Tasks have: title, description, status (todo, in-progress, in-review, done, cancelled), priority (0=none, 1=low, 2=medium, 3=high, 4=urgent), assignee, and labels.

Available team members:
${assigneeList}

Current tasks:
${tasks ? JSON.stringify(tasks, null, 2) : 'No tasks available'}

Guidelines:
- Use your tools to directly create, update, delete, assign, or label tasks when asked
- Reference tasks by ID or title
- Be concise — confirm actions briefly after completing them`;

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const result = streamText({
      model: openai('gpt-5.2'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools,
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
