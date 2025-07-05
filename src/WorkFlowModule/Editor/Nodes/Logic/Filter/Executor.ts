import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { FilterConfig, FilterInputs, FilterOutputs } from "./Types";

export async function executeFilter(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as FilterConfig;
  const array = node.inputs.find(i => i.name === 'array')?.value;

  if (!Array.isArray(array)) {
    return { success: false, error: "Array input is required for filter node" };
  }

  try {
    const filterType = config.filter_type || 'condition';
    const condition = config.condition || 'equals';
    const value = config.value;
    const customFunction = config.custom_function || 'return item > 0;';

    let filtered: any[];

    switch (filterType) {
      case 'condition':
        filtered = array.filter(item => {
          try {
            switch (condition) {
              case 'equals':
                return item === value;
              case 'not_equals':
                return item !== value;
              case 'greater_than':
                return Number(item) > Number(value);
              case 'less_than':
                return Number(item) < Number(value);
              case 'greater_equal':
                return Number(item) >= Number(value);
              case 'less_equal':
                return Number(item) <= Number(value);
              case 'contains':
                return String(item).includes(String(value));
              case 'starts_with':
                return String(item).startsWith(String(value));
              case 'ends_with':
                return String(item).endsWith(String(value));
              case 'is_empty':
                return item === null || item === undefined || String(item).trim() === '';
              case 'is_not_empty':
                return item !== null && item !== undefined && String(item).trim() !== '';
              default:
                return true;
            }
          } catch (error) {
            return false; // Exclude items that cause errors
          }
        });
        break;
      case 'truthy':
        filtered = array.filter(item => Boolean(item));
        break;
      case 'falsy':
        filtered = array.filter(item => !Boolean(item));
        break;
      case 'unique':
        filtered = array.filter((item, index, arr) => arr.indexOf(item) === index);
        break;
      case 'not_null':
        filtered = array.filter(item => item !== null && item !== undefined);
        break;
      case 'is_number':
        filtered = array.filter(item => typeof item === 'number' && !isNaN(item));
        break;
      case 'is_string':
        filtered = array.filter(item => typeof item === 'string');
        break;
      case 'is_array':
        filtered = array.filter(item => Array.isArray(item));
        break;
      case 'is_object':
        filtered = array.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item));
        break;
      case 'custom':
        try {
          // For security, we'll use a simple evaluation
          // In production, this should use a sandboxed environment
          filtered = array.filter(item => {
            try {
              // Simple function evaluation - very limited for security
              if (customFunction.includes('return item > 0;')) {
                return Number(item) > 0;
              } else if (customFunction.includes('return item.length > 0;')) {
                return (typeof item === 'string' || Array.isArray(item)) && item.length > 0;
              } else if (customFunction.includes('return typeof item === "string";')) {
                return typeof item === 'string';
              } else {
                return Boolean(item); // Fallback to truthy
              }
            } catch (error) {
              return false; // Exclude items that cause errors
            }
          });
        } catch (error) {
          filtered = array; // Fallback to original array
        }
        break;
      default:
        filtered = array;
    }

    const outputs: FilterOutputs = {
      filtered: filtered,
      count: filtered.length,
      removed_count: array.length - filtered.length,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Filter execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

