import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const saveFileTemplate: NodeTemplate = {
  id: "save-file",
  type: "save-file",
  name: "Save File",
  description: "Save data to a file in various formats",
  category: "output",
  icon: "💾",
  inputs: [
    { name: "data", type: "any", required: true, description: "Data to save" },
    { name: "filename", type: "text", description: "Custom filename (optional)" },
  ],
  outputs: [
    { name: "file_path", type: "text", description: "Path to saved file" },
    { name: "success", type: "boolean", description: "Whether save was successful" },
    { name: "file_size", type: "number", description: "Size of saved file in bytes" },
  ],
  config: {
    format: "auto", // auto, json, txt, csv, png, jpg, mp4, mp3, xlsx, pdf
    directory: "downloads",
    filename_template: "output_{{timestamp}}",
    overwrite: false,
  },
};

