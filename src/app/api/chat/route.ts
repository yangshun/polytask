import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';


export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, tasks } = body;

    const systemPrompt = `You are an AI assistant for a task management application called Polytask. Your role is to help users manage their tasks efficiently and provide insights about their productivity.

Context about the application:
- Users can create, edit, delete, and organize tasks
- Tasks have properties like title, description, status (todo, in-progress, done), priority (low, medium, high, critical), assignees, and labels
- The app uses Redux for state management and supports undo/redo functionality
- Users can filter and sort tasks by various criteria

Current tasks in the system:
${tasks ? JSON.stringify(tasks, null, 2) : 'No tasks available'}

Guidelines:
- Be helpful and concise in your responses
- When discussing tasks, reference them by title or id when possible
- Provide actionable advice for task management and productivity
- If asked to create or modify tasks, explain what actions the user should take in the UI
- Stay focused on task management and productivity topics
- Be friendly and supportive`;

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}