import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { DelayConfig, DelayInputs, DelayOutputs } from "./Types";

export async function executeDelay(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as DelayConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for delay node" };
  }

  try {
    let duration = config.duration || 1000;
    
    // Convert duration to milliseconds based on unit
    switch (config.unit) {
      case 's':
        duration = duration * 1000;
        break;
      case 'm':
        duration = duration * 60 * 1000;
        break;
      case 'ms':
      default:
        // Already in milliseconds
        break;
    }

    // Ensure duration is within reasonable bounds (max 5 minutes)
    duration = Math.min(duration, 5 * 60 * 1000);
    duration = Math.max(duration, 0);

    await new Promise(resolve => setTimeout(resolve, duration));

    const outputs: DelayOutputs = {
      output: input,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Delay execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

