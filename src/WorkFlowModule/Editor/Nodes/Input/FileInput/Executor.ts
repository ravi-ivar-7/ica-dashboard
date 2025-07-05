import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { FileInputConfig, FileInputOutputs } from "./Types";

export async function executeFileInput(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as FileInputConfig;

  try {
    let fileContent: string = "";
    let fileName: string = "";
    let fileType: string = "";
    let fileSize: number = 0;

    if (config.source === "path") {
      if (!config.filePath) {
        return { success: false, error: "File path is required for 'path' source." };
      }
      // In a real scenario, you would read the file from the specified path.
      // For now, we'll mock the content and metadata.
      fileName = config.filePath.split("/").pop() || "mock_file";
      fileType = fileName.split(".").pop() || "txt";
      fileContent = `Mock content from file: ${config.filePath}`;
      fileSize = fileContent.length; // Mock size
    } else if (config.source === "upload") {
      // For 'upload' source, assume the file content is provided via context or a separate mechanism.
      // For this mock, we'll just provide a generic mock file.
      fileName = "uploaded_mock_file.txt";
      fileType = "txt";
      fileContent = "This is mock content for an uploaded file.";
      fileSize = fileContent.length;
    } else {
      return { success: false, error: "Invalid file input source specified." };
    }

    if (config.allowedTypes && !config.allowedTypes.includes(fileType)) {
      return { success: false, error: `File type '${fileType}' is not allowed.` };
    }

    const outputs: FileInputOutputs = {
      file: {
        name: fileName,
        type: fileType,
        content: fileContent,
        size: fileSize,
      },
      metadata: {
        name: fileName,
        type: fileType,
        size: fileSize,
      },
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `File input failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

