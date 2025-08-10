import { MdAssignmentInd, MdSignalCellular4Bar } from 'react-icons/md';
import {
  RiDeleteBinLine,
  RiForbidLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiStickyNoteAddLine,
  RiProgress4Line,
} from 'react-icons/ri';

import { CommandCreator } from '~/actions/types';
import {
  clearSelectedTask,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '~/store/features/tasks/tasks-slice';
import { store } from '~/store/store';

export const taskCreateDialogOpenCommand: CommandCreator = (
  func: () => void,
) => ({
  id: 'task.create.open',
  name: 'Create task',
  icon: RiStickyNoteAddLine,
  shortcut: 'C',
  group: 'tasks',
  description: 'Create a new task',
  action: () => func(),
  commandPalette: true,
});

export const taskStatusOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.status.open',
  name: 'Change status',
  icon: RiProgress4Line,
  shortcut: 'S',
  group: 'tasks',
  description: 'Change status of the selected task',
  action: () => func(),
  commandPalette: true,
});

export const taskPriorityOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.priority.open',
  name: 'Change priority',
  icon: MdSignalCellular4Bar,
  shortcut: 'P',
  group: 'tasks',
  description: 'Change priority of the selected task',
  action: () => func(),
  commandPalette: true,
});

export const taskAssigneeOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.assignee.open',
  name: 'Change assignee',
  icon: MdAssignmentInd,
  shortcut: 'A',
  group: 'tasks',
  description: 'Change assignee of the selected task',
  action: () => func(),
  commandPalette: true,
});

export const taskDeleteCommand: CommandCreator = (id: string) => ({
  id: 'task.delete',
  name: 'Delete task',
  icon: RiDeleteBinLine,
  shortcut: 'Cmd+Backspace',
  group: 'tasks',
  description: 'Delete the selected task',
  action: () => store.dispatch(deleteTask(id)),
  commandPalette: true,
});

export const taskUnselectCommand: CommandCreator = () => ({
  id: 'task.unselect',
  name: 'Unselect task',
  icon: RiForbidLine,
  shortcut: 'Escape',
  group: 'tasks',
  description: 'Unselect the selected task',
  action: () => store.dispatch(clearSelectedTask()),
  commandPalette: true,
});

export const taskSelectNextCommand: CommandCreator = () => ({
  id: 'task.select.next',
  name: 'Select next task',
  icon: RiArrowDownSLine,
  shortcut: 'ArrowDown',
  group: 'tasks',
  description: 'Navigate to the next task',
  action: () => store.dispatch(selectNextTask()),
  commandPalette: false,
});

export const taskSelectPreviousCommand: CommandCreator = () => ({
  id: 'task.select.prev',
  name: 'Select previous task',
  icon: RiArrowUpSLine,
  shortcut: 'ArrowUp',
  group: 'tasks',
  description: 'Navigate to the previous task',
  action: () => store.dispatch(selectPreviousTask()),
  commandPalette: false,
});
