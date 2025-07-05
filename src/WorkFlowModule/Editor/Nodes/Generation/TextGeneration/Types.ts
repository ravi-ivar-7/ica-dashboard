export interface TextGenerationConfig {
  model: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
}

export interface TextGenerationInputs {
  prompt: string;
  context?: string;
}

export interface TextGenerationOutputs {
  text: string;
  metadata: {
    prompt: string;
    model: string;
    tokens_used: number;
  };
}

