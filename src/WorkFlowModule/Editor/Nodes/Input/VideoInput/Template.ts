import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

export const videoInputTemplate: NodeTemplate = {
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
};

