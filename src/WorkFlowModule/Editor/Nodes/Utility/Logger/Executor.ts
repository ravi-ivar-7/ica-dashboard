import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { LoggerConfig, LoggerInputs, LoggerOutputs } from "./Types";

export async function executeLogger(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as LoggerConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;
  const message = node.inputs.find(i => i.name === 'message')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for logger node" };
  }

  try {
    const logLevel = config.log_level || 'info';
    const includeTimestamp = config.include_timestamp !== false;
    const includeMetadata = config.include_metadata === true;

    let logEntry = '';

    if (includeTimestamp) {
      logEntry += `[${new Date().toISOString()}] `;
    }

    logEntry += `[${logLevel.toUpperCase()}] `;

    if (message) {
      logEntry += `${message}: `;
    }

    if (typeof input === 'string') {
      logEntry += input;
    } else {
      logEntry += JSON.stringify(input, null, 2);
    }

    if (includeMetadata) {
      logEntry += ` (Node: ${node.id}, Type: ${node.type})`;
    }

    // Log to console for debugging
    console.log(logEntry);

    const outputs: LoggerOutputs = {
      output: input, // Pass through the input
      log_entry: logEntry,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Logger execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

