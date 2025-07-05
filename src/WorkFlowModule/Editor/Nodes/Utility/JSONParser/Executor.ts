import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { JSONParserConfig, JSONParserInputs, JSONParserOutputs } from "./Types";

export async function executeJSONParser(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as JSONParserConfig;
  const jsonString = node.inputs.find(i => i.name === 'json_string')?.value;

  if (!jsonString) {
    return { success: false, error: "JSON string is required for JSON parser node" };
  }

  try {
    const parseMode = config.parse_mode || 'full';
    const path = config.path || '';
    const defaultValue = config.default_value;

    let parsed: any;
    let isValid = true;
    let errorMessage: string | undefined;

    try {
      parsed = JSON.parse(jsonString);

      if (parseMode === 'path' && path) {
        // Simple path extraction (supports dot notation like "user.name")
        const pathParts = path.split('.');
        let current = parsed;
        
        for (const part of pathParts) {
          if (current && typeof current === 'object' && part in current) {
            current = current[part];
          } else {
            current = defaultValue;
            break;
          }
        }
        
        parsed = current;
      }
    } catch (error) {
      isValid = false;
      errorMessage = error instanceof Error ? error.message : "Invalid JSON";
      parsed = defaultValue;
    }

    const outputs: JSONParserOutputs = {
      parsed: parsed,
      is_valid: isValid,
      error_message: errorMessage,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `JSON parser execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

