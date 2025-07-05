# WorkFlow Module - Visual Node-Based Automation Platform

## Overview

This is a complete implementation of a visual workflow editor similar to n8n and other automation platforms. The WorkFlow Module provides a drag-and-drop interface for creating complex automation workflows using interconnected nodes.

## Features

### ✅ Core Functionality
- **Visual Node Editor**: Drag-and-drop canvas with zoom, pan, and grid snapping
- **20+ Node Types**: Input, Generation, Utility, Logic, and Output nodes
- **Real-time Execution**: Live workflow execution with status indicators
- **Data Flow**: Proper data passing between connected nodes
- **Mobile Responsive**: Touch-friendly interface with collapsible panels

### ✅ Node Categories

#### Input Nodes
- **Text Input**: Accept user text input
- **Image Input**: Upload and process images
- **Video Input**: Handle video files
- **Audio Input**: Process audio files
- **HTTPS Request**: Fetch data from external APIs

#### Generation Nodes (AI-Powered)
- **Image Generation**: Text-to-image using SDXL/Stable Diffusion
- **Video Generation**: Text/image-to-video using Veo
- **Text Generation**: AI text generation using GPT models
- **Speech-to-Text**: Audio transcription using Whisper
- **Text-to-Speech**: Voice synthesis

#### Utility Nodes
- **Delay**: Add time delays in workflows
- **Condition**: Conditional branching logic
- **Loop**: Iterate over data sets
- **Merge**: Combine multiple inputs

#### Output Nodes
- **Save File**: Save data to files
- **Webhook**: Send data to external services
- **Export**: Export workflow results

### ✅ Advanced Features
- **Undo/Redo**: Full history management
- **Save/Load**: Persistent workflow storage
- **Error Handling**: Comprehensive error management
- **Type Validation**: Connection type checking
- **Real-time Status**: Live execution feedback
- **Mobile Support**: Touch gestures and responsive design

## Architecture

### File Structure
```
src/WorkFlowModule/
├── Types/
│   └── workflow.ts                 # TypeScript interfaces
├── Editor/
│   ├── Components/
│   │   ├── WorkflowCanvas.tsx      # Main canvas component
│   │   ├── WorkflowNode.tsx        # Individual node component
│   │   ├── NodeLibrary.tsx         # Node palette sidebar
│   │   ├── PropertiesPanel.tsx     # Node configuration panel
│   │   └── MobileWorkflowCanvas.tsx # Mobile-optimized canvas
│   ├── Services/
│   │   ├── NodeTemplates.ts        # Node type definitions
│   │   ├── NodeExecutor.ts         # Node execution engine
│   │   └── WorkflowEngine.ts       # Workflow orchestration
│   └── Pages/
│       └── WorkFlowEditor.tsx      # Main editor page
├── Dashboard/
│   └── Pages/
│       └── WorkFlowHome.tsx        # Workflow management
└── WorkFlowRoutes.tsx              # Routing configuration
```

### Key Components

#### WorkflowCanvas
- ReactFlow-based canvas with custom node types
- Drag-and-drop functionality
- Connection validation
- Real-time execution visualization

#### NodeExecutor
- Individual node execution logic
- Mock API implementations with fallback data
- Error handling and status management
- Type-safe input/output handling

#### WorkflowEngine
- Workflow orchestration and execution
- Dependency resolution
- Parallel execution support
- Cycle detection and validation

## Usage

### Getting Started

1. **Navigate to Workflows**
   ```
   http://localhost:3000/dashboard/workflow
   ```

2. **Create New Workflow**
   - Click "Create New Workflow"
   - Enter workflow name and description

3. **Add Nodes**
   - Drag nodes from the left panel to canvas
   - Configure node parameters in right panel
   - Connect nodes by dragging from output to input

4. **Execute Workflow**
   - Click "Run Workflow" to execute entire workflow
   - Or click individual node "Run" buttons for testing

### Node Configuration

Each node has:
- **Inputs**: Required and optional input parameters
- **Outputs**: Data produced by the node
- **Configuration**: Node-specific settings
- **Status**: Current execution state (idle, running, success, error)

