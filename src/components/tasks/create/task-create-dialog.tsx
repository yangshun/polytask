import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { TaskTitleField } from '~/components/tasks/title/task-title-field';
import { TaskDescriptionField } from '~/components/tasks/description/task-description-field';
import { TaskStatusSelector } from '~/components/tasks/status/task-status-selector';
import { TaskAssigneeSelector } from '~/components/tasks/assignee/task-assignee-selector';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { addTask, setSelectedTask } from '~/store/features/tasks/tasks-slice';
import { selectAllTasks } from '~/store/features/tasks/tasks-selectors';
import type {
  TaskRaw,
  TaskStatus,
  TaskPriority,
} from '~/components/tasks/types';
import { TaskPrioritySelector } from '../priority/task-priority-selector';
import { taskCreateDialogOpenCommandCreator } from '../task-commands';
import { useCommands } from '~/components/commands/commands-context';

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

// TODO: Should be globally unique and not depend on existing tasks
// because undo/redo affects task IDs. Maybe shift it into Redux store
function getNextTaskId(existingIds: string[]) {
  let maxNum = 0;
  for (const id of existingIds) {
    const match = id.match(/^(.*?-)(\d+)$/);
    if (match) {
      const num = parseInt(match[2], 10);
      if (!Number.isNaN(num)) {
        maxNum = Math.max(maxNum, num);
      }
    }
  }
  return `MUL-${maxNum + 1}`;
}

const commandScope = 'create-dialog';

export function TaskCreateDialog() {
  const { registerCommand, setScope, clearScope } = useCommands();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>(0);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  const nextId = useMemo(() => getNextTaskId(tasks.map((t) => t.id)), [tasks]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority(0);
    setAssigneeId(null);
  }

  function handleCreate() {
    const createdAt = getTodayDateString();
    const newTask: TaskRaw = {
      id: nextId,
      title: title.trim() || 'Untitled',
      description: description,
      status,
      priority,
      assigneeId: assigneeId ?? undefined,
      labels: [],
      createdAt,
      updatedAt: createdAt,
    };
    dispatch(addTask(newTask));
    dispatch(setSelectedTask(newTask.id));
    setOpen(false);
    resetForm();
  }

  const openCommand = useMemo(
    () =>
      taskCreateDialogOpenCommandCreator(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    if (open) {
      setScope({ name: commandScope, allowGlobalKeybindings: false });

      return () => {
        clearScope();
      };
    }
  }, [open, setScope, clearScope]);

  useEffect(() => {
    const unregisterDialogOpen = registerCommand(openCommand);

    return () => {
      unregisterDialogOpen();
    };
  }, [registerCommand, openCommand]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          tooltip={openCommand.name}
          icon={openCommand.icon}
          variant="secondary"
          size="sm"
          aria-label={openCommand.name}
          shortcut={openCommand.shortcut}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <TaskTitleField value={title} onChange={setTitle} />
          <TaskDescriptionField
            value={description}
            onChange={setDescription}
            placeholder="Add a description..."
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground -ml-2">
            <TaskStatusSelector
              commandScope={commandScope}
              value={status}
              onChange={(s) => setStatus(s)}
            />
            <TaskPrioritySelector
              commandScope={commandScope}
              value={priority}
              onChange={(p) => setPriority(p)}
            />
            <TaskAssigneeSelector
              commandScope={commandScope}
              value={assigneeId ?? undefined}
              onChange={(a) => setAssigneeId(a)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleCreate}
            disabled={!title.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
