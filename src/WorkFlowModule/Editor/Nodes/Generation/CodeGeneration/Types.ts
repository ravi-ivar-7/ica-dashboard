export interface CodeGenerationConfig {
  model: string;
  language: string;
  max_tokens: number;
}

export interface CodeGenerationInputs {
  prompt: string;
  context?: string;
}

export interface CodeGenerationOutputs {
  code: string;
  metadata: {
    model: string;
    language: string;
    tokens_used: number;
  };
}

