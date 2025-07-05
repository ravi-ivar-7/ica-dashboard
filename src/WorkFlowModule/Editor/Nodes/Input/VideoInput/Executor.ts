import { WorkflowNode, ExecutionContext, ExecutionResult } from '@/WorkFlowModule/Types/workflow';
import { VideoInputConfig, VideoInputOutputs } from './Types';

export async function executeVideoInput(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  // Mock video data
  const mockVideoData = {
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    format: 'mp4',
    duration: 30,
    fps: 24
  };

  const outputs: VideoInputOutputs = {
    video: mockVideoData,
    metadata: {
      format: mockVideoData.format,
      duration: mockVideoData.duration,
      fps: mockVideoData.fps
    }
  };

  return {
    success: true,
    outputs: outputs
  };
}

