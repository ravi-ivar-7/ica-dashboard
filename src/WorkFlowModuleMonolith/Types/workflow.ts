export type AIIntegration = 
  | 'SDXL' 
  | 'OpenAI' 
  | 'Veo' 
  | 'Whisper' 
  | 'Runway'
  | 'Stable Diffusion'
  | 'Midjourney';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type NodeCategory = 'input' | 'generation' | 'utility' | 'output' | 'logic';

export type DataType = 'text' | 'image' | 'video' | 'audio' | 'number' | 'boolean' | 'any' | 'trigger';

export interface NodeInput {
  id: string;
  name: string;
  type: DataType;
  required?: boolean;
  default?: any;
  options?: string[];
  description?: string;
  value?: any;
  connected?: boolean;
  sourceNodeId?: string;
  sourceOutputId?: string;
}

export interface NodeOutput {
  id: string;
  name: string;
  type: DataType;
  description?: string;
  value?: any;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description?: string;
  category: NodeCategory;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  inputs: NodeInput[];
  outputs: NodeOutput[];
  config: Record<string, any>;
  status: NodeStatus;
  error?: string;
  lastRun?: string;
  minimized?: boolean;
  aiModel?: AIIntegration;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: string;
}

export interface WorkflowProject {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  status: 'draft' | 'active' | 'archived';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface NodeTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  category: NodeCategory;
  icon: string;
  inputs: Omit<NodeInput, 'id' | 'value' | 'connected' | 'sourceNodeId' | 'sourceOutputId'>[];
  outputs: Omit<NodeOutput, 'id' | 'value'>[];
  config?: Record<string, any>;
  aiModel?: AIIntegration;
  requiresAuth?: boolean;
  authProvider?: string;
}

export interface ExecutionContext {
  nodeId: string;
  inputs: Record<string, any>;
  config: Record<string, any>;
  metadata: {
    workflowId: string;
    executionId: string;
    timestamp: string;
  };
}

export interface ExecutionResult {
  success: boolean;
  outputs?: Record<string, any>;
  error?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  nodeResults: Record<string, ExecutionResult>;
  error?: string;
}

// Canvas and UI types
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface PanelState {
  leftPanel: boolean;
  rightPanel: boolean;
  selectedNodeId?: string;
}

export interface WorkflowEditorState {
  project: WorkflowProject;
  viewport: CanvasViewport;
  panels: PanelState;
  execution?: WorkflowExecution;
  history: WorkflowProject[];
  historyIndex: number;
  isDirty: boolean;
}

