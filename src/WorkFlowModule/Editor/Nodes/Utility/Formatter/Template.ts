import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const formatterTemplate: NodeTemplate = {
  id: "formatter",
  type: "formatter",
  name: "Formatter",
  description: "Format data according to specified templates or patterns",
  category: "utility",
  icon: "📋",
  inputs: [
    { name: "input", type: "any", required: true, description: "Input data to format" },
  ],
  outputs: [
    { name: "formatted", type: "any", description: "Formatted output" },
  ],
  config: {
    format_type: "template", // template, json, csv, date, number
    template: "{{input}}",
    date_format: "YYYY-MM-DD",
    number_format: "0.00",
  },
};

