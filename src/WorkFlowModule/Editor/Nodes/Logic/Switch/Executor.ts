import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { SwitchConfig, SwitchInputs, SwitchOutputs } from "./Types";

export async function executeSwitch(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as SwitchConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for switch node" };
  }

  try {
    const cases = config.cases || [];
    const defaultOutput = config.default_output || 'default';

    let matchedOutput: string | null = null;

    // Find matching case
    for (const caseItem of cases) {
      if (caseItem.value === input) {
        matchedOutput = caseItem.output_name;
        break;
      }
    }

    // If no match found, use default
    if (!matchedOutput) {
      matchedOutput = defaultOutput;
    }

    const outputs: SwitchOutputs = {
      [matchedOutput]: input
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Switch execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

