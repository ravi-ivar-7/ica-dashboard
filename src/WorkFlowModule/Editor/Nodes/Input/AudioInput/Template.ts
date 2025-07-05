import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

export const audioInputTemplate: NodeTemplate = {
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
};

