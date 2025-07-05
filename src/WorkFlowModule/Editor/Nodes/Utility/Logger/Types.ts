export interface LoggerConfig {
  log_level: string;
  include_timestamp: boolean;
  include_metadata: boolean;
}

export interface LoggerInputs {
  input: any;
  message?: string;
}

export interface LoggerOutputs {
  output: any;
  log_entry: string;
}

