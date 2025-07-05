import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const filterTemplate: NodeTemplate = {
  id: "filter",
  type: "filter",
  name: "Filter",
  description: "Filter array items based on conditions",
  category: "logic",
  icon: "🔍",
  inputs: [
    { name: "array", type: "any", required: true, description: "Array to filter" },
  ],
  outputs: [
    { name: "filtered", type: "any", description: "Filtered array" },
    { name: "count", type: "number", description: "Number of items remaining" },
    { name: "removed_count", type: "number", description: "Number of items removed" },
  ],
  config: {
    filter_type: "condition", // condition, custom, truthy, falsy, unique
    condition: "equals", // equals, not_equals, greater_than, less_than, contains
    value: "",
    custom_function: "return item > 0;",
  },
};

