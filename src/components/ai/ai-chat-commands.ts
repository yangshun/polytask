import { RiSparkling2Fill } from 'react-icons/ri';
import type { CommandCreator, CommandData } from '~/components/commands/types';
import { toggleAiChatSidebar } from '~/store/features/display/display-slice';
import { store } from '~/store/store';

export const aiChatToggleCommandData: CommandData = {
  id: 'ai.chat.toggle',
  name: 'Toggle AI Chat',
  icon: RiSparkling2Fill,
  shortcut: 'Cmd+I',
  group: 'general',
  description: 'Toggle the AI chat sidebar',
};

export const aiChatToggleCommandCreator: CommandCreator = () => ({
  ...aiChatToggleCommandData,
  action: () => store.dispatch(toggleAiChatSidebar()),
  commandPalette: true,
});
