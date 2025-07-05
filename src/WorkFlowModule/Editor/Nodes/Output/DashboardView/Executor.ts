import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { DashboardViewConfig, DashboardViewInputs, DashboardViewOutputs } from "./Types";

export async function executeDashboardView(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as DashboardViewConfig;
  const data = node.inputs.find(i => i.name === 'data')?.value;
  const title = node.inputs.find(i => i.name === 'title')?.value;

  if (data === undefined) {
    return { success: false, error: "Data is required for dashboard view node" };
  }

  try {
    const viewType = config.view_type || 'chart';
    const chartType = config.chart_type || 'bar';
    const refreshInterval = Math.max(config.refresh_interval || 30000, 1000); // Minimum 1 second
    const autoUpdate = config.auto_update !== false;

    // Generate unique view ID
    const viewId = `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mock dashboard creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Process data for dashboard
    let processedData: any;
    
    if (Array.isArray(data)) {
      // Array data - suitable for charts
      processedData = {
        type: 'dataset',
        records: data.length,
        sample: data.slice(0, 5), // First 5 records as sample
      };
    } else if (typeof data === 'object' && data !== null) {
      // Object data - convert to key-value pairs for visualization
      processedData = {
        type: 'object',
        keys: Object.keys(data),
        values: Object.values(data),
      };
    } else {
      // Primitive data - create simple metric view
      processedData = {
        type: 'metric',
        value: data,
      };
    }

    // Generate dashboard URL
    const dashboardUrl = `https://dashboard.example.com/view/${viewId}?type=${viewType}&chart=${chartType}&refresh=${refreshInterval}`;

    // Log dashboard creation (in production, this would create actual dashboard)
    console.log(`Dashboard created: ${title || 'Untitled'} (${viewType}/${chartType})`);
    console.log(`Data processed:`, processedData);
    console.log(`Dashboard URL: ${dashboardUrl}`);

    const outputs: DashboardViewOutputs = {
      view_id: viewId,
      dashboard_url: dashboardUrl,
      success: true,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Dashboard view execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

