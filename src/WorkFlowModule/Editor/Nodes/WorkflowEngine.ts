import { WorkflowProject, WorkflowNode, WorkflowEdge, WorkflowExecution, ExecutionResult, NodeStatus } from '@/WorkFlowModule/Types/workflow';
import { NodeExecutor } from './../Nodes/NodeExecutor';

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private nodeExecutor: NodeExecutor;
  private executionCallbacks: Map<string, (nodeId: string, status: NodeStatus, result?: ExecutionResult) => void> = new Map();

  static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  constructor() {
    this.nodeExecutor = NodeExecutor.getInstance();
  }

  async executeWorkflow(
    project: WorkflowProject,
    onNodeUpdate?: (nodeId: string, status: NodeStatus, result?: ExecutionResult) => void
  ): Promise<WorkflowExecution> {
    const executionId = `exec_${Date.now()}`;
    
    if (onNodeUpdate) {
      this.executionCallbacks.set(executionId, onNodeUpdate);
    }

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: project.id,
      status: 'running',
      startTime: new Date().toISOString(),
      nodeResults: {}
    };

    try {
      // Build execution graph
      const executionGraph = this.buildExecutionGraph(project.nodes, project.edges);
      
      // Execute nodes in topological order
      await this.executeNodes(executionGraph, project.nodes, execution, onNodeUpdate);
      
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown execution error';
      execution.endTime = new Date().toISOString();
    } finally {
      this.executionCallbacks.delete(executionId);
    }

    return execution;
  }

  async executeNode(
    node: WorkflowNode,
    project: WorkflowProject,
    onNodeUpdate?: (nodeId: string, status: NodeStatus, result?: ExecutionResult) => void
  ): Promise<ExecutionResult> {
    if (onNodeUpdate) {
      onNodeUpdate(node.id, 'running');
    }

    try {
      // Prepare input values from connected nodes
      this.prepareNodeInputs(node, project);

      // Execute the node
      const result = await this.nodeExecutor.executeNode(node, {
        nodeId: node.id,
        inputs: this.getNodeInputValues(node),
        config: node.config,
        metadata: {
          workflowId: project.id,
          executionId: `single_${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      });

      // Update node outputs
      if (result.success && result.outputs) {
        this.updateNodeOutputs(node, result.outputs);
      }

      if (onNodeUpdate) {
        onNodeUpdate(node.id, result.success ? 'success' : 'error', result);
      }

      return result;
    } catch (error) {
      const errorResult: ExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error'
      };

      if (onNodeUpdate) {
        onNodeUpdate(node.id, 'error', errorResult);
      }

      return errorResult;
    }
  }

  private buildExecutionGraph(nodes: WorkflowNode[], edges: WorkflowEdge[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    // Initialize all nodes
    nodes.forEach(node => {
      graph.set(node.id, []);
    });

    // Build dependencies (which nodes depend on this node)
    edges.forEach(edge => {
      const dependencies = graph.get(edge.source) || [];
      dependencies.push(edge.target);
      graph.set(edge.source, dependencies);
    });

    return graph;
  }

  private async executeNodes(
    graph: Map<string, string[]>,
    nodes: WorkflowNode[],
    execution: WorkflowExecution,
    onNodeUpdate?: (nodeId: string, status: NodeStatus, result?: ExecutionResult) => void
  ): Promise<void> {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const completed = new Set<string>();
    const inProgress = new Set<string>();

    // Find nodes with no dependencies (starting nodes)
    const startingNodes = nodes.filter(node => {
      return !Array.from(graph.values()).some(deps => deps.includes(node.id));
    });

    // Execute starting nodes
    const executePromises = startingNodes.map(node => 
      this.executeNodeInWorkflow(node, nodeMap, graph, completed, inProgress, execution, onNodeUpdate)
    );

    await Promise.all(executePromises);
  }

  private async executeNodeInWorkflow(
    node: WorkflowNode,
    nodeMap: Map<string, WorkflowNode>,
    graph: Map<string, string[]>,
    completed: Set<string>,
    inProgress: Set<string>,
    execution: WorkflowExecution,
    onNodeUpdate?: (nodeId: string, status: NodeStatus, result?: ExecutionResult) => void
  ): Promise<void> {
    if (completed.has(node.id) || inProgress.has(node.id)) {
      return;
    }

    inProgress.add(node.id);

    if (onNodeUpdate) {
      onNodeUpdate(node.id, 'running');
    }

    try {
      // Execute the node
      const result = await this.nodeExecutor.executeNode(node, {
        nodeId: node.id,
        inputs: this.getNodeInputValues(node),
        config: node.config,
        metadata: {
          workflowId: execution.workflowId,
          executionId: execution.id,
          timestamp: new Date().toISOString()
        }
      });

      // Store result
      execution.nodeResults[node.id] = result;

      // Update node outputs
      if (result.success && result.outputs) {
        this.updateNodeOutputs(node, result.outputs);
      }

      completed.add(node.id);
      inProgress.delete(node.id);

      if (onNodeUpdate) {
        onNodeUpdate(node.id, result.success ? 'success' : 'error', result);
      }

      // Execute dependent nodes
      const dependentNodeIds = graph.get(node.id) || [];
      const dependentNodes = dependentNodeIds
        .map(id => nodeMap.get(id))
        .filter((n): n is WorkflowNode => n !== undefined);

      // Execute dependent nodes in parallel
      const dependentPromises = dependentNodes.map(dependentNode =>
        this.executeNodeInWorkflow(dependentNode, nodeMap, graph, completed, inProgress, execution, onNodeUpdate)
      );

      await Promise.all(dependentPromises);
    } catch (error) {
      const errorResult: ExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error'
      };

      execution.nodeResults[node.id] = errorResult;
      completed.add(node.id);
      inProgress.delete(node.id);

      if (onNodeUpdate) {
        onNodeUpdate(node.id, 'error', errorResult);
      }

      throw error;
    }
  }

  private prepareNodeInputs(node: WorkflowNode, project: WorkflowProject): void {
    // Find edges that connect to this node's inputs
    const incomingEdges = project.edges.filter(edge => edge.target === node.id);
    
    incomingEdges.forEach(edge => {
      const sourceNode = project.nodes.find(n => n.id === edge.source);
      if (sourceNode) {
        const sourceOutput = sourceNode.outputs.find(o => o.id === edge.sourceHandle);
        const targetInput = node.inputs.find(i => i.id === edge.targetHandle);
        
        if (sourceOutput && targetInput) {
          targetInput.value = sourceOutput.value;
          targetInput.connected = true;
          targetInput.sourceNodeId = sourceNode.id;
          targetInput.sourceOutputId = sourceOutput.id;
        }
      }
    });
  }

  private getNodeInputValues(node: WorkflowNode): Record<string, any> {
    const inputValues: Record<string, any> = {};
    
    node.inputs.forEach(input => {
      if (input.connected && input.value !== undefined) {
        inputValues[input.name] = input.value;
      } else if (input.value !== undefined) {
        inputValues[input.name] = input.value;
      } else if (input.default !== undefined) {
        inputValues[input.name] = input.default;
      }
    });

    return inputValues;
  }

  private updateNodeOutputs(node: WorkflowNode, outputs: Record<string, any>): void {
    Object.entries(outputs).forEach(([outputName, value]) => {
      const output = node.outputs.find(o => o.name === outputName);
      if (output) {
        output.value = value;
      }
    });
  }

  // Utility methods for workflow validation
  validateWorkflow(project: WorkflowProject): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for cycles
    if (this.hasCycles(project.nodes, project.edges)) {
      errors.push('Workflow contains cycles');
    }

    // Check for orphaned nodes
    const connectedNodes = new Set([
      ...project.edges.map(e => e.source),
      ...project.edges.map(e => e.target)
    ]);

    const orphanedNodes = project.nodes.filter(node => 
      !connectedNodes.has(node.id) && project.nodes.length > 1
    );

    if (orphanedNodes.length > 0) {
      errors.push(`Orphaned nodes found: ${orphanedNodes.map(n => n.name).join(', ')}`);
    }

    // Check for missing required inputs
    project.nodes.forEach(node => {
      const missingInputs = node.inputs.filter(input => 
        input.required && !input.connected && (input.value === undefined || input.value === '')
      );

      if (missingInputs.length > 0) {
        errors.push(`Node '${node.name}' missing required inputs: ${missingInputs.map(i => i.name).join(', ')}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private hasCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
    const graph = new Map<string, string[]>();
    
    // Build adjacency list
    nodes.forEach(node => graph.set(node.id, []));
    edges.forEach(edge => {
      const neighbors = graph.get(edge.source) || [];
      neighbors.push(edge.target);
      graph.set(edge.source, neighbors);
    });

    // DFS to detect cycles
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleDFS = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = graph.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycleDFS(neighbor)) {
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of graph.keys()) {
      if (!visited.has(nodeId)) {
        if (hasCycleDFS(nodeId)) {
          return true;
        }
      }
    }

    return false;
  }
}

