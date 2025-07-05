export interface AudioEnhancementConfig {
  model: string;
  enhancement_type: string;
}

export interface AudioEnhancementInputs {
  audio: any;
}

export interface AudioEnhancementOutputs {
  audio: {
    url: string;
    format: string;
    duration: number;
  };
  metadata: {
    model: string;
    enhancement_type: string;
  };
}

