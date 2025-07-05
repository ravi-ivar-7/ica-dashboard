import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

export const imageGenerationTemplate: NodeTemplate = {
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
};

