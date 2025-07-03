// services/api/workflows.ts
import type { WorkflowProject } from "@/types/workflow";

const API_BASE_URL = '/api/workflows';

const mockWorkflows: WorkflowProject[] = [
  {
    id: 'wf1',
    name: 'AI Social Media Generator',
    thumbnail: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Automatically generates social media posts with images and captions',
    aiIntegrations: ['SDXL', 'OpenAI'],
    status: 'active',
    nodes: [
      {
        id: 'node1',
        type: 'text-generation',
        data: { prompt: 'Generate an engaging social media caption about {topic}' },
        position: { x: 100, y: 100 }
      },
      {
        id: 'node2',
        type: 'image-generation',
        data: { prompt: 'Create an eye-catching image about {topic}' },
        position: { x: 300, y: 100 }
      }
    ],
    edges: [
      { id: 'edge1', source: 'node1', target: 'node2' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['social', 'automation', 'marketing']
  },
  {
    id: 'wf2',
    name: 'Video Content Pipeline',
    thumbnail: 'https://images.pexels.com/photos/3568521/pexels-photo-3568521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Automated video creation from script to final render',
    aiIntegrations: ['Veo', 'Whisper', 'Runway'],
    status: 'active',
    nodes: [
      {
        id: 'node1',
        type: 'text-generation',
        data: { prompt: 'Generate a 30-second video script about {topic}' },
        position: { x: 100, y: 100 }
      },
      {
        id: 'node2',
        type: 'audio-generation',
        data: { voice: 'neutral' },
        position: { x: 300, y: 100 }
      },
      {
        id: 'node3',
        type: 'video-generation',
        data: { style: 'cinematic' },
        position: { x: 500, y: 100 }
      }
    ],
    edges: [
      { id: 'edge1', source: 'node1', target: 'node2' },
      { id: 'edge2', source: 'node2', target: 'node3' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['video', 'automation', 'content']
  },
  {
    id: 'wf3',
    name: 'E-commerce Product Generator',
    thumbnail: 'https://images.pexels.com/photos/3568522/pexels-photo-3568522.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Creates product images and descriptions for online stores',
    aiIntegrations: ['SDXL', 'OpenAI', 'Midjourney'],
    status: 'draft',
    nodes: [
      {
        id: 'node1',
        type: 'image-generation',
        data: { prompt: 'Professional product photo of {product}' },
        position: { x: 100, y: 100 }
      },
      {
        id: 'node2',
        type: 'text-generation',
        data: { prompt: 'Write a compelling product description for {product}' },
        position: { x: 300, y: 100 }
      }
    ],
    edges: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['ecommerce', 'products', 'automation']
  },
  {
    id: 'wf4',
    name: 'Podcast Post-Production',
    thumbnail: 'https://images.pexels.com/photos/3568523/pexels-photo-3568523.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Automatically cleans and enhances podcast audio',
    aiIntegrations: ['Whisper'],
    status: 'archived',
    nodes: [
      {
        id: 'node1',
        type: 'audio-processing',
        data: { action: 'remove-background-noise' },
        position: { x: 100, y: 100 }
      },
      {
        id: 'node2',
        type: 'audio-processing',
        data: { action: 'normalize-levels' },
        position: { x: 300, y: 100 }
      }
    ],
    edges: [
      { id: 'edge1', source: 'node1', target: 'node2' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['audio', 'podcast', 'editing']
  }
];

// Simulated API fetch
export async function getAllWorkflows(): Promise<WorkflowProject[]> {
  try {
    // Simulate real fetch with delay
    // const res = await fetch(API_BASE_URL);
    // return await res.json();

    // Simulated fallback
    return Promise.resolve(mockWorkflows);
  } catch (error) {
    console.warn('Using mock workflows due to error:', error);
    return mockWorkflows;
  }
}

export async function getWorkflowById(id: string): Promise<WorkflowProject> {
  try {
    // const res = await fetch(`${API_BASE_URL}/${id}`);
    
    // if (!res.ok) {
    //   const workflow = mockWorkflows.find(w => w.id === id);
    //   if (!workflow) throw new Error('Not found');
    //   return Promise.resolve(workflow);
    // }

    // const data = await res.json();
    // return data as WorkflowProject;

    // Simulated fetch
    const workflow = mockWorkflows.find(w => w.id === id);
    if (!workflow) throw new Error('Workflow not found');
    return Promise.resolve(workflow);

  } catch (error) {
    console.error(`Failed to fetch workflow with id: ${id}`);
    throw new Error('Workflow not found');
  }
}

export async function executeWorkflow(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate API call
    // const res = await fetch(`${API_BASE_URL}/${id}/execute`, {
    //   method: 'POST'
    // });
    // return await res.json();

    // Simulated execution
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    return {
      success: true,
      message: `Workflow ${id} executed successfully`
    };
  } catch (error) {
    console.error(`Failed to execute workflow with id: ${id}`);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Execution failed'
    };
  }
}