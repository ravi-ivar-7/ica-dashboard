// properties/BasePropertiesPanel.tsx
import React from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';
import { Trash2, ChevronRight } from 'lucide-react';

interface BasePropertiesPanelProps {
  selectedElement: CanvasElementType;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
  onDeleteElement: (id: string) => void;
  onToggleCollapse?: () => void;
  children: React.ReactNode;
}

export const BasePropertiesPanel: React.FC<BasePropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onToggleCollapse,
  children
}) => {
  const handleChange = (key: string, value: any) => {
    onUpdateElement(selectedElement.id, { [key]: value });
  };

  return (
    <div className="h-full bg-gray-900/80 border-l border-white/10 p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Collapse panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <h3 className="text-white font-bold text-sm">Element Properties</h3>
        <button
          onClick={() => onDeleteElement(selectedElement.id)}
          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Common properties for all elements */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-1">Type</label>
          <div className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm">
            {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
          </div>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1">X Position</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => handleChange('x', Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1">Y Position</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => handleChange('y', Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1">Width</label>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1">Height</label>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-1">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation || 0}
            onChange={(e) => handleChange('rotation', Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-white/50 text-xs">
            <span>0°</span>
            <span>{selectedElement.rotation || 0}°</span>
            <span>360°</span>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedElement.opacity || 1}
            onChange={(e) => handleChange('opacity', Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-white/50 text-xs">
            <span>0%</span>
            <span>{Math.round((selectedElement.opacity || 1) * 100)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Timeline Properties */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-1">Start Time (seconds)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={selectedElement.startTime}
            onChange={(e) => handleChange('startTime', Number(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-white/70 text-xs font-medium mb-1">Duration (seconds)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={selectedElement.duration}
            onChange={(e) => handleChange('duration', Number(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Type-specific properties */}
        {children}
      </div>
    </div>
  );
};