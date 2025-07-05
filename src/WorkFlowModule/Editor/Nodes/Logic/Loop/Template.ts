import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const loopTemplate: NodeTemplate = {
  id: "loop",
  type: "loop",
  name: "Loop",
  description: "Repeat actions over batch inputs",
  category: "logic",
  icon: "🔄",
  inputs: [
    { name: "items", type: "any", required: true, description: "Array of items to loop over" },
    { name: "template", type: "any", required: true, description: "Template for each iteration" },
  ],
  outputs: [
    { name: "results", type: "any", description: "Array of results from each iteration" },
    { name: "count", type: "number", description: "Number of iterations completed" },
    { name: "errors", type: "any", description: "Array of errors encountered" },
  ],
  config: {
    max_iterations: 100,
    parallel: false,
    break_on_error: false,
  },
};

