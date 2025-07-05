import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const mergeTemplate: NodeTemplate = {
  id: "merge",
  type: "merge",
  name: "Merge",
  description: "Combine multiple inputs into a single output",
  category: "utility",
  icon: "🔗",
  inputs: [
    { name: "input1", type: "any", description: "First input" },
    { name: "input2", type: "any", description: "Second input" },
    { name: "input3", type: "any", description: "Third input" },
  ],
  outputs: [
    { name: "merged", type: "any", description: "Merged output" },
  ],
  config: {
    merge_type: "object", // object, array, concat
    key_prefix: "",
  },
};

