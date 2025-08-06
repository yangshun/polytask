import { AppDispatch } from '~/store/store';

export type Command = Readonly<{
  action: () => AppDispatch;
  id: string;
  name: string;
  description?: string;
  group?: 'theme';
  icon?: React.ElementType;
  shortcut?: string;
}>;
