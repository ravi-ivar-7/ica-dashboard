export interface VideoGenerationConfig {
  model: string;
  duration: number;
  fps: number;
  resolution: string;
}

export interface VideoGenerationInputs {
  prompt: string;
  image?: any; // Starting image for video
}

export interface VideoGenerationOutputs {
  video: {
    url: string;
    format: string;
    duration: number;
    fps: number;
    resolution: string;
  };
  metadata: {
    prompt: string;
    model: string;
    duration: number;
    fps: number;
  };
}

