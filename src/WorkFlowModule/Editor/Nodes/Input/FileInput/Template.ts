import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const fileInputTemplate: NodeTemplate = {
  id: "file-input",
  type: "file-input",
  name: "File Input",
  description: "Ingest files into the workflow",
  category: "input",
  icon: "📁",
  inputs: [],
  outputs: [
    { name: "file", type: "any", description: "Output file content" },
    { name: "metadata", type: "any", description: "File metadata" },
  ],
  config: {
    source: "upload", // upload, path
    filePath: "",
    allowedTypes: ["txt", "pdf", "csv", "json", "xml"],
  },
};

