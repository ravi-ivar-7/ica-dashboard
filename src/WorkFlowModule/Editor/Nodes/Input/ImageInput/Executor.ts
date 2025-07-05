import { WorkflowNode, ExecutionContext, ExecutionResult } from '@/WorkFlowModule/Types/workflow';
import { ImageInputConfig, ImageInputOutputs } from './Types';

export async function executeImageInput(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  // For now, return mock data - in production this would handle file uploads
  const mockImageData = {
    url: 'https://via.placeholder.com/512x512',
    format: 'png',
    width: 512,
    height: 512
  };

  const outputs: ImageInputOutputs = {
    image: mockImageData,
    metadata: {
      format: mockImageData.format,
      dimensions: `${mockImageData.width}x${mockImageData.height}`
    }
  };

  return {
    success: true,
    outputs: outputs
  };
}

