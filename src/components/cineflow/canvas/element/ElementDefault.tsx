// /canva/elements/ElementDefault.tsx
import React from 'react';
import { CanvasElementType } from '@/types/cineflow';

interface ElementDefaultProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ElementDefault: React.FC<ElementDefaultProps> = ({ element, onSelect }) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <img
      src={element.src || '/icons/placeholder.png'}
      alt={element.name || 'Asset'}
      className="w-full h-full object-contain"
      onClick={handleSelect}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
};

export default ElementDefault;