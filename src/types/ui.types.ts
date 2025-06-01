export interface UIState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  activeTab: 'my-cards' | 'company-cards';
  selectedCardId: string | null;
}

export interface AppBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export type NavigationItem = {
  name: string;
  icon: string;
  route: string;
};
