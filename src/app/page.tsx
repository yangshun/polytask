'use client';

import { TaskList } from '@/components/tasks/task-list';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { CommandPalette } from '@/components/commands/command-palette';
import { GlobalCommands } from '@/components/global/global-commands';
import { AiChatSidebar } from '@/components/ai/ai-chat-sidebar';
import { AiChatProvider } from '@/components/ai/ai-chat-context';
import { useAppSelector } from '@/store/hooks';
import { selectAiChatSidebarVisible } from '@/store/features/display/display-selectors';
import { cn } from '@/lib/utils';
import { RiGithubFill } from 'react-icons/ri';
import { Group as PanelGroup, Panel, Separator } from 'react-resizable-panels';

export default function Home() {
  const aiChatSidebarVisible = useAppSelector(selectAiChatSidebarVisible);

  return (
    <div className="flex flex-col h-screen isolate">
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
        <GlobalCommands />
      </div>
      <div className={cn('px-2 pb-2 grow h-0')}>
        <PanelGroup>
          <Panel minSize={50} defaultSize={70}>
            <TaskList />
          </Panel>
          {aiChatSidebarVisible && (
            <>
              <Separator className="w-px cursor-col-resize px-0.5" />
              <Panel defaultSize={25} minSize={20}>
                <AiChatProvider>
                  <AiChatSidebar />
                </AiChatProvider>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
