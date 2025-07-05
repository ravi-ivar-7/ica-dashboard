import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { BranchConfig, BranchInputs, BranchOutputs } from "./Types";

export async function executeBranch(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as BranchConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for branch node" };
  }

  try {
    const branchCount = Math.min(config.branch_count || 2, 4); // Maximum 4 branches
    const distributionMode = config.distribution_mode || 'copy';

    const outputs: BranchOutputs = {
      branch1: undefined,
      branch2: undefined,
      branch3: undefined,
      branch4: undefined,
    };

    switch (distributionMode) {
      case 'copy':
        // Copy input to all active branches
        for (let i = 1; i <= branchCount; i++) {
          outputs[`branch${i}` as keyof BranchOutputs] = input;
        }
        break;
      case 'split':
        // Split array input across branches
        if (Array.isArray(input)) {
          const itemsPerBranch = Math.ceil(input.length / branchCount);
          for (let i = 1; i <= branchCount; i++) {
            const startIndex = (i - 1) * itemsPerBranch;
            const endIndex = startIndex + itemsPerBranch;
            outputs[`branch${i}` as keyof BranchOutputs] = input.slice(startIndex, endIndex);
          }
        } else {
          // If not array, just copy to first branch
          outputs.branch1 = input;
        }
        break;
      case 'round_robin':
        // For round robin, we'd need state management
        // For now, just send to first branch
        outputs.branch1 = input;
        break;
      default:
        outputs.branch1 = input;
    }

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Branch execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

