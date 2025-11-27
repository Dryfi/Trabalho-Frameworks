export interface DashboardCard {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  trendPct?: number; // ex: +3.2 / -1.1
  icon?: string; // nome do material icon
}
