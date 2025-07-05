import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

export const NODE_TEMPLATES: NodeTemplate[] = [
  // Input Nodes
  {
    id: 'text-input',
    type: 'text-input',
    name: 'Text Input',
    description: 'Accept user or system-provided text for further processing',
    category: 'input',
    icon: '📝',
    inputs: [],
    outputs: [
      { name: 'text', type: 'text', description: 'Output text content' }
    ],
    config: {
      text: '',
      placeholder: 'Enter your text here...'
    }
  },
  {
    id: 'image-input',
    type: 'image-input',
    name: 'Image Input',
    description: 'Ingest images into the workflow',
    category: 'input',
    icon: '🖼️',
    inputs: [],
    outputs: [
      { name: 'image', type: 'image', description: 'Output image' },
      { name: 'metadata', type: 'any', description: 'Image metadata' }
    ],
    config: {
      source: 'upload', // upload, url, cloud
      url: '',
      formats: ['jpg', 'png', 'webp']
    }
  },
  {
    id: 'video-input',
    type: 'video-input',
    name: 'Video Input',
    description: 'Import video clips for analysis or editing',
    category: 'input',
    icon: '🎥',
    inputs: [],
    outputs: [
      { name: 'video', type: 'video', description: 'Output video' },
      { name: 'metadata', type: 'any', description: 'Video metadata' }
    ],
    config: {
      source: 'upload',
      url: '',
      formats: ['mp4', 'mov', 'webm']
    }
  },
  {
    id: 'audio-input',
    type: 'audio-input',
    name: 'Audio Input',
    description: 'Accept audio files or streams for transcription or enhancement',
    category: 'input',
    icon: '🎵',
    inputs: [],
    outputs: [
      { name: 'audio', type: 'audio', description: 'Output audio' },
      { name: 'metadata', type: 'any', description: 'Audio metadata' }
    ],
    config: {
      source: 'upload',
      url: '',
      formats: ['mp3', 'wav', 'aac']
    }
  },
  {
    id: 'https-request',
    type: 'https-request',
    name: 'HTTPS Request',
    description: 'Fetch external data via APIs',
    category: 'input',
    icon: '🌐',
    inputs: [
      { name: 'url', type: 'text', required: true, description: 'Request URL' },
      { name: 'headers', type: 'any', description: 'Request headers' },
      { name: 'body', type: 'any', description: 'Request body' }
    ],
    outputs: [
      { name: 'response', type: 'any', description: 'API response' },
      { name: 'status', type: 'number', description: 'HTTP status code' }
    ],
    config: {
      method: 'GET',
      timeout: 30000,
      retries: 3
    }
  },

  // Generation Nodes
  {
    id: 'image-generation',
    type: 'image-generation',
    name: 'Image Generation',
    description: 'Generate images from text prompts',
    category: 'generation',
    icon: '🎨',
    inputs: [
      { name: 'prompt', type: 'text', required: true, description: 'Text prompt for image generation' },
      { name: 'negative_prompt', type: 'text', description: 'Negative prompt' },
      { name: 'reference_image', type: 'image', description: 'Reference image for img2img' }
    ],
    outputs: [
      { name: 'image', type: 'image', description: 'Generated image' },
      { name: 'metadata', type: 'any', description: 'Generation metadata' }
    ],
    config: {
      model: 'SDXL',
      resolution: '1024x1024',
      steps: 20,
      guidance_scale: 7.5,
      seed: -1
    },
    aiModel: 'SDXL',
    requiresAuth: true,
    authProvider: 'stability'
  },
  {
    id: 'video-generation',
    type: 'video-generation',
    name: 'Video Generation',
    description: 'Generate videos from text or image prompts',
    category: 'generation',
    icon: '🎬',
    inputs: [
      { name: 'prompt', type: 'text', required: true, description: 'Text prompt for video generation' },
      { name: 'image', type: 'image', description: 'Starting image for video' }
    ],
    outputs: [
      { name: 'video', type: 'video', description: 'Generated video' },
      { name: 'metadata', type: 'any', description: 'Generation metadata' }
    ],
    config: {
      model: 'Veo',
      duration: 5,
      fps: 24,
      resolution: '1280x720'
    },
    aiModel: 'Veo',
    requiresAuth: true,
    authProvider: 'google'
  },
  {
    id: 'text-generation',
    type: 'text-generation',
    name: 'Text Generation',
    description: 'Generate text using AI language models',
    category: 'generation',
    icon: '✍️',
    inputs: [
      { name: 'prompt', type: 'text', required: true, description: 'Input prompt' },
      { name: 'context', type: 'text', description: 'Additional context' }
    ],
    outputs: [
      { name: 'text', type: 'text', description: 'Generated text' },
      { name: 'metadata', type: 'any', description: 'Generation metadata' }
    ],
    config: {
      model: 'gpt-4',
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1.0
    },
    aiModel: 'OpenAI',
    requiresAuth: true,
    authProvider: 'openai'
  },
  {
    id: 'speech-to-text',
    type: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Convert audio to text using Whisper',
    category: 'generation',
    icon: '🎤',
    inputs: [
      { name: 'audio', type: 'audio', required: true, description: 'Audio file to transcribe' }
    ],
    outputs: [
      { name: 'text', type: 'text', description: 'Transcribed text' },
      { name: 'metadata', type: 'any', description: 'Transcription metadata' }
    ],
    config: {
      model: 'whisper-1',
      language: 'auto',
      response_format: 'text'
    },
    aiModel: 'Whisper',
    requiresAuth: true,
    authProvider: 'openai'
  },
  {
    id: 'text-to-speech',
    type: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to speech audio',
    category: 'generation',
    icon: '🔊',
    inputs: [
      { name: 'text', type: 'text', required: true, description: 'Text to convert to speech' }
    ],
    outputs: [
      { name: 'audio', type: 'audio', description: 'Generated audio' },
      { name: 'metadata', type: 'any', description: 'Generation metadata' }
    ],
    config: {
      voice: 'alloy',
      model: 'tts-1',
      speed: 1.0,
      format: 'mp3'
    },
    aiModel: 'OpenAI',
    requiresAuth: true,
    authProvider: 'openai'
  },

  // Utility Nodes
  {
    id: 'delay',
    type: 'delay',
    name: 'Delay',
    description: 'Introduce a wait before the next step',
    category: 'utility',
    icon: '⏱️',
    inputs: [
      { name: 'input', type: 'any', required: true, description: 'Input to pass through after delay' }
    ],
    outputs: [
      { name: 'output', type: 'any', description: 'Output after delay' }
    ],
    config: {
      duration: 1000, // milliseconds
      unit: 'ms' // ms, s, m
    }
  },
  {
    id: 'condition',
    type: 'condition',
    name: 'Condition',
    description: 'Branch logic based on conditions',
    category: 'logic',
    icon: '🔀',
    inputs: [
      { name: 'input', type: 'any', required: true, description: 'Input value to evaluate' },
      { name: 'condition', type: 'text', required: true, description: 'Condition to evaluate' }
    ],
    outputs: [
      { name: 'true', type: 'any', description: 'Output when condition is true' },
      { name: 'false', type: 'any', description: 'Output when condition is false' }
    ],
    config: {
      operator: 'equals', // equals, not_equals, greater_than, less_than, contains
      value: ''
    }
  },
  {
    id: 'loop',
    type: 'loop',
    name: 'Loop',
    description: 'Repeat actions over batch inputs',
    category: 'logic',
    icon: '🔄',
    inputs: [
      { name: 'items', type: 'any', required: true, description: 'Array of items to loop over' },
      { name: 'template', type: 'any', required: true, description: 'Template for each iteration' }
    ],
    outputs: [
      { name: 'results', type: 'any', description: 'Array of results from each iteration' },
      { name: 'count', type: 'number', description: 'Number of iterations' }
    ],
    config: {
      max_iterations: 100,
      parallel: false
    }
  },
  {
    id: 'merge',
    type: 'merge',
    name: 'Merge',
    description: 'Combine multiple inputs into a single output',
    category: 'utility',
    icon: '🔗',
    inputs: [
      { name: 'input1', type: 'any', description: 'First input' },
      { name: 'input2', type: 'any', description: 'Second input' },
      { name: 'input3', type: 'any', description: 'Third input' }
    ],
    outputs: [
      { name: 'merged', type: 'any', description: 'Merged output' }
    ],
    config: {
      merge_type: 'object', // object, array, concat
      key_prefix: ''
    }
  },

  // Output Nodes
  {
    id: 'save-file',
    type: 'save-file',
    name: 'Save File',
    description: 'Save data to a file',
    category: 'output',
    icon: '💾',
    inputs: [
      { name: 'data', type: 'any', required: true, description: 'Data to save' },
      { name: 'filename', type: 'text', description: 'Custom filename' }
    ],
    outputs: [
      { name: 'file_path', type: 'text', description: 'Path to saved file' },
      { name: 'success', type: 'boolean', description: 'Whether save was successful' }
    ],
    config: {
      format: 'auto', // auto, json, txt, csv, png, jpg, mp4, mp3
      directory: 'downloads'
    }
  },
  {
    id: 'webhook',
    type: 'webhook',
    name: 'Webhook',
    description: 'Send data to external webhook URL',
    category: 'output',
    icon: '📡',
    inputs: [
      { name: 'data', type: 'any', required: true, description: 'Data to send' },
      { name: 'url', type: 'text', required: true, description: 'Webhook URL' }
    ],
    outputs: [
      { name: 'response', type: 'any', description: 'Webhook response' },
      { name: 'success', type: 'boolean', description: 'Whether webhook was successful' }
    ],
    config: {
      method: 'POST',
      headers: {},
      timeout: 30000
    }
  },
  {
    id: 'export',
    type: 'export',
    name: 'Export',
    description: 'Export workflow results in various formats',
    category: 'output',
    icon: '📤',
    inputs: [
      { name: 'data', type: 'any', required: true, description: 'Data to export' }
    ],
    outputs: [
      { name: 'exported', type: 'any', description: 'Exported data' },
      { name: 'download_url', type: 'text', description: 'Download URL' }
    ],
    config: {
      format: 'json', // json, csv, xlsx, pdf, zip
      compression: false,
      include_metadata: true
    }
  }
];

export function getNodeTemplate(type: string): NodeTemplate | undefined {
  return NODE_TEMPLATES.find(template => template.type === type);
}

export function getNodeTemplatesByCategory(category: string): NodeTemplate[] {
  return NODE_TEMPLATES.filter(template => template.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(NODE_TEMPLATES.map(template => template.category))];
}

