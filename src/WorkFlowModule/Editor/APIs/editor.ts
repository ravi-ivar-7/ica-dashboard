import type { WorkflowNodeTemplate } from '@/WorkFlowModule/Types/workflow';

const fallbackTemplates: WorkflowNodeTemplate[] = [
  // 🖼️ Image Generation Nodes
  {
    id: 'img-gen-sdxl',
    type: 'image-generation',
    name: 'SDXL Image Generator',
    description: 'Generate high-quality images using Stable Diffusion XL',
    category: 'generation',
    icon: 'image',
    inputs: [
      { name: 'prompt', type: 'text', required: true },
      { name: 'negative_prompt', type: 'text', required: false },
      { name: 'width', type: 'number', default: 1024 },
      { name: 'height', type: 'number', default: 1024 }
    ],
    outputs: [{ name: 'image', type: 'image' }],
    aiModel: 'SDXL'
  },
  {
    id: 'img-gen-midjourney',
    type: 'image-generation',
    name: 'Midjourney Style',
    description: 'Create artistic images in Midjourney style',
    category: 'generation',
    icon: 'palette',
    inputs: [
      { name: 'prompt', type: 'text', required: true },
      { name: 'style', type: 'select', options: ['vivid', 'natural', 'abstract'], default: 'vivid' }
    ],
    outputs: [{ name: 'image', type: 'image' }],
    aiModel: 'Midjourney'
  },

  // 📝 Text Processing Nodes
  {
    id: 'text-gen-gpt4',
    type: 'text-generation',
    name: 'GPT-4 Text Generator',
    description: 'Generate human-like text using OpenAI GPT-4',
    category: 'text',
    icon: 'text',
    inputs: [
      { name: 'prompt', type: 'text', required: true },
      { name: 'max_tokens', type: 'number', default: 500 }
    ],
    outputs: [{ name: 'text', type: 'text' }],
    aiModel: 'OpenAI'
  },
  {
    id: 'text-summarize',
    type: 'text-processing',
    name: 'Text Summarizer',
    description: 'Summarize long text into key points',
    category: 'text',
    icon: 'file-text',
    inputs: [
      { name: 'content', type: 'text', required: true },
      { name: 'length', type: 'select', options: ['short', 'medium', 'long'], default: 'medium' }
    ],
    outputs: [{ name: 'summary', type: 'text' }],
    aiModel: 'OpenAI'
  },

  // 🎥 Video Nodes
  {
    id: 'video-gen-veo',
    type: 'video-generation',
    name: 'Veo Video Generator',
    description: 'Create short videos from text prompts',
    category: 'generation',
    icon: 'video',
    inputs: [
      { name: 'prompt', type: 'text', required: true },
      { name: 'duration', type: 'number', default: 5 }
    ],
    outputs: [{ name: 'video', type: 'video' }],
    aiModel: 'Veo'
  },
  {
    id: 'video-upscale',
    type: 'video-processing',
    name: '4K Upscaler',
    description: 'Enhance video resolution to 4K',
    category: 'processing',
    icon: 'zoom-in',
    inputs: [
      { name: 'video', type: 'video', required: true },
      { name: 'quality', type: 'select', options: ['high', 'medium', 'low'], default: 'high' }
    ],
    outputs: [{ name: 'video', type: 'video' }],
    aiModel: 'Runway'
  },

  // 🔊 Audio Nodes
  {
    id: 'audio-gen-whisper',
    type: 'audio-generation',
    name: 'Voice Clone',
    description: 'Generate realistic voice from text',
    category: 'generation',
    icon: 'mic',
    inputs: [
      { name: 'text', type: 'text', required: true },
      { name: 'voice', type: 'select', options: ['male', 'female', 'neutral'], default: 'neutral' }
    ],
    outputs: [{ name: 'audio', type: 'audio' }],
    aiModel: 'Whisper'
  },
  {
    id: 'audio-transcribe',
    type: 'audio-processing',
    name: 'Audio Transcriber',
    description: 'Convert speech to text',
    category: 'processing',
    icon: 'type',
    inputs: [
      { name: 'audio', type: 'audio', required: true },
      { name: 'language', type: 'select', options: ['en', 'es', 'fr', 'de'], default: 'en' }
    ],
    outputs: [{ name: 'text', type: 'text' }],
    aiModel: 'Whisper'
  },

  // 🔄 Utility Nodes
  {
    id: 'condition',
    type: 'logic',
    name: 'Condition',
    description: 'Branch workflow based on conditions',
    category: 'logic',
    icon: 'code',
    inputs: [
      { name: 'value', type: 'any', required: true },
      { name: 'operator', type: 'select', options: ['equals', 'contains', 'greater-than'], default: 'equals' },
      { name: 'compare_to', type: 'any', required: true }
    ],
    outputs: [
      { name: 'true_path', type: 'trigger' },
      { name: 'false_path', type: 'trigger' }
    ]
  },
  {
    id: 'delay',
    type: 'utility',
    name: 'Delay',
    description: 'Pause workflow for specified time',
    category: 'utility',
    icon: 'clock',
    inputs: [
      { name: 'duration', type: 'number', default: 5, required: true }
    ],
    outputs: [{ name: 'output', type: 'trigger' }]
  }
];

export const getNodeTemplates = async (): Promise<WorkflowNodeTemplate[]> => {
  try {
    const res = await fetch('/api/workflow-templates');
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();

    // If empty or invalid, return fallback
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[Workflow API] No templates returned, using fallback.');
      return fallbackTemplates;
    }

    return data;
  } catch (err) {
    console.error('[Workflow API] Error fetching templates:', err);
    return fallbackTemplates;
  }
};

export const executeWorkflow = async (workflowId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch(`/api/workflows/${workflowId}/execute`, {
      method: 'POST'
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Execution failed');
    }

    return await res.json();
  } catch (err) {
    console.error('[Workflow API] Error executing workflow:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to execute workflow'
    };
  }
};