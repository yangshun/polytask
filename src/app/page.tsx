import { TaskList } from '~/components/tasks/task-list';
import { ThemeToggle } from '~/components/theme/theme-toggle';
import { CommandPalette } from '~/components/commands/command-palette';
import { CommandsInitializer } from '~/components/commands/commands-initializer';

export default function Home() {
  return (
    <div className="container px-4 mx-auto py-10">
      <CommandsInitializer />
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multitask</h1>
          <p className="text-muted-foreground">
            Manage your tasks efficiently using AI
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CommandPalette />
          <ThemeToggle />
        </div>
      </div>
      <TaskList />
    </div>
  );
}
