import { TextInputType } from './Types';

export const TEXT_INPUT_NODE: TextInputType = {
  id: 'text-input',
  type: 'text-input',
  name: 'Text Input',
  category: 'input',
  icon: '📝',
  version: '1.0',
  description: 'Accepts text input with support for template variables',
  keywords: ['text', 'input', 'templating'],
  inputs: [],
  outputs: [
    {
      name: 'text',
      type: 'text',
      description: 'Output text with resolved variables',
    },
    {
      name: 'variables',
      type: 'object',
      description: 'Map of all resolved variable values',
      sensitive: true
    },
    {
      name: 'metadata',
      type: 'object',
      description: 'Execution information',
      schema: {
        resolvedAt: { type: 'string', format: 'date-time' },
        unresolvedVars: { type: 'array', items: { type: 'string' } },
        executionId: { type: 'string' }
      }
    }
  ],
  config: {
    content: {
      type: 'textarea',
      default: 'Hello, {{workflow.name}}! Current date is {{workflow.timestamp}}',
      placeholder: 'Type your text here...',
      description: 'Supports {{workflow.*}} template variables',
      variables: {
        syntax: 'doubleCurlyBraces',
        prefixes: {
          workflow: {
            'name': {
              key: 'name',
              value: 'default_user',
              description: 'Current workflow user name'
            },
            'username': {
              key: 'username',
              value: 'default_username',
              description: 'Current workflow username'
            },
            'timestamp': {
              key: 'timestamp',
              value: new Date().toISOString(),
              description: 'Current timestamp in ISO format'
            },
            'date': {
              key: 'date',
              value:new Date().toISOString().split('T')[0],
              description: 'Current date  payload'
            }
          }
          // env: {}  // Removed since it's optional in types
        }
        // customVariables: {}  // Removed since it's optional in types
      }
    },
    processing: {
      type: 'object',
      default: {
        inputType: 'plain',
        normalize: true
      },
      schema: {
        inputType: {
          type: 'select',
          options: [
            {
              value: 'plain',
              label: 'Plain Text'
            },
            {
              value: 'markdown',
              label: 'Markdown'
            },
            {
              value: 'json',
              label: 'JSON'
            },
            {
              value: 'html',
              label: 'HTML'
            }
          ],
          default: 'plain'
        },
        normalize: {
          type: 'boolean',
          default: true,
          description: 'Normalize line endings and trim whitespace'
        }
      }
    }
  }
};