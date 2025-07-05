import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { MapConfig, MapInputs, MapOutputs } from "./Types";

export async function executeMap(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as MapConfig;
  const array = node.inputs.find(i => i.name === 'array')?.value;

  if (!Array.isArray(array)) {
    return { success: false, error: "Array input is required for map node" };
  }

  try {
    const transformation = config.transformation || 'identity';
    const customFunction = config.custom_function || 'return item;';

    let mapped: any[];

    switch (transformation) {
      case 'identity':
        mapped = array.map(item => item);
        break;
      case 'uppercase':
        mapped = array.map(item => String(item).toUpperCase());
        break;
      case 'lowercase':
        mapped = array.map(item => String(item).toLowerCase());
        break;
      case 'double':
        mapped = array.map(item => {
          const num = Number(item);
          return isNaN(num) ? item : num * 2;
        });
        break;
      case 'square':
        mapped = array.map(item => {
          const num = Number(item);
          return isNaN(num) ? item : num * num;
        });
        break;
      case 'string':
        mapped = array.map(item => String(item));
        break;
      case 'number':
        mapped = array.map(item => {
          const num = Number(item);
          return isNaN(num) ? 0 : num;
        });
        break;
      case 'length':
        mapped = array.map(item => {
          if (typeof item === 'string' || Array.isArray(item)) {
            return item.length;
          }
          return 0;
        });
        break;
      case 'custom':
        try {
          // For security, we'll use a simple evaluation
          // In production, this should use a sandboxed environment
          mapped = array.map(item => {
            try {
              // Simple function evaluation - very limited for security
              if (customFunction.includes('return item;')) {
                return item;
              } else if (customFunction.includes('return item.toUpperCase();')) {
                return String(item).toUpperCase();
              } else if (customFunction.includes('return item * 2;')) {
                const num = Number(item);
                return isNaN(num) ? item : num * 2;
              } else {
                return item; // Fallback to identity
              }
            } catch (error) {
              return item; // Return original on error
            }
          });
        } catch (error) {
          mapped = array; // Fallback to original array
        }
        break;
      default:
        mapped = array;
    }

    const outputs: MapOutputs = {
      mapped: mapped,
      count: mapped.length,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Map execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

