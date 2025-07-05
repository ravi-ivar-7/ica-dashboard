export interface SpeechToTextConfig {
  model: string;
  language: string;
  response_format: string;
}

export interface SpeechToTextInputs {
  audio: any;
}

export interface SpeechToTextOutputs {
  text: string;
  metadata: {
    model: string;
    language: string;
    confidence: number;
  };
}

