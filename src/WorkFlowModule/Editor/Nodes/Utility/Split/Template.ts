import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const splitTemplate: NodeTemplate = {
  id: "split",
  type: "split",
  name: "Split",
  description: "Split input data into multiple outputs",
  category: "utility",
  icon: "✂️",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input to split" },
  ],
  outputs: [
    { name: "output1", type: "any", description: "First split output" },
    { name: "output2", type: "any", description: "Second split output" },
    { name: "output3", type: "any", description: "Third split output" },
    { name: "array", type: "any", description: "Array of all split outputs" },
  ],
  config: {
    split_type: "string", // string, array, object
    delimiter: ",",
    max_splits: 3,
  },
};

