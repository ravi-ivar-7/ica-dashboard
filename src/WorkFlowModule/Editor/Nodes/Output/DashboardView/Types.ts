export interface DashboardViewConfig {
  view_type: string;
  chart_type: string;
  refresh_interval: number;
  auto_update: boolean;
}

export interface DashboardViewInputs {
  data: any;
  title?: string;
}

export interface DashboardViewOutputs {
  view_id: string;
  dashboard_url: string;
  success: boolean;
}

