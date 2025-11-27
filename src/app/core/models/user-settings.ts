export interface UserSettings {
  userId: string;

  theme: 'light' | 'dark' | 'system';
  currency: 'BRL' | 'USD';

  dashboard: {
    showTrends: boolean;
    cards: {
      portfolioValue: boolean;
      dailyPnL: boolean;
      monthlyPnL: boolean;
      positions: boolean;
      alerts: boolean;
      notes: boolean;
    };
  };
}
