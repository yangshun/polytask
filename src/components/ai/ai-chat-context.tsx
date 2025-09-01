'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAppSelector } from '~/store/hooks';
import { selectAllTasks } from '~/store/features/tasks/tasks-selectors';

interface AiChatContextValue {
  tasks: ReturnType<typeof selectAllTasks>;
}

const AiChatContext = createContext<AiChatContextValue | undefined>(undefined);

interface AiChatProviderProps {
  children: ReactNode;
}

export function AiChatProvider({ children }: AiChatProviderProps) {
  const tasks = useAppSelector(selectAllTasks);

  const value = {
    tasks,
  };

  return (
    <AiChatContext.Provider value={value}>
      {children}
    </AiChatContext.Provider>
  );
}

export function useAiChatContext() {
  const context = useContext(AiChatContext);
  if (context === undefined) {
    throw new Error('useAiChatContext must be used within an AiChatProvider');
  }
  return context;
}