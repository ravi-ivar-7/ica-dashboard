import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { APIConnectorConfig, APIConnectorInputs, APIConnectorOutputs } from "./Types";

export async function executeAPIConnector(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as APIConnectorConfig;
  const endpoint = node.inputs.find(i => i.name === 'endpoint')?.value;
  const method = node.inputs.find(i => i.name === 'method')?.value;
  const headers = node.inputs.find(i => i.name === 'headers')?.value || {};
  const body = node.inputs.find(i => i.name === 'body')?.value;
  const params = node.inputs.find(i => i.name === 'params')?.value || {};

  if (!endpoint) {
    return { success: false, error: "Endpoint is required for API connector node" };
  }

  if (!method) {
    return { success: false, error: "Method is required for API connector node" };
  }

  try {
    const apiType = config.api_type || 'rest';
    const authentication = config.authentication || 'none';
    const rateLimit = config.rate_limit || 100;
    const timeout = Math.min(config.timeout || 30000, 120000); // Maximum 2 minutes
    const retryConfig = config.retry_config || { max_retries: 3, backoff_strategy: 'exponential' };

    // Validate URL
    let url: URL;
    try {
      url = new URL(endpoint);
    } catch (error) {
      return { success: false, error: "Invalid endpoint URL provided" };
    }

    // Add query parameters
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'User-Agent': 'Workflow-API-Connector/1.0',
      ...headers,
    };

    // Add authentication headers
    switch (authentication) {
      case 'bearer':
        if (context.auth?.token) {
          requestHeaders['Authorization'] = `Bearer ${context.auth.token}`;
        }
        break;
      case 'basic':
        if (context.auth?.username && context.auth?.password) {
          const credentials = btoa(`${context.auth.username}:${context.auth.password}`);
          requestHeaders['Authorization'] = `Basic ${credentials}`;
        }
        break;
      case 'api_key':
        if (context.auth?.apiKey) {
          requestHeaders['X-API-Key'] = context.auth.apiKey;
        }
        break;
    }

    // Prepare request body
    let requestBody: string | undefined;
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      if (typeof body === 'object') {
        requestHeaders['Content-Type'] = requestHeaders['Content-Type'] || 'application/json';
        requestBody = JSON.stringify(body);
      } else {
        requestBody = String(body);
      }
    }

    let lastError: any = null;
    let response: any = null;
    let statusCode = 0;
    let responseHeaders: Record<string, string> = {};
    let responseTime = 0;

    // Retry logic
    for (let attempt = 1; attempt <= retryConfig.max_retries + 1; attempt++) {
      try {
        const startTime = Date.now();

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchResponse = await fetch(url.toString(), {
          method: method.toUpperCase(),
          headers: requestHeaders,
          body: requestBody,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        responseTime = Date.now() - startTime;
        statusCode = fetchResponse.status;

        // Extract response headers
        responseHeaders = {};
        fetchResponse.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // Parse response body
        let responseData: any;
        try {
          const contentType = fetchResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            responseData = await fetchResponse.json();
          } else {
            responseData = await fetchResponse.text();
          }
        } catch (parseError) {
          responseData = null;
        }

        if (fetchResponse.ok) {
          // Success
          const outputs: APIConnectorOutputs = {
            response: responseData,
            status_code: statusCode,
            headers: responseHeaders,
            response_time: responseTime,
            success: true,
          };

          return {
            success: true,
            outputs: outputs,
          };
        } else {
          // HTTP error
          lastError = {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            response: responseData,
          };

          // Don't retry on client errors (4xx) except 429 (rate limit)
          if (fetchResponse.status >= 400 && fetchResponse.status < 500 && fetchResponse.status !== 429) {
            break;
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Network error";
        responseTime = Date.now() - Date.now(); // Reset on error
      }

      // Calculate backoff delay for retry
      if (attempt <= retryConfig.max_retries) {
        let delay = 1000; // Base delay of 1 second

        switch (retryConfig.backoff_strategy) {
          case 'linear':
            delay = attempt * 1000;
            break;
          case 'exponential':
            delay = Math.pow(2, attempt - 1) * 1000;
            break;
          case 'fixed':
          default:
            delay = 1000;
            break;
        }

        // Cap maximum delay at 30 seconds
        delay = Math.min(delay, 30000);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All attempts failed
    const outputs: APIConnectorOutputs = {
      response: lastError,
      status_code: statusCode,
      headers: responseHeaders,
      response_time: responseTime,
      success: false,
    };

    return {
      success: true, // Node executed successfully, but API call failed
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `API connector execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

