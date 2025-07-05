import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const timerTemplate: NodeTemplate = {
  id: "timer",
  type: "timer",
  name: "Timer",
  description: "Generate periodic outputs at specified intervals",
  category: "utility",
  icon: "⏰",
  inputs: [
    { name: "start", type: "boolean", description: "Start the timer" },
    { name: "stop", type: "boolean", description: "Stop the timer" },
  ],
  outputs: [
    { name: "tick", type: "number", description: "Current tick count" },
    { name: "elapsed", type: "number", description: "Elapsed time in milliseconds" },
    { name: "is_running", type: "boolean", description: "Whether timer is running" },
  ],
  config: {
    interval: 1000, // milliseconds
    max_iterations: 10,
    auto_start: false,
  },
};

