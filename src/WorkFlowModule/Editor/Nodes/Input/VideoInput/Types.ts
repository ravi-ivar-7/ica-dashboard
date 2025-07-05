export interface VideoInputConfig {
  source: 'upload' | 'url' | 'cloud';
  url: string;
  formats: string[];
}

export interface VideoInputOutputs {
  video: {
    url: string;
    format: string;
    duration: number;
    fps: number;
  };
  metadata: {
    format: string;
    duration: number;
    fps: number;
  };
}

