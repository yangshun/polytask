import {
  RiDeleteBinLine,
  RiForbidLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from 'react-icons/ri';

import { CommandCreator } from '~/actions/types';
import {
  clearSelectedTask,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '~/store/features/tasks/tasks-slice';
import { store } from '~/store/store';

export const taskDeleteCommand: CommandCreator = (id: string) => ({
  id: 'task.delete',
  name: 'Delete task',
  icon: RiDeleteBinLine,
  shortcut: 'Cmd+Backspace',
  group: 'tasks',
  description: 'Delete the selected task',
  action: () => store.dispatch(deleteTask(id)),
});

export const taskUnselectCommand: CommandCreator = () => ({
  id: 'task.unselect',
  name: 'Unselect task',
  icon: RiForbidLine,
  shortcut: 'escape',
  group: 'tasks',
  description: 'Unselect the selected task',
  action: () => store.dispatch(clearSelectedTask()),
});

export const taskSelectNextCommand: CommandCreator = () => ({
  id: 'task.select.next',
  name: 'Select next task',
  icon: RiArrowDownSLine,
  shortcut: 'ArrowDown',
  group: 'tasks',
  description: 'Navigate to the next task',
  action: () => store.dispatch(selectNextTask()),
});

export const taskSelectPreviousCommand: CommandCreator = () => ({
  id: 'task.select.prev',
  name: 'Select previous task',
  icon: RiArrowUpSLine,
  shortcut: 'ArrowUp',
  group: 'tasks',
  description: 'Navigate to the previous task',
  action: () => store.dispatch(selectPreviousTask()),
});
