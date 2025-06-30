import React from 'react';
import { CanvasElementType } from '../../types/cineflow';
import { Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement: CanvasElementType | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
  onDeleteElement: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selectedElement) {
    if (isCollapsed) {
      return (
        <div className="h-full bg-gray-900/80 border-l border-white/10 w-10 flex flex-col">
          <div className="p-1 border-b border-white/10 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Expand panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-white/30 text-xs writing-mode-vertical transform rotate-180">
              No selection
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-gray-900/80 border-l border-white/10 p-3 flex items-center justify-center">
        <div className="flex flex-col items-center">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mb-4"
              title="Collapse panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <p className="text-white/50 text-xs text-center">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    onUpdateElement(selectedElement.id, { [key]: value });
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    onUpdateElement(selectedElement.id, { textAlign: align });
  };

  const handleFontStyleChange = (style: 'bold' | 'italic' | 'underline') => {
    if (style === 'bold') {
      onUpdateElement(selectedElement.id, { 
        fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
      });
    }
  };

  return (
    <div className="h-full bg-gray-900/80 border-l border-white/10 p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">Element Properties</h3>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Collapse panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDeleteElement(selectedElement.id)}
          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Element Type */}
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

        {/* Text-specific properties */}
        {selectedElement.type === 'text' && (
          <>
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1">Text Content</label>
              <textarea
                value={selectedElement.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1">Font Size</label>
              <input
                type="number"
                min="8"
                max="200"
                value={selectedElement.fontSize || 24}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1">Font Family</label>
              <select
                value={selectedElement.fontFamily || 'sans-serif'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
                <option value="fantasy">Fantasy</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1">Text Color</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={selectedElement.color || '#ffffff'}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={selectedElement.color || '#ffffff'}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1">Text Alignment</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleTextAlignChange('left')}
                  className={`flex-1 py-1.5 rounded-lg ${
                    selectedElement.textAlign === 'left' 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <AlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleTextAlignChange('center')}
                  className={`flex-1 py-1.5 rounded-lg ${
                    selectedElement.textAlign === 'center' || !selectedElement.textAlign
                      ? 'bg-amber-500 text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <AlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleTextAlignChange('right')}
                  className={`flex-1 py-1.5 rounded-lg ${
                    selectedElement.textAlign === 'right' 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <AlignRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1">Font Style</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleFontStyleChange('bold')}
                  className={`flex-1 py-1.5 rounded-lg ${
                    selectedElement.fontWeight === 'bold' 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Bold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleFontStyleChange('italic')}
                  className="flex-1 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
                >
                  <Italic className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleFontStyleChange('underline')}
                  className="flex-1 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
                >
                  <Underline className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;