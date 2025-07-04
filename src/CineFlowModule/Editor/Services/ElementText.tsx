// /canva/elements/ElementText.tsx
import React from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface ElementTextProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ElementText: React.FC<ElementTextProps> = ({ element, onSelect }) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden"
      onClick={handleSelect}
      style={{
        color: element.color || 'white',
        fontFamily: element.fontFamily || 'sans-serif',
        fontSize: `${element.fontSize || 24}px`,
        fontWeight: element.fontWeight || 'normal',
        textAlign: element.textAlign || 'center',
        lineHeight: element.lineHeight || 1.2,
      }}
    >
      {element.text || 'Text Element'}
    </div>
  );
};

export default ElementText;