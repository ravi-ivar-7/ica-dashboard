import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { NODE_TEMPLATES, getNodeTemplate } from '@/WorkFlowModule/Editor/Nodes';
import { NodeTemplate } from '@/WorkFlowModule/Types/workflow';

interface NodeLibraryProps {
  isOpen: boolean;
  onToggle: () => void;
}

const categoryIcons = {
  input: '📥',
  generation: '🎨',
  utility: '🔧',
  logic: '🧠',
  output: '📤',
};

const categoryColors = {
  input: 'bg-blue-100 text-blue-800 border-blue-200',
  generation: 'bg-purple-100 text-purple-800 border-purple-200',
  utility: 'bg-green-100 text-green-800 border-green-200',
  logic: 'bg-orange-100 text-orange-800 border-orange-200',
  output: 'bg-red-100 text-red-800 border-red-200',
};

export default function NodeLibrary({ isOpen, onToggle }: NodeLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['input', 'generation', 'utility', 'logic', 'output'])
  );

  const templates = NODE_TEMPLATES;

  // Group templates by category
  const categorizedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, NodeTemplate[]>);

  // Filter templates based on search
  const filteredTemplates = Object.entries(categorizedTemplates).reduce((acc, [category, templates]) => {
    const filtered = templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, NodeTemplate[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('Dragging node type:', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderNodeTemplate = (template: NodeTemplate) => (
    <div
      key={template.id}
      draggable
      onDragStart={(event) => onDragStart(event, template.type)}
      className="p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-all duration-200 hover:border-blue-300 active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{template.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 truncate">{template.name}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[template.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
              {template.category}
            </span>
            
            {template.aiModel && (
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                AI
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{template.inputs.length} inputs</span>
            <span>{template.outputs.length} outputs</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="w-12 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Open Node Library"
        >
          <span className="text-lg">🧩</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span>🧩</span>
            Node Library
          </h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close Node Library"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(filteredTemplates).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">🔍</span>
            <p className="text-sm">No nodes found</p>
            <p className="text-xs mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(filteredTemplates).map(([category, templates]) => (
              <div key={category} className="space-y-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons] || '📁'}</span>
                    <span className="font-medium text-sm capitalize">{category}</span>
                    <span className="text-xs text-gray-500">({templates.length})</span>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>

                {expandedCategories.has(category) && (
                  <div className="space-y-2 ml-4">
                    {templates.map(renderNodeTemplate)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">💡 How to use:</p>
          <p>• Drag nodes from here to the canvas</p>
          <p>• Connect outputs to inputs</p>
          <p>• Configure nodes in the properties panel</p>
          <p>• Click "Run Workflow" to execute</p>
        </div>
      </div>
    </div>
  );
}

