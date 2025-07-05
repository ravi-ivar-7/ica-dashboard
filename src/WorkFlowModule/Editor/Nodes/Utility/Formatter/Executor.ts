import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { FormatterConfig, FormatterInputs, FormatterOutputs } from "./Types";

export async function executeFormatter(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as FormatterConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for formatter node" };
  }

  try {
    const formatType = config.format_type || 'template';
    let formatted: any;

    switch (formatType) {
      case 'template':
        const template = config.template || '{{input}}';
        formatted = template.replace(/\{\{input\}\}/g, String(input));
        break;
      case 'json':
        formatted = JSON.stringify(input, null, 2);
        break;
      case 'csv':
        if (Array.isArray(input) && input.length > 0) {
          const headers = Object.keys(input[0]);
          const csvRows = [
            headers.join(','),
            ...input.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
          ];
          formatted = csvRows.join('\n');
        } else {
          formatted = String(input);
        }
        break;
      case 'date':
        const date = new Date(input);
        if (!isNaN(date.getTime())) {
          const dateFormat = config.date_format || 'YYYY-MM-DD';
          // Simple date formatting
          formatted = date.toISOString().split('T')[0];
        } else {
          formatted = String(input);
        }
        break;
      case 'number':
        const num = Number(input);
        if (!isNaN(num)) {
          const numberFormat = config.number_format || '0.00';
          const decimals = numberFormat.split('.')[1]?.length || 0;
          formatted = num.toFixed(decimals);
        } else {
          formatted = String(input);
        }
        break;
      default:
        formatted = String(input);
    }

    const outputs: FormatterOutputs = {
      formatted: formatted,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Formatter execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

