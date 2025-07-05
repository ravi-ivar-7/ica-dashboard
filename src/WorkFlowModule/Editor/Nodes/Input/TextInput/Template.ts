import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

export const textInputTemplate: NodeTemplate = {
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
};

