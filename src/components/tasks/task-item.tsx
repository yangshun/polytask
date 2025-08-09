'use client';

import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { TaskObject, TaskStatus, TaskPriority } from '~/types/task';
import { useAppDispatch } from '~/store/hooks';
import { setSelectedTask } from '~/store/features/tasks/tasks-slice';
import { TaskStatusIcon } from './status/task-status-icon';
import { useEffect, useRef, useState } from 'react';
import { taskDeleteCommand } from './task-commands';
import { TaskStatusCombobox } from './status/task-status-combobox';
import { RiProgress4Line } from 'react-icons/ri';
import { TaskAssigneeCombobox } from './assignee/task-assignee-combobox';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';
import { TaskPriorityCombobox } from './priority/task-priority-combobox';
import { TaskPriorityIcon } from './priority/task-priority-icon';
import { MdAssignmentInd } from 'react-icons/md';

interface TaskItemProps {
  task: TaskObject;
  onAssigneeChange: (assigneeId: string) => void;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export function TaskItem({
  task,
  onAssigneeChange,
  onStatusChange,
  onPriorityChange,
  onDelete,
  isSelected = false,
}: TaskItemProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [statusOpen, setStatusOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusSubOpen, setStatusSubOpen] = useState(false);
  const [assigneeSubOpen, setAssigneeSubOpen] = useState(false);
  const [prioritySubOpen, setPrioritySubOpen] = useState(false);

  function handleDelete() {
    onDelete(task.id);
  }

  useEffect(() => {
    if (isSelected && rootRef.current) {
      rootRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isSelected]);

  const DeleteIcon = taskDeleteCommand(task.id).icon!;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div ref={rootRef}>
          <div
            className={cn(
              'group flex items-center gap-3 px-3 py-2',
              isSelected ? 'bg-accent/50' : 'hover:bg-accent/25',
            )}
            onClick={() => {
              setTimeout(() => {
                dispatch(setSelectedTask(task.id));
              }, 0);
            }}>
            <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
              <PopoverTrigger asChild>
                <button
                  className="shrink-0 text-xs font-medium px-1.5 py-0.5"
                  aria-label="Change priority">
                  <TaskPriorityIcon priority={task.priority} />
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-[220px] p-0">
                <TaskPriorityCombobox
                  onSelect={(priority) => {
                    onPriorityChange(priority);
                    setPriorityOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-muted-foreground font-mono font-medium w-14">
              {task.id}
            </span>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <button className="shrink-0" aria-label="Change task status">
                  <TaskStatusIcon status={task.status} size="lg" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-[200px] p-0">
                <TaskStatusCombobox
                  onSelect={(status) => {
                    onStatusChange(status);
                    setStatusOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  'text-sm',
                  task.status === 'done' &&
                    'line-through text-muted-foreground',
                )}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {task.labels?.slice(0, 2).map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="text-xs px-1.5 py-0">
                  {label}
                </Badge>
              ))}
              {task.labels && task.labels.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{task.labels.length - 2}
                </Badge>
              )}
            </div>
            {task.assignee && (
              <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="shrink-0"
                    aria-expanded={assigneeOpen}
                    aria-label="Change assignee">
                    <img
                      src={task.assignee?.avatar}
                      alt={task.assignee?.name}
                      className="size-6 rounded-full"
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="right" className="w-[200px] p-0">
                  <TaskAssigneeCombobox
                    onSelect={(assigneeId) => {
                      onAssigneeChange(assigneeId);
                      setAssigneeOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuSub open={statusSubOpen} onOpenChange={setStatusSubOpen}>
          <ContextMenuSubTrigger>
            <RiProgress4Line className="size-4 text-muted-foreground" />
            <span className="ml-2">Status</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0 w-48">
            <TaskStatusCombobox
              onSelect={(status) => {
                onStatusChange(status);
                setStatusSubOpen(false);
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub
          open={assigneeSubOpen}
          onOpenChange={setAssigneeSubOpen}>
          <ContextMenuSubTrigger>
            <MdAssignmentInd className="size-4 text-muted-foreground" />
            <span className="ml-2">Assignee</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0 w-48">
            <TaskAssigneeCombobox
              onSelect={(assigneeId) => {
                onAssigneeChange(assigneeId);
                setAssigneeSubOpen(false);
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub
          open={prioritySubOpen}
          onOpenChange={setPrioritySubOpen}>
          <ContextMenuSubTrigger>
            <TaskPriorityIcon
              priority={2}
              className="size-4 text-muted-foreground"
            />
            <span className="ml-2">Priority</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0 w-56">
            <TaskPriorityCombobox
              onSelect={(priority) => {
                onPriorityChange(priority);
                setPrioritySubOpen(false);
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete}>
          <DeleteIcon className="size-4 text-muted-foreground" />
          <span className="ml-2">Delete...</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
