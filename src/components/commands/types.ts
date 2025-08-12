export type CommandData = Readonly<{
  id: string;
  name: string;
  description?: string;
  group?: 'theme' | 'tasks';
  icon: React.ElementType;
  shortcut?: string;
}>;

export type Command = CommandData &
  Readonly<{
    action: () => void;
    commandPalette: boolean;
  }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandCreator = (params?: any) => Command;
