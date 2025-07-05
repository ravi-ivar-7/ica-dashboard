import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const httpsRequestTemplate: NodeTemplate = {
  id: "https-request",
  type: "https-request",
  name: "HTTPS Request",
  description: "Fetch external data via APIs",
  category: "input",
  icon: "🌐",
  inputs: [
    { name: "url", type: "text", required: true, description: "Request URL" },
    { name: "headers", type: "any", description: "Request headers" },
    { name: "body", type: "any", description: "Request body" },
  ],
  outputs: [
    { name: "response", type: "any", description: "API response" },
    { name: "status", type: "number", description: "HTTP status code" },
  ],
  config: {
    method: "GET",
    timeout: 30000,
    retries: 3,
  },
};

