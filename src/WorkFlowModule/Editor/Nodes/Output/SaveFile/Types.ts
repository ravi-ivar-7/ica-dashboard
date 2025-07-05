export interface SaveFileConfig {
  format: string;
  directory: string;
  filename_template: string;
  overwrite: boolean;
}

export interface SaveFileInputs {
  data: any;
  filename?: string;
}

export interface SaveFileOutputs {
  file_path: string;
  success: boolean;
  file_size: number;
}

