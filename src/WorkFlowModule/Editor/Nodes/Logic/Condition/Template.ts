import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const conditionTemplate: NodeTemplate = {
  id: "condition",
  type: "condition",
  name: "Condition",
  description: "Branch logic based on conditions",
  category: "logic",
  icon: "🔀",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input value to evaluate" },
    { name: "condition", type: "any", description: "Condition to evaluate against" },
  ],
  outputs: [
    { name: "true", type: "any", description: "Output when condition is true" },
    { name: "false", type: "any", description: "Output when condition is false" },
  ],
  config: {
    operator: "equals", // equals, not_equals, greater_than, less_than, contains, regex
    value: "",
    case_sensitive: true,
  },
};

