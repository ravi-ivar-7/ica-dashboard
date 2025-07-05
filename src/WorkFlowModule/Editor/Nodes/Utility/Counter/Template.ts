import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const counterTemplate: NodeTemplate = {
  id: "counter",
  type: "counter",
  name: "Counter",
  description: "Maintain and manipulate a numeric counter",
  category: "utility",
  icon: "🔢",
  inputs: [
    { name: "increment", type: "boolean", description: "Increment the counter" },
    { name: "decrement", type: "boolean", description: "Decrement the counter" },
    { name: "reset", type: "boolean", description: "Reset the counter" },
  ],
  outputs: [
    { name: "count", type: "number", description: "Current counter value" },
    { name: "is_max", type: "boolean", description: "Whether counter has reached max value" },
  ],
  config: {
    initial_value: 0,
    increment: 1,
    max_value: 100,
    reset_on_max: false,
  },
};

