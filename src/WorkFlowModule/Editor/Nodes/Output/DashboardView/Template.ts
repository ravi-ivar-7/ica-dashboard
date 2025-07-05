import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const dashboardViewTemplate: NodeTemplate = {
  id: "dashboard-view",
  type: "dashboard-view",
  name: "Dashboard View",
  description: "Display data in a dashboard with charts and visualizations",
  category: "output",
  icon: "📊",
  inputs: [
    { name: "data", type: "any", required: true, description: "Data to display in dashboard" },
    { name: "title", type: "text", description: "Dashboard title" },
  ],
  outputs: [
    { name: "view_id", type: "text", description: "Unique view identifier" },
    { name: "dashboard_url", type: "text", description: "URL to access the dashboard" },
    { name: "success", type: "boolean", description: "Whether dashboard was created successfully" },
  ],
  config: {
    view_type: "chart", // chart, table, card, metric
    chart_type: "bar", // bar, line, pie, scatter, area
    refresh_interval: 30000, // milliseconds
    auto_update: true,
  },
};

