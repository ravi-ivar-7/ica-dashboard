import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { ErrorCatcherConfig, ErrorCatcherInputs, ErrorCatcherOutputs } from "./Types";

export async function executeErrorCatcher(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as ErrorCatcherConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;

  try {
    const retryCount = Math.min(config.retry_count || 3, 10); // Maximum 10 retries
    const retryDelay = Math.min(config.retry_delay || 1000, 10000); // Maximum 10 seconds
    const fallbackValue = config.fallback_value;

    let lastError: any = null;
    let attempts = 0;

    // Check if input contains error information
    const hasError = input && typeof input === 'object' && 
                    (input.error || input.success === false);

    if (!hasError) {
      // No error, pass through
      const outputs: ErrorCatcherOutputs = {
        output: input,
        error: null,
        retry_count: 0,
      };

      return {
        success: true,
        outputs: outputs,
      };
    }

    // Handle error case
    lastError = input.error || "Unknown error";

    // In a real implementation, this would retry the upstream operation
    // For now, we'll simulate retry logic
    for (attempts = 1; attempts <= retryCount; attempts++) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      // Simulate random success on retry
      if (Math.random() > 0.7) {
        // Success on retry
        const outputs: ErrorCatcherOutputs = {
          output: input.data || input,
          error: null,
          retry_count: attempts,
        };

        return {
          success: true,
          outputs: outputs,
        };
      }
    }

    // All retries failed, use fallback
    const outputs: ErrorCatcherOutputs = {
      output: fallbackValue,
      error: lastError,
      retry_count: attempts,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error catcher execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

