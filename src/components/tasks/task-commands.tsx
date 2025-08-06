import { Ban, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CommandCreator } from '~/actions/types';
import {
  clearSelectedTask,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '~/store/features/tasks/tasks-slice';

export const TaskDeleteCommandIcon = Trash2;
export const taskDeleteCommand: CommandCreator = (id: string) => ({
  id: 'task.delete',
  name: 'Delete task',
  icon: TaskDeleteCommandIcon,
  shortcut: 'd',
  group: 'tasks',
  description: 'Delete the selected task',
  action: () => deleteTask(id),
});

export const TaskUnselectCommandIcon = Ban;
export const taskUnselectCommand: CommandCreator = () => ({
  id: 'task.unselect',
  name: 'Unselect task',
  icon: TaskUnselectCommandIcon,
  shortcut: 'escape',
  group: 'tasks',
  description: 'Unselect the selected task',
  action: () => clearSelectedTask(),
});

export const TaskSelectNextCommandIcon = ChevronDown;
export const taskSelectNextCommand: CommandCreator = () => ({
  id: 'task.select.next',
  name: 'Select next task',
  icon: TaskSelectNextCommandIcon,
  shortcut: 'j',
  group: 'tasks',
  description: 'Navigate to the next task',
  action: () => selectNextTask(),
});

export const TaskSelectPreviousCommandIcon = ChevronUp;
export const taskSelectPreviousCommand: CommandCreator = () => ({
  id: 'task.select.prev',
  name: 'Select previous task',
  icon: TaskSelectPreviousCommandIcon,
  shortcut: 'k',
  group: 'tasks',
  description: 'Navigate to the previous task',
  action: () => selectPreviousTask(),
});
