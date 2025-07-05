import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { TextGenerationConfig, TextGenerationInputs, TextGenerationOutputs } from "./Types";

export async function executeTextGeneration(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as TextGenerationConfig;
  const prompt = node.inputs.find(i => i.name === 'prompt')?.value;
  const contextInput = node.inputs.find(i => i.name === 'context')?.value;

  if (!prompt) {
    return { success: false, error: "Prompt is required for text generation" };
  }

  try {
    // Mock text generation - in production this would call actual AI APIs
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockGeneratedText = `Generated response to: "${prompt}"\n\nThis is a mock response that would normally come from an AI language model like ${config.model || 'GPT-4'}. ${contextInput ? `Context provided: ${contextInput}.` : ''} The response would be contextually relevant and helpful based on the input prompt.`;

    const outputs: TextGenerationOutputs = {
      text: mockGeneratedText,
      metadata: {
        prompt: prompt,
        model: config.model || 'gpt-4',
        tokens_used: Math.ceil(mockGeneratedText.length / 4), // Rough estimate
      },
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Text generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

