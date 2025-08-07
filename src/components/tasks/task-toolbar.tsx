'use client';

import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  selectHasNextTask,
  selectHasPreviousTask,
} from '~/store/features/tasks/tasks-selectors';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
} from './task-commands';

export function TaskToolbar() {
  const dispatch = useAppDispatch();
  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);

  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();

  return (
    <>
      <Button
        variant="outline"
        tooltip={taskSelectNextCommandObj.name}
        shortcut={taskSelectNextCommandObj.shortcut}
        size="sm"
        onClick={() => {
          dispatch(taskSelectNextCommandObj.action());
        }}
        disabled={!hasNextTask}
        aria-label={taskSelectNextCommandObj.name}
        icon={taskSelectNextCommandObj.icon}
      />
      <Button
        variant="outline"
        tooltip={taskSelectPreviousCommandObj.name}
        shortcut={taskSelectPreviousCommandObj.shortcut}
        size="sm"
        onClick={() => {
          dispatch(taskSelectPreviousCommandObj.action());
        }}
        disabled={!hasPreviousTask}
        aria-label={taskSelectPreviousCommandObj.name}
        icon={taskSelectPreviousCommandObj.icon}
      />
    </>
  );
}
