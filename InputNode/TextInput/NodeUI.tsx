import { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { TextInputType, TextInputOutputs } from './Types';
import { Settings, X, ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';

interface TextInputNodeProps {
  data: TextInputType & {
    outputs?: TextInputOutputs;
    status?: string;
    onConfigChange: (config: TextInputType['config']) => void;
    onDelete: () => void;
    isSelected: boolean;
    minimized?: boolean;
  };
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'running': return 'bg-yellow-500';
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'text': return 'bg-blue-500';
    case 'object': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export default function TextInputNode({ data }: TextInputNodeProps) {
  const [isExpanded, setIsExpanded] = useState(!data.minimized);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const renderVariablesEditor = () => {
    return (
      <div className="mt-3 space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Workflow Variables</h4>
        {Object.entries(data.config.content.variables.prefixes.workflow).map(([key, variable]) => (
          <div key={key} className="grid grid-cols-3 gap-2 text-xs">
            <input
              value={variable.key}
              readOnly
              className="px-2 py-1 border border-gray-200 rounded bg-gray-50"
              placeholder="Key"
            />
            <input
              value={variable.value || ''}
              onChange={(e) => {
                const newPrefixes = {
                  ...data.config.content.variables.prefixes,
                  workflow: {
                    ...data.config.content.variables.prefixes.workflow,
                    [key]: {
                      ...variable,
                      value: e.target.value
                    }
                  }
                };
                data.onConfigChange({
                  ...data.config,
                  content: {
                    ...data.config.content,
                    variables: {
                      ...data.config.content.variables,
                      prefixes: newPrefixes
                    }
                  }
                });
              }}
              className="px-2 py-1 border border-gray-300 rounded"
              placeholder="Value"
            />
            <input
              value={variable.description || ''}
              onChange={(e) => {
                const newPrefixes = {
                  ...data.config.content.variables.prefixes,
                  workflow: {
                    ...data.config.content.variables.prefixes.workflow,
                    [key]: {
                      ...variable,
                      description: e.target.value
                    }
                  }
                };
                data.onConfigChange({
                  ...data.config,
                  content: {
                    ...data.config.content,
                    variables: {
                      ...data.config.content.variables,
                      prefixes: newPrefixes
                    }
                  }
                });
              }}
              className="px-2 py-1 border border-gray-300 rounded"
              placeholder="Description"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 min-w-[320px] max-w-[450px] ${
      data.isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b">
        <div className="flex items-center gap-2">
          <button onClick={data.onDelete} className="text-gray-500 hover:text-red-500">
            <X size={16} />
          </button>
          <span className="text-lg">{data.icon}</span>
          <h3 className="font-semibold text-sm">{data.name}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {data.status && (
            <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`} />
          )}
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-gray-500 hover:text-blue-500">
            <Settings size={16} />
          </button>
          <button onClick={toggleExpand} className="text-gray-500 hover:text-blue-500">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {/* Description */}
          <p className="text-xs text-gray-600 mb-4">{data.description}</p>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Configuration */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Configuration
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={data.config.content.default}
                    onChange={(e) => data.onConfigChange({
                      ...data.config,
                      content: {
                        ...data.config.content,
                        default: e.target.value
                      }
                    })}
                    placeholder={data.config.content.placeholder}
                    rows={4}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{data.config.content.description}</p>
                </div>

                <div>
                  <button
                    onClick={() => setShowVariables(!showVariables)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900"
                  >
                    Template Variables
                    {showVariables ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {showVariables && renderVariablesEditor()}
                </div>

                {showAdvanced && (
                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Input Type
                      </label>
                      <select
                        value={data.config.processing.default.inputType as string}
                        onChange={(e) => data.onConfigChange({
                          ...data.config,
                          processing: {
                            ...data.config.processing,
                            default: {
                              ...data.config.processing.default,
                              inputType: e.target.value
                            }
                          }
                        })}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {data.config.processing.schema.inputType.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="normalize"
                        checked={!!data.config.processing.default.normalize}
                        onChange={(e) => data.onConfigChange({
                          ...data.config,
                          processing: {
                            ...data.config.processing,
                            default: {
                              ...data.config.processing.default,
                              normalize: e.target.checked
                            }
                          }
                        })}
                        className="mr-2"
                      />
                      <label htmlFor="normalize" className="text-xs text-gray-700">
                        {data.config.processing.schema.normalize.description}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Outputs */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Outputs
              </h4>
              
              <div className="space-y-3">
                {data.outputs.map((output, _) => (
                  <div key={output.name} className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-gray-700">
                          {output.name}
                        </span>
                        <span className={`text-xs px-1 py-0.5 rounded text-white ${getTypeColor(output.type)}`}>
                          {output.type}
                        </span>
                      </div>
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={output.name}
                        className={`w-3 h-3 ${getTypeColor(output.type)} border-2 border-white rounded-full`}
                        style={{ right: '-6px' }}
                      />
                    </div>
                    
                    {output.description && (
                      <p className="text-xs text-gray-500 mt-1">{output.description}</p>
                    )}
                    
                    {data.outputs?.[output.name as keyof TextInputOutputs] && (
                      <div className="text-xs text-gray-600 mt-1 p-2 bg-gray-50 rounded border">
                        <pre className="overflow-x-auto">
                          {JSON.stringify(data.outputs[output.name as keyof TextInputOutputs], null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-gray-500">
            <span>v{data.version}</span>
            <span>{data.keywords.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Minimized view */}
      {!isExpanded && (
        <div className="p-3 relative">
          {/* Output handles for minimized view */}
          {data.outputs.map((output, index) => (
            <Handle
              key={output.name}
              type="source"
              position={Position.Right}
              id={output.name}
              className={`w-3 h-3 ${getTypeColor(output.type)} border-2 border-white rounded-full`}
              style={{ 
                right: '-6px',
                top: `${20 + index * 20}px`
              }}
            />
          ))}
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 truncate">{data.description}</span>
            <span className="text-xs text-gray-500 ml-2">{data.outputs.length} outputs</span>
          </div>
        </div>
      )}
    </div>
  );
}