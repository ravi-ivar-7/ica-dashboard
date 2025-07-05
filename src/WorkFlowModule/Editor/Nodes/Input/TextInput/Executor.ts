import { WorkflowNode, ExecutionContext, ExecutionResult } from '@/WorkFlowModule/Types/workflow';
import { TextInputConfig, TextInputOutputs } from './Types';

export async function executeTextInput(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as TextInputConfig;
  const text = config.text || '';
  
  const outputs: TextInputOutputs = {
    text: text
  };

  return {
    success: true,
    outputs: outputs
  };
}

