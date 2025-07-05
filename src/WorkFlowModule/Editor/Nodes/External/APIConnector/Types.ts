export interface APIConnectorConfig {
  api_type: string;
  authentication: string;
  rate_limit: number;
  timeout: number;
  retry_config: {
    max_retries: number;
    backoff_strategy: string;
  };
}

export interface APIConnectorInputs {
  endpoint: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

export interface APIConnectorOutputs {
  response: any;
  status_code: number;
  headers: Record<string, string>;
  response_time: number;
  success: boolean;
}

