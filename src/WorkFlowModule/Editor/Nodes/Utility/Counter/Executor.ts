import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { CounterConfig, CounterInputs, CounterOutputs } from "./Types";

export async function executeCounter(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as CounterConfig;
  const incrementInput = node.inputs.find(i => i.name === 'increment')?.value;
  const decrementInput = node.inputs.find(i => i.name === 'decrement')?.value;
  const resetInput = node.inputs.find(i => i.name === 'reset')?.value;

  try {
    const initialValue = config.initial_value || 0;
    const increment = config.increment || 1;
    const maxValue = config.max_value || 100;
    const resetOnMax = config.reset_on_max === true;

    // Get current counter value from node state or initialize
    let currentCount = (node as any).counterState || initialValue;

    if (resetInput === true) {
      currentCount = initialValue;
    } else if (incrementInput === true) {
      currentCount += increment;
      if (currentCount > maxValue) {
        if (resetOnMax) {
          currentCount = initialValue;
        } else {
          currentCount = maxValue;
        }
      }
    } else if (decrementInput === true) {
      currentCount -= increment;
      if (currentCount < 0) {
        currentCount = 0;
      }
    }

    // Store counter state (in a real implementation, this would be persisted)
    (node as any).counterState = currentCount;

    const outputs: CounterOutputs = {
      count: currentCount,
      is_max: currentCount >= maxValue,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Counter execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

