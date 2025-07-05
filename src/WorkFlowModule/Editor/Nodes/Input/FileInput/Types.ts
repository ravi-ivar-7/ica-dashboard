export interface FileInputConfig {
  source: 'upload' | 'path';
  filePath: string;
  allowedTypes: string[];
}

export interface FileInputOutputs {
  file: {
    name: string;
    type: string;
    content: string; // Base64 encoded or direct content
    size: number;
  };
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}

