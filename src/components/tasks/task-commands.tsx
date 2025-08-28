import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { MdAssignmentInd, MdSignalCellular4Bar } from 'react-icons/md';
import {
  RiDeleteBin7Line,
  RiForbidLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiStickyNoteAddLine,
  RiProgress4Line,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiEqualizerFill,
  RiRefreshLine,
} from 'react-icons/ri';

import type { CommandCreator, CommandData } from '~/components/commands/types';
import {
  clearSelectedTask,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '~/store/features/tasks/tasks-slice';
import { resetToDefault } from '~/store/features/display/display-slice';
import { store } from '~/store/store';

// Undo
export const taskUndoCommandData: CommandData = {
  id: 'task.undo',
  name: 'Undo last change',
  icon: RiArrowGoBackLine,
  shortcut: 'Cmd+Z',
  group: 'tasks',
  description: 'Undo the last change',
};
export const taskUndoCommandCreator: CommandCreator = () => ({
  ...taskUndoCommandData,
  action: () => store.dispatch(UndoActionCreators.undo()),
  commandPalette: true,
});

// Redo
export const taskRedoCommandData: CommandData = {
  id: 'task.redo',
  name: 'Redo change',
  icon: RiArrowGoForwardLine,
  shortcut: 'Cmd+Shift+Z',
  group: 'tasks',
  description: 'Redo the last undone change',
};
export const taskRedoCommandCreator: CommandCreator = () => ({
  ...taskRedoCommandData,
  action: () => store.dispatch(UndoActionCreators.redo()),
  commandPalette: true,
});

// Create task dialog
export const taskCreateDialogOpenCommandData: CommandData = {
  id: 'task.create.open',
  name: 'Create new task',
  icon: RiStickyNoteAddLine,
  shortcut: 'C',
  group: 'tasks',
  description: 'Create a new task',
};
export const taskCreateDialogOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskCreateDialogOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Display options
export const taskDisplayPropertiesCommandData: CommandData = {
  id: 'task.display_properties',
  name: 'Show display options',
  icon: RiEqualizerFill,
  shortcut: 'Shift+V',
  group: 'tasks',
  description: 'Show display options',
};
export const taskDisplayPropertiesCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskDisplayPropertiesCommandData,
  action: () => func(),
  commandPalette: true,
});

// Reset display to default
export const taskDisplayResetCommandData: CommandData = {
  id: 'task.display.reset',
  name: 'Reset to default display',
  icon: RiRefreshLine,
  shortcut: 'Cmd+Shift+R',
  group: 'tasks',
  description: 'Reset display options to default settings',
};
export const taskDisplayResetCommandCreator: CommandCreator = () => ({
  ...taskDisplayResetCommandData,
  action: () => store.dispatch(resetToDefault()),
  commandPalette: true,
});

// Change status
export const taskStatusOpenCommandData: CommandData = {
  id: 'task.status.open',
  name: 'Change status',
  icon: RiProgress4Line,
  shortcut: 'S',
  group: 'tasks',
  description: 'Change status of the selected task',
};
export const taskStatusOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskStatusOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Change priority
export const taskPriorityOpenCommandData: CommandData = {
  id: 'task.priority.open',
  name: 'Change priority',
  icon: MdSignalCellular4Bar,
  shortcut: 'P',
  group: 'tasks',
  description: 'Change priority of the selected task',
};
export const taskPriorityOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskPriorityOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Change assignee
export const taskAssigneeOpenCommandData: CommandData = {
  id: 'task.assignee.open',
  name: 'Change assignee',
  icon: MdAssignmentInd,
  shortcut: 'A',
  group: 'tasks',
  description: 'Change assignee of the selected task',
};
export const taskAssigneeOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskAssigneeOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Delete task
export const taskDeleteCommandData: CommandData = {
  id: 'task.delete',
  name: 'Delete task',
  icon: RiDeleteBin7Line,
  shortcut: 'Cmd+Backspace',
  group: 'tasks',
  description: 'Delete the selected task',
};
export const taskDeleteCommandCreator: CommandCreator = (id: string) => ({
  ...taskDeleteCommandData,
  action: () => store.dispatch(deleteTask(id)),
  commandPalette: true,
});

// Unselect
export const taskUnselectCommandData: CommandData = {
  id: 'task.unselect',
  name: 'Unselect task',
  icon: RiForbidLine,
  shortcut: 'Escape',
  group: 'tasks',
  description: 'Unselect the selected task',
};
export const taskUnselectCommandCreator: CommandCreator = () => ({
  ...taskUnselectCommandData,
  action: () => store.dispatch(clearSelectedTask()),
  commandPalette: true,
});

// Select next
export const taskSelectNextCommandData: CommandData = {
  id: 'task.select.next',
  name: 'Select next task',
  icon: RiArrowDownSLine,
  shortcut: 'ArrowDown',
  group: 'tasks',
  description: 'Navigate to the next task',
};
export const taskSelectNextCommandCreator: CommandCreator = () => ({
  ...taskSelectNextCommandData,
  action: () => store.dispatch(selectNextTask()),
  commandPalette: false,
});

// Select previous
export const taskSelectPreviousCommandData: CommandData = {
  id: 'task.select.prev',
  name: 'Select previous task',
  icon: RiArrowUpSLine,
  shortcut: 'ArrowUp',
  group: 'tasks',
  description: 'Navigate to the previous task',
};
export const taskSelectPreviousCommandCreator: CommandCreator = () => ({
  ...taskSelectPreviousCommandData,
  action: () => store.dispatch(selectPreviousTask()),
  commandPalette: false,
});
