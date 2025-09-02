'use client';

import { cn } from '~/lib/utils';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  assignTask,
  deleteTask,
  updateTask,
} from '~/store/features/tasks/tasks-slice';
import {
  selectSelectedTask,
  selectSelectedTaskId,
} from '~/store/features/tasks/tasks-selectors';
import { selectSortedTasks } from '~/store/features/tasks/tasks-selectors';
import { TaskItem } from '~/components/tasks/task-item';
import { TaskToolbar } from '~/components/tasks/task-toolbar';
import { TaskDetails } from '~/components/tasks/task-details';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useEffect } from 'react';
import {
  taskSelectNextCommandCreator,
  taskSelectPreviousCommandCreator,
  taskUnselectCommandCreator,
} from './task-commands';
import { useCommands } from '~/components/commands/commands-context';
import { TaskStatusSummary } from '~/components/tasks/status/task-status-summary';
import type { TaskObject } from '~/components/tasks/types';
import { TaskEmptyState } from '~/components/tasks/task-empty-state';
import { useMediaQuery } from '~/lib/use-media-query';

export function TaskList() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();
  const tasks: TaskObject[] = useAppSelector(selectSortedTasks);

  const selectedTask: TaskObject | null = useAppSelector(selectSelectedTask);
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const hasSelection = !!selectedTaskId;
  const isDesktop = useMediaQuery('(min-width: 1024px)', true);

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  function renderListSection() {
    return (
      <div className={cn('flex flex-col size-full', 'divide-y divide-input')}>
        {tasks.length === 0 ? (
          <TaskEmptyState />
        ) : (
          <>
            <ScrollArea className="h-0 grow">
              <div className="size-full">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onAssigneeChange={function (assigneeId) {
                      dispatch(assignTask({ id: task.id, assigneeId }));
                    }}
                    onStatusChange={function (status) {
                      dispatch(
                        updateTask({ id: task.id, updates: { status } }),
                      );
                    }}
                    onPriorityChange={function (priority) {
                      dispatch(
                        updateTask({ id: task.id, updates: { priority } }),
                      );
                    }}
                    onDelete={handleDeleteTask}
                    isSelected={selectedTaskId === task.id}
                  />
                ))}
              </div>
            </ScrollArea>
            <TaskStatusSummary />
          </>
        )}
      </div>
    );
  }

  const taskDetails = selectedTask ? (
    <TaskDetails key={selectedTask.id} task={selectedTask} />
  ) : null;

  useEffect(() => {
    const unregisterNext = registerCommand(taskSelectNextCommandCreator());
    const unregisterPrevious = registerCommand(
      taskSelectPreviousCommandCreator(),
    );
    const unregisterTaskUnselect = registerCommand(
      taskUnselectCommandCreator(),
    );

    return () => {
      unregisterNext();
      unregisterPrevious();
      unregisterTaskUnselect();
    };
  }, [registerCommand]);

  return (
    <div
      className={cn(
        'flex flex-col',
        'border border-input',
        'rounded-sm',
        'divide-y divide-input',
        'h-full bg-background',
      )}>
      <div className={cn('flex items-center w-full', 'py-2 pr-2 pl-3')}>
        <TaskToolbar />
      </div>
      <div className="h-0 grow">
        <PanelGroup direction="horizontal">
          {isDesktop ? (
            <>
              <Panel
                id="desktop-list"
                minSize={50}
                defaultSize={hasSelection ? 70 : 100}>
                {renderListSection()}
              </Panel>
              {selectedTask && (
                <>
                  <PanelResizeHandle className="w-px bg-border cursor-col-resize" />
                  <Panel id="desktop-details" minSize={20}>
                    {taskDetails}
                  </Panel>
                </>
              )}
            </>
          ) : (
            <Panel id="mobile" minSize={0} defaultSize={100}>
              {selectedTask ? taskDetails : renderListSection()}
            </Panel>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
