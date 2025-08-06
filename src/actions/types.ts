import { UnknownAction } from '@reduxjs/toolkit';

export type Command = Readonly<{
  action: () => UnknownAction;
  id: string;
  name: string;
  description?: string;
  group?: 'theme' | 'tasks';
  icon?: React.ElementType;
  shortcut?: string;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandCreator = (params?: any) => Command;
