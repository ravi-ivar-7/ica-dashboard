import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { AudioInputConfig, AudioInputOutputs } from "./Types";

export async function executeAudioInput(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as AudioInputConfig;

  // Mock audio data
  const mockAudioData = {
    url: config.url || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    format: config.formats?.[0] || 'wav',
    duration: 5
  };

  const outputs: AudioInputOutputs = {
    audio: mockAudioData,
    metadata: {
      format: mockAudioData.format,
      duration: mockAudioData.duration
    }
  };

  return {
    success: true,
    outputs: outputs
  };
}

