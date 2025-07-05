import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  ConnectionMode,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from '@/CommonModule/Contexts/ToastContext';

import { WorkflowNode as WFNode, WorkflowEdge, WorkflowProject, NodeStatus } from '@/WorkFlowModule/Types/workflow';
import { getNodeTemplate } from '@/WorkFlowModule/Editor/Nodes/NodeTemplates';
import WorkflowNode from './WorkflowNode';
import { WorkflowEngine } from '@/WorkFlowModule/Editor/Nodes/WorkflowEngine';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

interface WorkflowCanvasProps {
  project: WorkflowProject;
  onProjectChange: (project: WorkflowProject) => void;
  onNodeSelect: (nodeId: string | null) => void;
  selectedNodeId: string | null;
  isExecuting: boolean;
  onExecutionStart: () => void;
  onExecutionEnd: () => void;
}

function WorkflowCanvasInner({
  project,
  onProjectChange,
  onNodeSelect,
  selectedNodeId,
  isExecuting,
  onExecutionStart,
  onExecutionEnd,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const workflowEngine = WorkflowEngine.getInstance();

  // Convert workflow nodes to ReactFlow nodes
  const convertToReactFlowNodes = useCallback((workflowNodes: WFNode[]): Node[] => {
    return workflowNodes.map(node => ({
      id: node.id,
      type: 'workflowNode',
      position: node.position,
      data: {
        ...node,
        onUpdate: (updatedNode: WFNode) => {
          const updatedProject = {
            ...project,
            nodes: project.nodes.map(n => n.id === updatedNode.id ? updatedNode : n),
            updatedAt: new Date().toISOString()
          };
          onProjectChange(updatedProject);
        },
        onDelete: () => {
          const updatedProject = {
            ...project,
            nodes: project.nodes.filter(n => n.id !== node.id),
            edges: project.edges.filter(e => e.source !== node.id && e.target !== node.id),
            updatedAt: new Date().toISOString()
          };
          onProjectChange(updatedProject);
          if (selectedNodeId === node.id) {
            onNodeSelect(null);
          }
        },
        isSelected: selectedNodeId === node.id,
      },
      selected: selectedNodeId === node.id,
      draggable: true,
      selectable: true,
    }));
  }, [project, onProjectChange, selectedNodeId, onNodeSelect]);

  // Convert workflow edges to ReactFlow edges
  const convertToReactFlowEdges = useCallback((workflowEdges: WorkflowEdge[]): Edge[] => {
    return workflowEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: 'smoothstep',
      animated: isExecuting,
      style: {
        stroke: '#3b82f6',
        strokeWidth: 3,
      },
      markerEnd: {
        type: 'arrowclosed',
        color: '#3b82f6',
      },
    }));
  }, [isExecuting]);

  // Update ReactFlow nodes and edges when project changes
  useEffect(() => {
    const newNodes = convertToReactFlowNodes(project.nodes);
    const newEdges = convertToReactFlowEdges(project.edges);
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [project.nodes, project.edges, convertToReactFlowNodes, convertToReactFlowEdges, setNodes, setEdges]);

  // Handle node changes (position, selection, etc.)
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Apply changes to ReactFlow state
    onNodesChange(changes);
    
    // Update project with position changes only
    const positionChanges = changes.filter(change => 
      change.type === 'position' && 'position' in change && change.position
    );
    
    if (positionChanges.length > 0) {
      const updatedNodes = project.nodes.map(node => {
        const change = positionChanges.find(c => c.id === node.id);
        if (change && 'position' in change && change.position) {
          return { ...node, position: change.position };
        }
        return node;
      });
      
      const updatedProject = {
        ...project,
        nodes: updatedNodes,
        updatedAt: new Date().toISOString()
      };
      onProjectChange(updatedProject);
    }
  }, [onNodesChange, project, onProjectChange]);

  // Handle edge changes (deletion, etc.)
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Apply changes to ReactFlow state
    onEdgesChange(changes);
    
    // Handle edge removal
    const removedEdges = changes.filter(change => change.type === 'remove');
    if (removedEdges.length > 0) {
      const removedEdgeIds = removedEdges.map(change => change.id);
      const updatedProject = {
        ...project,
        edges: project.edges.filter(edge => !removedEdgeIds.includes(edge.id)),
        updatedAt: new Date().toISOString()
      };
      onProjectChange(updatedProject);
    }
  }, [onEdgesChange, project, onProjectChange]);

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    console.log('Connection attempt:', connection);
    
    if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
      console.warn('Invalid connection - missing required fields');
      return;
    }

    // Find source and target nodes
    const sourceNode = project.nodes.find(n => n.id === connection.source);
    const targetNode = project.nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) {
      console.warn('Source or target node not found');
      return;
    }

    // Find source output and target input
    const sourceOutput = sourceNode.outputs.find(o => o.id === connection.sourceHandle);
    const targetInput = targetNode.inputs.find(i => i.id === connection.targetHandle);

    if (!sourceOutput || !targetInput) {
      console.warn('Source output or target input not found');
      return;
    }

    // Check type compatibility
    if (sourceOutput.type !== 'any' && targetInput.type !== 'any' && sourceOutput.type !== targetInput.type) {
      console.warn(`Type mismatch: ${sourceOutput.type} -> ${targetInput.type}`);
      toast.warning("Input and Output missamatch...")
      // Still allow connection but warn user
    }

    // Check if connection already exists
    const existingConnection = project.edges.find(edge => 
      edge.source === connection.source && 
      edge.target === connection.target &&
      edge.sourceHandle === connection.sourceHandle &&
      edge.targetHandle === connection.targetHandle
    );

    if (existingConnection) {
      console.warn('Connection already exists');
      toast.warning("Connection already exists")
      return;
    }

    // Create new edge
    const newEdge: WorkflowEdge = {
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    };

    // Update target input to mark as connected
    const updatedTargetNode = {
      ...targetNode,
      inputs: targetNode.inputs.map(input => 
        input.id === connection.targetHandle 
          ? { 
              ...input, 
              connected: true, 
              sourceNodeId: connection.source,
              sourceOutputId: connection.sourceHandle 
            }
          : input
      )
    };

    // Update project with new edge and updated target node
    const updatedProject = {
      ...project,
      edges: [...project.edges, newEdge],
      nodes: project.nodes.map(node => 
        node.id === targetNode.id ? updatedTargetNode : node
      ),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating connection:', newEdge);
    onProjectChange(updatedProject);
  }, [project, onProjectChange]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    onNodeSelect(node.id);
  }, [onNodeSelect]);

  // Handle canvas click (deselect)
  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  // Handle drag over for node dropping
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node drop from sidebar
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const nodeType = event.dataTransfer.getData('application/reactflow');
    if (!nodeType || !reactFlowInstance) {
      console.warn('No node type or ReactFlow instance');
      return;
    }

    const template = getNodeTemplate(nodeType);
    if (!template) {
      console.warn('Template not found for type:', nodeType);
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: WFNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      name: template.name,
      description: template.description,
      category: template.category,
      position,
      inputs: template.inputs.map((input, index) => ({
        id: `${template.type}_input_${index}`,
        ...input,
        value: input.default,
        connected: false,
      })),
      outputs: template.outputs.map((output, index) => ({
        id: `${template.type}_output_${index}`,
        ...output,
      })),
      config: { ...template.config },
      status: 'idle',
      aiModel: template.aiModel,
    };

    const updatedProject = {
      ...project,
      nodes: [...project.nodes, newNode],
      updatedAt: new Date().toISOString()
    };

    console.log('Adding new node:', newNode);
    onProjectChange(updatedProject);
  }, [reactFlowInstance, screenToFlowPosition, project, onProjectChange]);

  // Execute workflow
  const executeWorkflow = useCallback(async () => {
    if (isExecuting) return;

    onExecutionStart();

    try {
      await workflowEngine.executeWorkflow(project, (nodeId, status, result) => {
        // Update node status in real-time
        const updatedProject = {
          ...project,
          nodes: project.nodes.map(node => 
            node.id === nodeId 
              ? { 
                  ...node, 
                  status,
                  error: result?.error,
                  lastRun: new Date().toISOString()
                }
              : node
          ),
          updatedAt: new Date().toISOString()
        };
        onProjectChange(updatedProject);
      });
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      onExecutionEnd();
    }
  }, [isExecuting, onExecutionStart, onExecutionEnd, workflowEngine, project, onProjectChange]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-50"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid={true}
        snapGrid={[20, 20]}
        deleteKeyCode={['Delete']}
        multiSelectionKeyCode={['Meta', 'Ctrl']}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
        preventScrolling={true}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background 
          color="#e2e8f0" 
          gap={20} 
          size={1}
          variant="dots"
        />
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  ▶️ Run Workflow
                </>
              )}
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

