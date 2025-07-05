import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

export const imageInputTemplate: NodeTemplate = {
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
    source: 'upload',
    url: '',
    formats: ['jpg', 'png', 'webp']
  }
};

