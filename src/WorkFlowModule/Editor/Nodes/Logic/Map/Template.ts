import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const mapTemplate: NodeTemplate = {
  id: "map",
  type: "map",
  name: "Map",
  description: "Transform each item in an array using a function",
  category: "logic",
  icon: "🗺️",
  inputs: [
    { name: "array", type: "any", required: true, description: "Array to transform" },
  ],
  outputs: [
    { name: "mapped", type: "any", description: "Transformed array" },
    { name: "count", type: "number", description: "Number of items processed" },
  ],
  config: {
    transformation: "identity", // identity, uppercase, lowercase, double, square, custom
    custom_function: "return item;",
  },
};

