import React, { useState } from 'react';
import { ChevronLeft, Settings, Info, Code, Play, Trash2 } from 'lucide-react';
import { WorkflowNode, WorkflowProject } from '@/WorkFlowModule/Types/workflow';

interface PropertiesPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedNode: WorkflowNode | null;
  project: WorkflowProject;
  onNodeUpdate: (node: WorkflowNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeExecute: (nodeId: string) => void;
}

export default function PropertiesPanel({
  isOpen,
  onToggle,
  selectedNode,
  project,
  onNodeUpdate,
  onNodeDelete,
  onNodeExecute,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'config' | 'data'>('general');

  const handleInputChange = (inputId: string, value: any) => {
    if (!selectedNode) return;

    const updatedInputs = selectedNode.inputs.map(input =>
      input.id === inputId ? { ...input, value } : input
    );

    onNodeUpdate({
      ...selectedNode,
      inputs: updatedInputs
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    if (!selectedNode) return;

    onNodeUpdate({
      ...selectedNode,
      config: {
        ...selectedNode.config,
        [key]: value
      }
    });
  };

  const handleNameChange = (name: string) => {
    if (!selectedNode) return;

    onNodeUpdate({
      ...selectedNode,
      name
    });
  };

  const handleDescriptionChange = (description: string) => {
    if (!selectedNode) return;

    onNodeUpdate({
      ...selectedNode,
      description
    });
  };

  if (!isOpen) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Open Properties Panel"
        >
          <span className="text-lg">⚙️</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>⚙️</span>
            Properties
          </h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close Properties Panel"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {selectedNode && (
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === 'general'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Info size={12} className="inline mr-1" />
              General
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === 'config'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={12} className="inline mr-1" />
              Config
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === 'data'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Code size={12} className="inline mr-1" />
              Data
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedNode ? (
          <div className="p-4 text-center text-gray-500">
            <Settings size={48} className="mx-auto mb-3 opacity-50" />
            <p>Select a node to view its properties</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {activeTab === 'general' && (
              <>
                {/* Node Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Node Name
                    </label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={selectedNode.description || ''}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter node description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={selectedNode.type}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={selectedNode.category}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Node ID
                    </label>
                    <input
                      type="text"
                      value={selectedNode.id}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedNode.status === 'success' ? 'bg-green-500' :
                      selectedNode.status === 'error' ? 'bg-red-500' :
                      selectedNode.status === 'running' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-sm capitalize">{selectedNode.status}</span>
                  </div>
                  
                  {selectedNode.error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
                      {selectedNode.error}
                    </div>
                  )}
                  
                  {selectedNode.lastRun && (
                    <div className="text-xs text-gray-600">
                      Last run: {new Date(selectedNode.lastRun).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => onNodeExecute(selectedNode.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Play size={16} />
                    Run Node
                  </button>
                  
                  <button
                    onClick={() => onNodeDelete(selectedNode.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Node
                  </button>
                </div>
              </>
            )}

            {activeTab === 'config' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Configuration</h4>
                
                {Object.keys(selectedNode.config).length === 0 ? (
                  <p className="text-sm text-gray-500">No configuration options available</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(selectedNode.config).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        {typeof value === 'boolean' ? (
                          <select
                            value={value.toString()}
                            onChange={(e) => handleConfigChange(key, e.target.value === 'true')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="false">False</option>
                            <option value="true">True</option>
                          </select>
                        ) : typeof value === 'number' ? (
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => handleConfigChange(key, parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : Array.isArray(value) ? (
                          <textarea
                            value={JSON.stringify(value, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                handleConfigChange(key, parsed);
                              } catch (error) {
                                // Invalid JSON, don't update
                              }
                            }}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleConfigChange(key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Inputs Configuration */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Input Values</h4>
                  <div className="space-y-3">
                    {selectedNode.inputs.map(input => (
                      <div key={input.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {input.name}
                          {input.required && <span className="text-red-500 ml-1">*</span>}
                          <span className="text-xs text-gray-500 ml-2">({input.type})</span>
                        </label>
                        
                        {input.connected ? (
                          <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                            Connected to output
                          </div>
                        ) : (
                          <>
                            {input.type === 'text' && (
                              <textarea
                                value={input.value || ''}
                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                placeholder={input.description || `Enter ${input.name}`}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                            {input.type === 'number' && (
                              <input
                                type="number"
                                value={input.value || ''}
                                onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value))}
                                placeholder={input.description || `Enter ${input.name}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                            {input.type === 'boolean' && (
                              <select
                                value={input.value || false}
                                onChange={(e) => handleInputChange(input.id, e.target.value === 'true')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="false">False</option>
                                <option value="true">True</option>
                              </select>
                            )}
                            {input.options && (
                              <select
                                value={input.value || ''}
                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select...</option>
                                {input.options.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            )}
                          </>
                        )}
                        
                        {input.description && (
                          <p className="text-xs text-gray-500 mt-1">{input.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Node Data</h4>
                
                {/* Input Data */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Input Data</h5>
                  <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto max-h-40 border">
                    {JSON.stringify(
                      selectedNode.inputs.reduce((acc, input) => {
                        acc[input.name] = input.value;
                        return acc;
                      }, {} as Record<string, any>),
                      null,
                      2
                    )}
                  </pre>
                </div>

                {/* Output Data */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Output Data</h5>
                  <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto max-h-40 border">
                    {JSON.stringify(
                      selectedNode.outputs.reduce((acc, output) => {
                        acc[output.name] = output.value;
                        return acc;
                      }, {} as Record<string, any>),
                      null,
                      2
                    )}
                  </pre>
                </div>

                {/* Full Node Data */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Full Node Data</h5>
                  <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto max-h-60 border">
                    {JSON.stringify(selectedNode, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

