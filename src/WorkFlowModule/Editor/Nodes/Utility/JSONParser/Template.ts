import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const jsonParserTemplate: NodeTemplate = {
  id: "json-parser",
  type: "json-parser",
  name: "JSON Parser",
  description: "Parse JSON strings and extract specific values",
  category: "utility",
  icon: "🔍",
  inputs: [
    { name: "json_string", type: "text", required: true, description: "JSON string to parse" },
  ],
  outputs: [
    { name: "parsed", type: "any", description: "Parsed JSON object or extracted value" },
    { name: "is_valid", type: "boolean", description: "Whether JSON is valid" },
    { name: "error_message", type: "text", description: "Error message if parsing failed" },
  ],
  config: {
    parse_mode: "full", // full, path
    path: "", // JSONPath expression for extracting specific values
    default_value: null,
  },
};