### Connections

- **Type Safety**: Only compatible types can be connected
- **Visual Feedback**: Color-coded connection points
- **Multiple Outputs**: One output can connect to multiple inputs
- **Data Flow**: Real-time data passing between nodes

## Mobile Support

The workflow editor is fully responsive:

- **Touch Gestures**: Pinch-to-zoom, drag-to-pan
- **Collapsible Panels**: Swipe-out drawers for mobile
- **Touch-Friendly**: Large touch targets and optimized interactions
- **Responsive Layout**: Adapts to all screen sizes

## API Integration

### Mock Implementation
Currently uses mock data for demonstration:
- Image generation returns placeholder images
- Text generation provides sample responses
- All nodes execute with realistic delays

### Production Ready
The architecture supports real API integration:
- Secure credential management
- BYOK (Bring Your Own Key) support
- Server-side execution for sensitive operations
- Proper error handling and retries

## Development

### Adding New Node Types

1. **Define Node Template** in `NodeTemplates.ts`:
```typescript
{
  id: 'my-node',
  type: 'my-node',
  name: 'My Custom Node',
  description: 'Description of functionality',
  category: 'utility',
  icon: '🔧',
  inputs: [
    { name: 'input', type: 'text', required: true }
  ],
  outputs: [
    { name: 'output', type: 'text' }
  ],
  config: {
    setting1: 'default_value'
  }
}
```

2. **Implement Execution Logic** in `NodeExecutor.ts`:
```typescript
private async executeMyNode(node: WorkflowNode, context: ExecutionContext): Promise<ExecutionResult> {
  const input = this.getInputValue(node, 'input');
  
  // Process the input
  const result = processInput(input);
  
  return {
    success: true,
    outputs: {
      output: result
    }
  };
}
```

3. **Add to Switch Statement** in `NodeExecutor.performExecution()`:
```typescript
case 'my-node':
  return this.executeMyNode(node, context);
```

### Extending Functionality

- **Custom Node UI**: Extend `WorkflowNode.tsx` for specialized interfaces
- **New Data Types**: Add types to `DataType` enum in `workflow.ts`
- **Advanced Execution**: Enhance `WorkflowEngine.ts` for complex workflows
- **Mobile Optimization**: Update `MobileWorkflowCanvas.tsx` for mobile features

## Security

- **Server-side Secrets**: API keys stored securely on backend
- **Input Validation**: All user inputs validated and sanitized
- **Type Safety**: TypeScript ensures type correctness
- **Error Boundaries**: Comprehensive error handling

## Performance

- **Optimized Rendering**: Efficient React component updates
- **Memory Management**: Proper cleanup and garbage collection
- **Lazy Loading**: Components loaded on demand
- **Chunked Builds**: Optimized bundle splitting

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Touch Support**: Full touch gesture support
- **Responsive Design**: Works on all screen sizes

## Future Enhancements

- **Real API Integration**: Connect to actual AI services
- **Advanced Scheduling**: Cron-based workflow triggers
- **Collaboration**: Multi-user editing support
- **Version Control**: Workflow versioning and branching
- **Marketplace**: Community node sharing
- **Analytics**: Workflow performance monitoring

## Troubleshooting

### Common Issues

1. **Nodes Not Connecting**
   - Check type compatibility between output and input
   - Ensure both nodes are properly configured

2. **Execution Failures**
   - Check node configuration for required inputs
   - Verify data flow between connected nodes

3. **Mobile Issues**
   - Ensure touch events are properly handled
   - Check responsive layout on different screen sizes

### Debug Mode

Enable debug mode by:
1. Opening browser developer tools
2. Setting `localStorage.setItem('workflow_debug', 'true')`
3. Refreshing the page

This provides:
- Detailed execution logs
- Node state inspection
- Connection validation details

## Contributing

When contributing to the WorkFlow Module:

1. Follow the existing architecture patterns
2. Maintain type safety with TypeScript
3. Add comprehensive error handling
4. Test on both desktop and mobile
5. Update documentation for new features

## License

This implementation is part of the OpenModel Studio project and follows the project's licensing terms.

