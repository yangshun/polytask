import { Ban, Trash2 } from 'lucide-react';
import { Command } from '~/actions/types';
import {
  clearSelectedTask,
  deleteTask,
} from '~/store/features/tasks/tasks-slice';

export const TaskDeleteCommandIcon = Trash2;
export const taskDeleteCommand: (id: string) => Command = (id: string) => ({
  id: 'task.delete',
  name: 'Delete task',
  icon: TaskDeleteCommandIcon,
  shortcut: 'd',
  group: 'tasks',
  description: 'Delete the selected task',
  action: () => deleteTask(id),
});

export const TaskUnselectCommandIcon = Ban;
export const taskUnselectCommand: () => Command = () => ({
  id: 'task.unselect',
  name: 'Unselect task',
  icon: TaskUnselectCommandIcon,
  shortcut: 'u',
  group: 'tasks',
  description: 'Unselect the selected task',
  action: () => clearSelectedTask(),
});
