import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const branchTemplate: NodeTemplate = {
  id: "branch",
  type: "branch",
  name: "Branch",
  description: "Split input into multiple parallel branches",
  category: "logic",
  icon: "🌿",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input to branch" },
  ],
  outputs: [
    { name: "branch1", type: "any", description: "Branch 1 output" },
    { name: "branch2", type: "any", description: "Branch 2 output" },
    { name: "branch3", type: "any", description: "Branch 3 output" },
    { name: "branch4", type: "any", description: "Branch 4 output" },
  ],
  config: {
    branch_count: 2,
    distribution_mode: "copy", // copy, split, round_robin
  },
};

