export type AIIntegration = 
  | 'SDXL' 
  | 'OpenAI' 
  | 'Veo' 
  | 'Whisper' 
  | 'Runway'
  | 'Stable Diffusion'
  | 'Midjourney';

export interface WorkflowProject {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: 'draft' | 'active' | 'archived';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}


export interface WorkflowNodeTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  category: 'generation' | 'processing' | 'text' | 'logic' | 'utility';
  icon: string;
  inputs: {
    name: string;
    type: 'text' | 'number' | 'select' | 'image' | 'video' | 'audio' | 'any' | 'trigger';
    required?: boolean;
    default?: any;
    options?: string[];
  }[];
  outputs: {
    name: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'trigger' | 'any';
  }[];
  aiModel?: AIIntegration; // From previous type definitions
}