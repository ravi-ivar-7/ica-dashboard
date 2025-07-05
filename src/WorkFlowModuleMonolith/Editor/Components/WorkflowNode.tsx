import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { WorkflowNode as WFNode, NodeInput, NodeOutput } from '@/WorkFlowModule/Types/workflow';
import { ChevronDown, ChevronUp, Settings, X, Play, Minimize2, Maximize2 } from 'lucide-react';

interface WorkflowNodeProps {
  data: WFNode & {
    onUpdate: (node: WFNode) => void;
    onDelete: () => void;
    isSelected: boolean;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-yellow-500';
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'text':
      return 'bg-blue-500';
    case 'image':
      return 'bg-purple-500';
    case 'video':
      return 'bg-red-500';
    case 'audio':
      return 'bg-green-500';
    case 'number':
      return 'bg-orange-500';
    case 'boolean':
      return 'bg-pink-500';
    case 'any':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

export default function WorkflowNode({ data }: WorkflowNodeProps) {
  const [isExpanded, setIsExpanded] = useState(!data.minimized);
  const [showOptionalInputs, setShowOptionalInputs] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const requiredInputs = data.inputs.filter(input => input.required);
  const optionalInputs = data.inputs.filter(input => !input.required);

  const handleInputChange = useCallback((inputId: string, value: any) => {
    const updatedInputs = data.inputs.map(input =>
      input.id === inputId ? { ...input, value } : input
    );
    
    data.onUpdate({
      ...data,
      inputs: updatedInputs
    });
  }, [data]);

  const handleConfigChange = useCallback((key: string, value: any) => {
    data.onUpdate({
      ...data,
      config: {
        ...data.config,
        [key]: value
      }
    });
  }, [data]);

  const toggleMinimized = useCallback(() => {
    const newMinimized = !data.minimized;
    setIsExpanded(!newMinimized);
    data.onUpdate({
      ...data,
      minimized: newMinimized
    });
  }, [data]);

  const renderInput = (input: NodeInput, index: number) => (
    <div key={input.id} className="mb-3 relative">
      {/* Input Handle - Always visible and properly positioned */}
      <Handle
        type="target"
        position={Position.Left}
        id={input.id}
        className={`absolute left-0 top-2 w-4 h-4 ${getTypeColor(input.type)} border-2 border-white rounded-full cursor-pointer hover:scale-110 transition-transform z-10`}
        style={{ 
          left: '-8px',
          transform: 'translateY(-50%)'
        }}
        isConnectable={true}
      />
      
      <div className="ml-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-700">
            {input.name}
            {input.required && <span className="text-red-500 ml-1">*</span>}
          </span>
          <span className={`text-xs px-1 py-0.5 rounded text-white ${getTypeColor(input.type)}`}>
            {input.type}
          </span>
        </div>
        
        {!input.connected && (
          <div className="mt-1">
            {input.type === 'text' && (
              <textarea
                value={input.value || ''}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
                placeholder={input.description || `Enter ${input.name}`}
                rows={2}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            )}
            {input.type === 'number' && (
              <input
                type="number"
                value={input.value || ''}
                onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value) || 0)}
                placeholder={input.description || `Enter ${input.name}`}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
            {input.type === 'boolean' && (
              <select
                value={input.value || false}
                onChange={(e) => handleInputChange(input.id, e.target.value === 'true')}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            )}
            {input.options && (
              <select
                value={input.value || ''}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {input.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        )}
        
        {input.connected && (
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Connected from {input.sourceNodeId}
          </div>
        )}
      </div>
    </div>
  );

  const renderOutput = (output: NodeOutput, index: number) => (
    <div key={output.id} className="mb-3 relative">
      {/* Output Handle - Always visible and properly positioned */}
      <Handle
        type="source"
        position={Position.Right}
        id={output.id}
        className={`absolute right-0 top-2 w-4 h-4 ${getTypeColor(output.type)} border-2 border-white rounded-full cursor-pointer hover:scale-110 transition-transform z-10`}
        style={{ 
          right: '-8px',
          transform: 'translateY(-50%)'
        }}
        isConnectable={true}
      />
      
      <div className="mr-6">
        <div className="flex items-center justify-end gap-2 mb-1">
          <span className={`text-xs px-1 py-0.5 rounded text-white ${getTypeColor(output.type)}`}>
            {output.type}
          </span>
          <span className="text-xs font-medium text-gray-700">{output.name}</span>
        </div>
        
        {output.value && (
          <div className="text-xs text-gray-600 text-right mt-1 p-2 bg-gray-50 rounded border">
            <div className="font-mono">
              {typeof output.value === 'string' 
                ? output.value.length > 100 
                  ? output.value.substring(0, 100) + '...'
                  : output.value
                : JSON.stringify(output.value, null, 2).substring(0, 200) + (JSON.stringify(output.value).length > 200 ? '...' : '')
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg border-2 min-w-[320px] max-w-[450px] relative ${
        data.isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'
      }`}
      style={{ position: 'relative' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMinimized}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <span className="text-lg">{data.icon || '🔧'}</span>
          <div>
            <h3 className="font-semibold text-sm text-gray-800">{data.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{data.category}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`} />
          {data.status === 'running' && (
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={data.onDelete}
            className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Description */}
          {data.description && (
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">{data.description}</p>
          )}

          {/* Error Display */}
          {data.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <strong>Error:</strong> {data.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Inputs Column */}
            <div className="space-y-1">
              {requiredInputs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Required Inputs
                  </h4>
                  {requiredInputs.map((input, index) => renderInput(input, index))}
                </div>
              )}

              {optionalInputs.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowOptionalInputs(!showOptionalInputs)}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-3 hover:text-gray-900 uppercase tracking-wide"
                  >
                    Optional ({optionalInputs.length})
                    {showOptionalInputs ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {showOptionalInputs && optionalInputs.map((input, index) => renderInput(input, index))}
                </div>
              )}
            </div>

            {/* Outputs Column */}
            {data.outputs.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Outputs
                </h4>
                {data.outputs.map((output, index) => renderOutput(output, index))}
              </div>
            )}
          </div>

          {/* Configuration */}
          {showConfig && Object.keys(data.config).length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Configuration</h4>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(data.config).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-600 block mb-1 font-medium">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    {typeof value === 'boolean' ? (
                      <select
                        value={value.toString()}
                        onChange={(e) => handleConfigChange(key, e.target.value === 'true')}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="false">False</option>
                        <option value="true">True</option>
                      </select>
                    ) : typeof value === 'number' ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleConfigChange(key, parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleConfigChange(key, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-gray-500">
            <span className="font-mono">ID: {data.id.substring(0, 8)}...</span>
            {data.lastRun && (
              <span>Last run: {new Date(data.lastRun).toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      )}

      {/* Minimized view with handles still visible */}
      {!isExpanded && (
        <div className="p-3 relative">
          {/* Input handles for minimized view */}
          {data.inputs.map((input, index) => (
            <Handle
              key={input.id}
              type="target"
              position={Position.Left}
              id={input.id}
              className={`w-3 h-3 ${getTypeColor(input.type)} border-2 border-white rounded-full`}
              style={{ 
                left: '-6px',
                top: `${20 + index * 15}px`
              }}
              isConnectable={true}
            />
          ))}
          
          {/* Output handles for minimized view */}
          {data.outputs.map((output, index) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Right}
              id={output.id}
              className={`w-3 h-3 ${getTypeColor(output.type)} border-2 border-white rounded-full`}
              style={{ 
                right: '-6px',
                top: `${20 + index * 15}px`
              }}
              isConnectable={true}
            />
          ))}
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 truncate flex-1">{data.description}</span>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-gray-500">{data.inputs.length}→{data.outputs.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

