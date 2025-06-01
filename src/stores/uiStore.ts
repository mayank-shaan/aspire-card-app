import { defineStore } from 'pinia';
import type { UIState } from '@/types';

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    activeTab: 'my-cards',
    selectedCardId: null,
  }),

  actions: {
    setBreakpoint(isMobile: boolean, isTablet: boolean, isDesktop: boolean) {
      this.isMobile = isMobile;
      this.isTablet = isTablet;
      this.isDesktop = isDesktop;
    },

    setActiveTab(tab: 'my-cards' | 'company-cards') {
      this.activeTab = tab;
    },

    selectCard(cardId: string | null) {
      this.selectedCardId = cardId;
    },
  },
});
