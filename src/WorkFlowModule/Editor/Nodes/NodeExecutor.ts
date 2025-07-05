import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { NodeExecutors } from "./index";

export class NodeExecutor {
  private static instance: NodeExecutor;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): NodeExecutor {
    if (!NodeExecutor.instance) {
      NodeExecutor.instance = new NodeExecutor();
    }
    return NodeExecutor.instance;
  }

  public async execute(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    try {
      const executor = NodeExecutors[node.type];
      
      if (!executor) {
        return {
          success: false,
          error: `No executor found for node type: ${node.type}`,
        };
      }

      try {
        const result = await executor(node, context);
        return result;
      } catch (error) {
        return {
          success: false,
          error: `Node execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `NodeExecutor error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  public async executeNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    return this.execute(node, context);
  }

  public getAvailableNodeTypes(): string[] {
    return Object.keys(NodeExecutors);
  }

  public hasExecutor(nodeType: string): boolean {
    return nodeType in NodeExecutors;
  }
}