import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { ConditionConfig, ConditionInputs, ConditionOutputs } from "./Types";

export async function executeCondition(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as ConditionConfig;
  const input = node.inputs.find(i => i.name === 'input')?.value;
  const condition = node.inputs.find(i => i.name === 'condition')?.value;

  if (input === undefined) {
    return { success: false, error: "Input is required for condition node" };
  }

  try {
    const operator = config.operator || 'equals';
    const value = condition !== undefined ? condition : config.value;
    const caseSensitive = config.case_sensitive !== false;

    let result = false;

    try {
      switch (operator) {
        case 'equals':
          if (caseSensitive) {
            result = input === value;
          } else {
            result = String(input).toLowerCase() === String(value).toLowerCase();
          }
          break;
        case 'not_equals':
          if (caseSensitive) {
            result = input !== value;
          } else {
            result = String(input).toLowerCase() !== String(value).toLowerCase();
          }
          break;
        case 'greater_than':
          result = Number(input) > Number(value);
          break;
        case 'less_than':
          result = Number(input) < Number(value);
          break;
        case 'greater_equal':
          result = Number(input) >= Number(value);
          break;
        case 'less_equal':
          result = Number(input) <= Number(value);
          break;
        case 'contains':
          if (caseSensitive) {
            result = String(input).includes(String(value));
          } else {
            result = String(input).toLowerCase().includes(String(value).toLowerCase());
          }
          break;
        case 'starts_with':
          if (caseSensitive) {
            result = String(input).startsWith(String(value));
          } else {
            result = String(input).toLowerCase().startsWith(String(value).toLowerCase());
          }
          break;
        case 'ends_with':
          if (caseSensitive) {
            result = String(input).endsWith(String(value));
          } else {
            result = String(input).toLowerCase().endsWith(String(value).toLowerCase());
          }
          break;
        case 'regex':
          try {
            const regex = new RegExp(String(value), caseSensitive ? 'g' : 'gi');
            result = regex.test(String(input));
          } catch (regexError) {
            result = false;
          }
          break;
        case 'is_empty':
          result = input === null || input === undefined || String(input).trim() === '';
          break;
        case 'is_not_empty':
          result = input !== null && input !== undefined && String(input).trim() !== '';
          break;
        default:
          result = Boolean(input);
      }
    } catch (error) {
      // If comparison fails, default to false
      result = false;
    }

    const outputs: ConditionOutputs = result ? {
      true: input
    } : {
      false: input
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Condition execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

