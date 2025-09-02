import { RootState } from '~/store/store';

export const selectAiChatSidebarVisible = (state: RootState): boolean =>
  state.display.aiChatSidebarVisible;
