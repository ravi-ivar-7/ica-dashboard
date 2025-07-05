export interface ImageInputConfig {
  source: 'upload' | 'url' | 'cloud';
  url: string;
  formats: string[];
}

export interface ImageInputOutputs {
  image: {
    url: string;
    format: string;
    width: number;
    height: number;
  };
  metadata: {
    format: string;
    dimensions: string;
  };
}

