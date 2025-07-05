import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { WebhookConfig, WebhookInputs, WebhookOutputs } from "./Types";

export async function executeWebhook(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as WebhookConfig;
  const data = node.inputs.find(i => i.name === 'data')?.value;
  const url = node.inputs.find(i => i.name === 'url')?.value;

  if (data === undefined) {
    return { success: false, error: "Data is required for webhook node" };
  }

  if (!url) {
    return { success: false, error: "URL is required for webhook node" };
  }

  try {
    const method = config.method || 'POST';
    const headers = config.headers || { 'Content-Type': 'application/json' };
    const timeout = Math.min(config.timeout || 30000, 60000); // Maximum 60 seconds
    const retryCount = Math.min(config.retry_count || 3, 10); // Maximum 10 retries
    const retryDelay = Math.min(config.retry_delay || 1000, 10000); // Maximum 10 seconds

    let lastError: any = null;
    let response: any = null;
    let statusCode = 0;
    let responseTime = 0;

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return { success: false, error: "Invalid URL provided" };
    }

    for (let attempt = 1; attempt <= retryCount + 1; attempt++) {
      try {
        const startTime = Date.now();

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: method,
          headers: {
            ...headers,
            'User-Agent': 'Workflow-Engine/1.0',
          },
          body: method !== 'GET' ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        responseTime = Date.now() - startTime;
        statusCode = response.status;

        let responseData: any;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
        } catch (parseError) {
          responseData = null;
        }

        if (response.ok) {
          // Success
          const outputs: WebhookOutputs = {
            response: responseData,
            success: true,
            status_code: statusCode,
            response_time: responseTime,
          };

          return {
            success: true,
            outputs: outputs,
          };
        } else {
          // HTTP error
          lastError = {
            status: response.status,
            statusText: response.statusText,
            response: responseData,
          };

          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            break;
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Network error";
        responseTime = Date.now() - Date.now(); // Reset on error
      }

      // Wait before retry (except on last attempt)
      if (attempt <= retryCount) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    // All attempts failed
    const outputs: WebhookOutputs = {
      response: lastError,
      success: false,
      status_code: statusCode,
      response_time: responseTime,
    };

    return {
      success: true, // Node executed successfully, but webhook failed
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Webhook execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

