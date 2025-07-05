import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { SaveFileConfig, SaveFileInputs, SaveFileOutputs } from "./Types";

export async function executeSaveFile(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as SaveFileConfig;
  const data = node.inputs.find(i => i.name === 'data')?.value;
  const customFilename = node.inputs.find(i => i.name === 'filename')?.value;

  if (data === undefined) {
    return { success: false, error: "Data is required for save file node" };
  }

  try {
    const format = config.format || 'auto';
    const directory = config.directory || 'downloads';
    const filenameTemplate = config.filename_template || 'output_{{timestamp}}';
    const overwrite = config.overwrite !== false;

    // Generate filename
    let filename = customFilename || filenameTemplate;
    filename = filename.replace('{{timestamp}}', Date.now().toString());
    filename = filename.replace('{{date}}', new Date().toISOString().split('T')[0]);
    filename = filename.replace('{{time}}', new Date().toTimeString().split(' ')[0].replace(/:/g, '-'));

    // Determine file extension based on format and data type
    let extension = '';
    let processedData: string | Buffer;

    if (format === 'auto') {
      // Auto-detect format based on data type
      if (typeof data === 'string') {
        extension = '.txt';
        processedData = data;
      } else if (typeof data === 'object') {
        extension = '.json';
        processedData = JSON.stringify(data, null, 2);
      } else {
        extension = '.txt';
        processedData = String(data);
      }
    } else {
      switch (format) {
        case 'json':
          extension = '.json';
          processedData = JSON.stringify(data, null, 2);
          break;
        case 'txt':
          extension = '.txt';
          processedData = String(data);
          break;
        case 'csv':
          extension = '.csv';
          if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]);
            const csvRows = [
              headers.join(','),
              ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
            ];
            processedData = csvRows.join('\n');
          } else {
            processedData = String(data);
          }
          break;
        case 'xml':
          extension = '.xml';
          // Simple XML conversion
          if (typeof data === 'object') {
            processedData = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${JSON.stringify(data, null, 2)}\n</root>`;
          } else {
            processedData = `<?xml version="1.0" encoding="UTF-8"?>\n<root>${String(data)}</root>`;
          }
          break;
        default:
          extension = '.txt';
          processedData = String(data);
      }
    }

    // Add extension if not present
    if (!filename.includes('.')) {
      filename += extension;
    }

    // Construct full file path
    const filePath = `/${directory}/${filename}`;

    // Mock file save operation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calculate mock file size
    const fileSize = new Blob([processedData]).size;

    const outputs: SaveFileOutputs = {
      file_path: filePath,
      success: true,
      file_size: fileSize,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Save file execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

