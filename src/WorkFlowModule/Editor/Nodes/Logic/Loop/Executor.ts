import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { LoopConfig, LoopInputs, LoopOutputs } from "./Types";

export async function executeLoop(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as LoopConfig;
  const items = node.inputs.find(i => i.name === 'items')?.value;
  const template = node.inputs.find(i => i.name === 'template')?.value;

  if (!Array.isArray(items)) {
    return { success: false, error: "Items input must be an array for loop node" };
  }

  if (template === undefined) {
    return { success: false, error: "Template is required for loop node" };
  }

  try {
    const maxIterations = Math.min(config.max_iterations || 100, 1000); // Maximum 1000 iterations
    const parallel = config.parallel === true;
    const breakOnError = config.break_on_error === true;

    const results: any[] = [];
    const errors: any[] = [];
    const itemsToProcess = items.slice(0, maxIterations);

    if (parallel) {
      // Process items in parallel
      const promises = itemsToProcess.map(async (item, index) => {
        try {
          // In a real implementation, this would execute the template with the item
          const result = {
            index: index,
            item: item,
            result: `Processed item ${index}: ${JSON.stringify(item)}`,
            template: template,
          };
          return { success: true, result };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error",
            index 
          };
        }
      });

      const promiseResults = await Promise.allSettled(promises);
      
      promiseResults.forEach((promiseResult, index) => {
        if (promiseResult.status === 'fulfilled') {
          if (promiseResult.value.success) {
            results.push(promiseResult.value.result);
          } else {
            errors.push({
              index: promiseResult.value.index,
              error: promiseResult.value.error,
            });
          }
        } else {
          errors.push({
            index: index,
            error: promiseResult.reason,
          });
        }
      });
    } else {
      // Process items sequentially
      for (let i = 0; i < itemsToProcess.length; i++) {
        try {
          const item = itemsToProcess[i];
          
          // In a real implementation, this would execute the template with the item
          const result = {
            index: i,
            item: item,
            result: `Processed item ${i}: ${JSON.stringify(item)}`,
            template: template,
          };
          
          results.push(result);
          
          // Small delay to prevent overwhelming the system
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        } catch (error) {
          const errorInfo = {
            index: i,
            error: error instanceof Error ? error.message : "Unknown error",
          };
          errors.push(errorInfo);
          
          if (breakOnError) {
            break;
          }
        }
      }
    }

    const outputs: LoopOutputs = {
      results: results,
      count: results.length,
      errors: errors,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Loop execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

