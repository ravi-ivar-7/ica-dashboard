import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const apiConnectorTemplate: NodeTemplate = {
  id: "api-connector",
  type: "api-connector",
  name: "API Connector",
  description: "Connect to external APIs with authentication and retry logic",
  category: "external",
  icon: "🔌",
  inputs: [
    { name: "endpoint", type: "text", required: true, description: "API endpoint URL" },
    { name: "method", type: "text", required: true, description: "HTTP method (GET, POST, PUT, DELETE)" },
    { name: "headers", type: "any", description: "Request headers" },
    { name: "body", type: "any", description: "Request body" },
    { name: "params", type: "any", description: "Query parameters" },
  ],
  outputs: [
    { name: "response", type: "any", description: "API response data" },
    { name: "status_code", type: "number", description: "HTTP status code" },
    { name: "headers", type: "any", description: "Response headers" },
    { name: "response_time", type: "number", description: "Response time in milliseconds" },
    { name: "success", type: "boolean", description: "Whether request was successful" },
  ],
  config: {
    api_type: "rest", // rest, graphql, soap
    authentication: "none", // none, bearer, basic, api_key, oauth
    rate_limit: 100, // requests per minute
    timeout: 30000, // milliseconds
    retry_config: {
      max_retries: 3,
      backoff_strategy: "exponential", // linear, exponential, fixed
    },
  },
};

