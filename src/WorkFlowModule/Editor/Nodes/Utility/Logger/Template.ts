import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const loggerTemplate: NodeTemplate = {
  id: "logger",
  type: "logger",
  name: "Logger",
  description: "Log data for debugging and monitoring purposes",
  category: "utility",
  icon: "📝",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input data to log" },
    { name: "message", type: "text", description: "Optional log message" },
  ],
  outputs: [
    { name: "output", type: "any", description: "Pass-through output" },
    { name: "log_entry", type: "text", description: "Generated log entry" },
  ],
  config: {
    log_level: "info", // debug, info, warn, error
    include_timestamp: true,
    include_metadata: false,
  },
};

