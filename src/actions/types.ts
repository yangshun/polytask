import { UnknownAction } from '@reduxjs/toolkit';

export type Command = Readonly<{
  action: () => UnknownAction;
  id: string;
  name: string;
  description?: string;
  group?: 'theme';
  icon?: React.ElementType;
  shortcut?: string;
}>;
