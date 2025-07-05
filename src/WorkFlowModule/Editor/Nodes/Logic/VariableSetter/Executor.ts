import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { VariableSetterConfig, VariableSetterInputs, VariableSetterOutputs } from "./Types";

export async function executeVariableSetter(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as VariableSetterConfig;
  const value = node.inputs.find(i => i.name === 'value')?.value;

  if (value === undefined) {
    return { success: false, error: "Value is required for variable setter node" };
  }

  try {
    const variableName = config.variable_name || 'my_variable';
    const scope = config.scope || 'workflow';
    const persist = config.persist === true;

    // Store variable in context (in a real implementation)
    if (context.variables) {
      context.variables[variableName] = {
        value: value,
        scope: scope,
        persist: persist,
        timestamp: Date.now(),
      };
    }

    const outputs: VariableSetterOutputs = {
      output: value, // Pass through the value
      variable_name: variableName,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Variable setter execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

