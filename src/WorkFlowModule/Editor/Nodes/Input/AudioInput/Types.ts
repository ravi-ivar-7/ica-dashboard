export interface AudioInputConfig {
  source: 'upload' | 'url' | 'cloud';
  url: string;
  formats: string[];
}

export interface AudioInputOutputs {
  audio: {
    url: string;
    format: string;
    duration: number;
  };
  metadata: {
    format: string;
    duration: number;
  };
}

