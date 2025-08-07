import { TaskList } from '~/components/tasks/task-list';
import { ThemeToggle } from '~/components/theme/theme-toggle';
import { CommandPalette } from '~/components/commands/command-palette';
import { CommandsInitializer } from '~/components/commands/commands-initializer';
import { cn } from '~/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between gap-2 p-2">
        <h1 className="text-base tracking-wide">Multitask</h1>
        <div className="flex items-center gap-2">
          <CommandsInitializer />
          <CommandPalette />
          <ThemeToggle />
        </div>
      </div>
      <div className={cn('px-2 pb-2 grow h-0')}>
        <TaskList />
      </div>
    </div>
  );
}
