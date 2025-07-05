import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { TextToSpeechConfig, TextToSpeechInputs, TextToSpeechOutputs } from "./Types";

export async function executeTextToSpeech(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as TextToSpeechConfig;
  const text = node.inputs.find(i => i.name === 'text')?.value;
  const voice = node.inputs.find(i => i.name === 'voice')?.value;

  if (!text) {
    return { success: false, error: "Text is required for text-to-speech node" };
  }

  try {
    const model = config.model || 'openai-tts-1';
    const selectedVoice = voice || config.voice || 'alloy';
    const speed = Math.min(Math.max(config.speed || 1.0, 0.25), 4.0); // Clamp between 0.25 and 4.0
    const format = config.format || 'mp3';

    // Validate text length
    if (text.length > 4096) {
      return { success: false, error: "Text is too long. Maximum 4096 characters allowed." };
    }

    // Mock TTS processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate estimated duration (rough estimate: 150 words per minute)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60 / speed;

    // Mock audio generation
    const audioUrl = `https://tts-api.example.com/audio/${Date.now()}.${format}`;

    const outputs: TextToSpeechOutputs = {
      audio: audioUrl,
      duration: Math.round(estimatedDuration * 100) / 100, // Round to 2 decimal places
      voice_used: selectedVoice,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Text-to-speech execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

