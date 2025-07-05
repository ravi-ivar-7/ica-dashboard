import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const variableSetterTemplate: NodeTemplate = {
  id: "variable-setter",
  type: "variable-setter",
  name: "Variable Setter",
  description: "Set workflow variables for use in other nodes",
  category: "logic",
  icon: "📝",
  inputs: [
    { name: "value", type: "any", required: true, description: "Value to store in variable" },
  ],
  outputs: [
    { name: "output", type: "any", description: "Pass-through output" },
    { name: "variable_name", type: "text", description: "Name of the set variable" },
  ],
  config: {
    variable_name: "my_variable",
    scope: "workflow", // workflow, global, session
    persist: false,
  },
};

