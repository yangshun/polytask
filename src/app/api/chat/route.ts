import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';
import { assignees } from '@/data/mock-assignees';
import { tools } from '@/components/ai/tool-types';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const assigneeList = assignees
      .map((a) => `  - ID ${a.id}: ${a.name}`)
      .join('\n');

    const systemPrompt = `You are an AI assistant for a task management app called Polytask.

Tasks have: title, description, status (todo, in-progress, in-review, done, cancelled), priority (0=none, 1=urgent, 2=high, 3=medium, 4=low), assignee, and labels.

Available team members:
${assigneeList}

Guidelines:
- Don't use any headings in the response
- Call getTasks to retrieve the current task list whenever you need to reference, query, or modify tasks
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
