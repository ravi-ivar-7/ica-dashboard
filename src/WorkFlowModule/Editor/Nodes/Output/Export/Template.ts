import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const exportTemplate: NodeTemplate = {
  id: "export",
  type: "export",
  name: "Export",
  description: "Export workflow results in various formats with download links",
  category: "output",
  icon: "📤",
  inputs: [
    { name: "data", type: "any", required: true, description: "Data to export" },
  ],
  outputs: [
    { name: "exported", type: "any", description: "Exported data" },
    { name: "download_url", type: "text", description: "Download URL for exported file" },
    { name: "export_size", type: "number", description: "Size of exported data" },
  ],
  config: {
    format: "json", // json, csv, xlsx, pdf, zip, xml
    compression: false,
    include_metadata: true,
    destination: "cloud", // local, cloud, email
  },
};

