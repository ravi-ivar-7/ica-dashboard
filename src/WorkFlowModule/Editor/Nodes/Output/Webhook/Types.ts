export interface WebhookConfig {
  method: string;
  headers: Record<string, string>;
  timeout: number;
  retry_count: number;
  retry_delay: number;
}

export interface WebhookInputs {
  data: any;
  url: string;
}

export interface WebhookOutputs {
  response: any;
  success: boolean;
  status_code: number;
  response_time: number;
}

