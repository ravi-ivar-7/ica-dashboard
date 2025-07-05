import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { TimerConfig, TimerInputs, TimerOutputs } from "./Types";

export async function executeTimer(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as TimerConfig;
  const startInput = node.inputs.find(i => i.name === 'start')?.value;
  const stopInput = node.inputs.find(i => i.name === 'stop')?.value;

  try {
    const interval = Math.max(config.interval || 1000, 100); // Minimum 100ms
    const maxIterations = Math.min(config.max_iterations || 10, 100); // Maximum 100 iterations
    const autoStart = config.auto_start !== false;

    // For this mock implementation, we'll simulate a single tick
    // In a real implementation, this would manage a persistent timer
    const shouldStart = autoStart || startInput === true;
    const shouldStop = stopInput === true;

    if (shouldStop) {
      const outputs: TimerOutputs = {
        tick: 0,
        elapsed: 0,
        is_running: false,
      };

      return {
        success: true,
        outputs: outputs,
      };
    }

    if (shouldStart) {
      // Simulate timer execution
      await new Promise(resolve => setTimeout(resolve, Math.min(interval, 1000)));

      const outputs: TimerOutputs = {
        tick: 1,
        elapsed: interval,
        is_running: true,
      };

      return {
        success: true,
        outputs: outputs,
      };
    }

    // Timer not started
    const outputs: TimerOutputs = {
      tick: 0,
      elapsed: 0,
      is_running: false,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Timer execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

