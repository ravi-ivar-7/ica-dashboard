export interface HttpsRequestConfig {
  method: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface HttpsRequestInputs {
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface HttpsRequestOutputs {
  response: any;
  status: number;
}

