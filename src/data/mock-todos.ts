import { Todo } from '~/types/todo';

export const mockTodos: Todo[] = [
  {
    id: 'MUL-92',
    title: 'study plans / lists',
    description:
      'Create comprehensive study plans and organize learning materials into structured lists',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: '1',
      name: 'John Doe',
      avatar: '👤',
    },
    labels: ['frontend', 'planning'],
    createdAt: '2023-10-15',
    updatedAt: '2023-10-15',
    dueDate: '2023-10-30',
  },
  {
    id: 'MUL-91',
    title: 'marketing: host email logo image',
    description: 'Update email templates with new logo and branding guidelines',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: '2',
      name: 'Jane Smith',
      avatar: '👤',
    },
    labels: ['marketing', 'design'],
    createdAt: '2023-10-14',
    updatedAt: '2023-10-14',
  },
  {
    id: 'MUL-85',
    title: 'workspace: post-launch items',
    description:
      'Handle all post-launch tasks and improvements for the workspace feature',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      id: '3',
      name: 'Bob Johnson',
      avatar: '👤',
    },
    labels: ['workspace', 'post-launch'],
    createdAt: '2023-09-20',
    updatedAt: '2023-10-12',
  },
  {
    id: 'MUL-77',
    title: 'ui: mobile nav redesign',
    description: 'Redesign mobile navigation for better user experience',
    status: 'done',
    priority: 'medium',
    assignee: {
      id: '4',
      name: 'Alice Brown',
      avatar: '👤',
    },
    labels: ['ui', 'mobile', 'redesign'],
    createdAt: '2023-09-15',
    updatedAt: '2023-09-25',
  },
];
