import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { HttpsRequestConfig, HttpsRequestInputs, HttpsRequestOutputs } from "./Types";

export async function executeHttpsRequest(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as HttpsRequestConfig;
  const inputs = context.inputs as HttpsRequestInputs;

  const url = inputs.url || config.url;
  const method = config.method || "GET";
  const headers = inputs.headers || config.headers || {};
  const body = inputs.body;

  if (!url) {
    return {
      success: false,
      error: "URL is required for HTTPS Request",
    };
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    const outputs: HttpsRequestOutputs = {
      response: data,
      status: response.status,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `HTTP request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

