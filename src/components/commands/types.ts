export type CommandData = Readonly<{
  id: string;
  name: string;
  description?: string;
  group?: 'general' | 'theme' | 'tasks';
  icon: React.ElementType;
  shortcut?: string;
}>;

export type Command = CommandData &
  Readonly<{
    action: () => void;
    commandPalette: boolean;
  }>;

export type CommandCreator = (params?: any) => Command;
