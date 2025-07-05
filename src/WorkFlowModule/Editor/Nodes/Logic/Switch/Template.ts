import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const switchTemplate: NodeTemplate = {
  id: "switch",
  type: "switch",
  name: "Switch",
  description: "Route input to different outputs based on value matching",
  category: "logic",
  icon: "🔀",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input value to switch on" },
  ],
  outputs: [
    { name: "case1", type: "any", description: "Output for case 1" },
    { name: "case2", type: "any", description: "Output for case 2" },
    { name: "case3", type: "any", description: "Output for case 3" },
    { name: "default", type: "any", description: "Default output" },
  ],
  config: {
    cases: [
      { value: "value1", output_name: "case1" },
      { value: "value2", output_name: "case2" },
      { value: "value3", output_name: "case3" },
    ],
    default_output: "default",
  },
};

