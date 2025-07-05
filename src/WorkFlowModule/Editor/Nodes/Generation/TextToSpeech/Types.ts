export interface TextToSpeechConfig {
  model: string;
  voice: string;
  speed: number;
  format: string;
}

export interface TextToSpeechInputs {
  text: string;
  voice?: string;
}

export interface TextToSpeechOutputs {
  audio: string;
  duration: number;
  voice_used: string;
}

