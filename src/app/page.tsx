import { TaskList } from '~/components/tasks/task-list';
import { ThemeToggle } from '~/components/theme/theme-toggle';
import { CommandPalette } from '~/components/commands/command-palette';
import { CommandsInitializer } from '~/components/commands/commands-initializer';
import { cn } from '~/lib/utils';
import { RiGithubFill } from 'react-icons/ri';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between gap-2 p-2">
        <h1
          className="text-xl font-semibold px-3"
          style={{ fontFamily: 'var(--font-poppins)' }}>
          Polytask
        </h1>
        <div className="flex items-center">
          <CommandPalette />
          <span className="inline-block mx-2 h-5 w-px bg-input" />
          <a
            className="inline-flex size-8 items-center justify-center rounded-sm hover:bg-accent"
            href="https://github.com/yangshun/polytask"
            target="_blank"
            rel="noopener noreferrer">
            <RiGithubFill className="size-5" />
          </a>
          <span className="inline-block mx-2 h-5 w-px bg-input" />
          <ThemeToggle />
        </div>
        <CommandsInitializer />
      </div>
      <div className={cn('px-2 pb-2 grow h-0')}>
        <TaskList />
      </div>
    </div>
  );
}
