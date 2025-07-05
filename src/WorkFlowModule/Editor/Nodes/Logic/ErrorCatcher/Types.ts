export interface ErrorCatcherConfig {
  retry_count: number;
  retry_delay: number;
  fallback_value: any;
}

export interface ErrorCatcherInputs {
  input: any;
}

export interface ErrorCatcherOutputs {
  output: any;
  error: any;
  retry_count: number;
}

