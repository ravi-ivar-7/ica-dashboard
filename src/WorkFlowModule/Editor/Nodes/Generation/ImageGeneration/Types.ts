export interface ImageGenerationConfig {
  model: string;
  resolution: string;
  steps: number;
  guidance_scale: number;
  seed: number;
}

export interface ImageGenerationInputs {
  prompt: string;
  negative_prompt?: string;
  reference_image?: any;
}

export interface ImageGenerationOutputs {
  image: {
    url: string;
    format: string;
    width: number;
    height: number;
  };
  metadata: {
    model: string;
    prompt: string;
    seed: number;
    steps: number;
  };
}

