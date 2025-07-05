import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { MergeConfig, MergeInputs, MergeOutputs } from "./Types";

export async function executeMerge(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as MergeConfig;
  const input1 = node.inputs.find(i => i.name === 'input1')?.value;
  const input2 = node.inputs.find(i => i.name === 'input2')?.value;
  const input3 = node.inputs.find(i => i.name === 'input3')?.value;

  try {
    const mergeType = config.merge_type || 'object';
    let merged: any;

    switch (mergeType) {
      case 'object':
        merged = {};
        if (input1 !== undefined) {
          if (typeof input1 === 'object' && input1 !== null) {
            Object.assign(merged, input1);
          } else {
            merged.input1 = input1;
          }
        }
        if (input2 !== undefined) {
          if (typeof input2 === 'object' && input2 !== null) {
            Object.assign(merged, input2);
          } else {
            merged.input2 = input2;
          }
        }
        if (input3 !== undefined) {
          if (typeof input3 === 'object' && input3 !== null) {
            Object.assign(merged, input3);
          } else {
            merged.input3 = input3;
          }
        }
        break;
      case 'array':
        merged = [input1, input2, input3].filter(x => x !== undefined);
        break;
      case 'concat':
        merged = String(input1 || '') + String(input2 || '') + String(input3 || '');
        break;
      default:
        merged = { input1, input2, input3 };
    }

    const outputs: MergeOutputs = {
      merged: merged,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Merge execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

