import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const delayTemplate: NodeTemplate = {
  id: "delay",
  type: "delay",
  name: "Delay",
  description: "Introduce a wait before the next step",
  category: "utility",
  icon: "⏱️",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input to pass through after delay" },
  ],
  outputs: [
    { name: "output", type: "any", description: "Output after delay" },
  ],
  config: {
    duration: 1000, // milliseconds
    unit: "ms", // ms, s, m
  },
};

