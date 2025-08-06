import { UnknownAction } from '@reduxjs/toolkit';

export type Command = Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params: any) => UnknownAction;
  id: string;
  name: string;
  description?: string;
  group?: 'theme' | 'tasks';
  icon?: React.ElementType;
  shortcut?: string;
}>;
