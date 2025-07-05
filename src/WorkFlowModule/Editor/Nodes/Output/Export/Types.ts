export interface ExportConfig {
  format: string;
  compression: boolean;
  include_metadata: boolean;
  destination: string;
}

export interface ExportInputs {
  data: any;
}

export interface ExportOutputs {
  exported: any;
  download_url: string;
  export_size: number;
}

