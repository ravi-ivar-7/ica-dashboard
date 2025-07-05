import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const errorCatcherTemplate: NodeTemplate = {
  id: "error-catcher",
  type: "error-catcher",
  name: "Error Catcher",
  description: "Catch and handle errors from upstream nodes",
  category: "logic",
  icon: "🛡️",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input that might contain errors" },
  ],
  outputs: [
    { name: "output", type: "any", description: "Successful output or fallback value" },
    { name: "error", type: "any", description: "Error information if caught" },
    { name: "retry_count", type: "number", description: "Number of retries attempted" },
  ],
  config: {
    retry_count: 3,
    retry_delay: 1000, // milliseconds
    fallback_value: null,
  },
};

