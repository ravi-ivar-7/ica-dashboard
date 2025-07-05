import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const webhookTemplate: NodeTemplate = {
  id: "webhook",
  type: "webhook",
  name: "Webhook",
  description: "Send data to external webhook URLs with retry logic",
  category: "output",
  icon: "📡",
  inputs: [
    { name: "data", type: "any", required: true, description: "Data to send" },
    { name: "url", type: "text", required: true, description: "Webhook URL" },
  ],
  outputs: [
    { name: "response", type: "any", description: "Webhook response" },
    { name: "success", type: "boolean", description: "Whether webhook was successful" },
    { name: "status_code", type: "number", description: "HTTP status code" },
    { name: "response_time", type: "number", description: "Response time in milliseconds" },
  ],
  config: {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
    retry_count: 3,
    retry_delay: 1000,
  },
};

