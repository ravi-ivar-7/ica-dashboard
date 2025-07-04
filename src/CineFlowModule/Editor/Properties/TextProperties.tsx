// properties/TextProperties.tsx
import React from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

interface TextPropertiesProps {
  element: CanvasElementType;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ element, onUpdateElement }) => {
  const handleChange = (key: string, value: any) => {
    onUpdateElement(element.id, { [key]: value });
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    onUpdateElement(element.id, { textAlign: align });
  };

  const handleFontStyleChange = (style: 'bold' | 'italic' | 'underline') => {
    if (style === 'bold') {
      onUpdateElement(element.id, { 
        fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' 
      });
    }
    // Add other style changes here
  };

  return (
    <>
      <div>
        <label className="block text-white/70 text-xs font-medium mb-1">Text Content</label>
        <textarea
          value={element.text || ''}
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
          value={element.fontSize || 24}
          onChange={(e) => handleChange('fontSize', Number(e.target.value))}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="block text-white/70 text-xs font-medium mb-1">Font Family</label>
        <select
          value={element.fontFamily || 'sans-serif'}
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
            value={element.color || '#ffffff'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-8 h-8 rounded border-0 bg-transparent"
          />
          <input
            type="text"
            value={element.color || '#ffffff'}
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
              element.textAlign === 'left' 
                ? 'bg-amber-500 text-black' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <AlignLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleTextAlignChange('center')}
            className={`flex-1 py-1.5 rounded-lg ${
              element.textAlign === 'center' || !element.textAlign
                ? 'bg-amber-500 text-black' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <AlignCenter className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleTextAlignChange('right')}
            className={`flex-1 py-1.5 rounded-lg ${
              element.textAlign === 'right' 
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
              element.fontWeight === 'bold' 
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
  );
};