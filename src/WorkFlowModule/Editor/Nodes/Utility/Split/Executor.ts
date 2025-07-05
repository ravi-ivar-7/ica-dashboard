import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { SplitConfig, SplitInputs, SplitOutputs } from "./Types";

export async function executeSplit(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as SplitConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for split node" };
  }

  try {
    const splitType = config.split_type || 'string';
    const delimiter = config.delimiter || ',';
    const maxSplits = Math.min(config.max_splits || 3, 10); // Limit to prevent excessive outputs
    
    let splitResults: any[] = [];

    switch (splitType) {
      case 'string':
        if (typeof input === 'string') {
          splitResults = input.split(delimiter).slice(0, maxSplits);
        } else {
          splitResults = [String(input)];
        }
        break;
      case 'array':
        if (Array.isArray(input)) {
          splitResults = input.slice(0, maxSplits);
        } else {
          splitResults = [input];
        }
        break;
      case 'object':
        if (typeof input === 'object' && input !== null) {
          const values = Object.values(input);
          splitResults = values.slice(0, maxSplits);
        } else {
          splitResults = [input];
        }
        break;
      default:
        splitResults = [input];
    }

    // Ensure we have at least empty values for all outputs
    while (splitResults.length < 3) {
      splitResults.push(undefined);
    }

    const outputs: SplitOutputs = {
      output1: splitResults[0],
      output2: splitResults[1],
      output3: splitResults[2],
      array: splitResults.filter(x => x !== undefined),
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Split execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

