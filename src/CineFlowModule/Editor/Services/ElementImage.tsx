// /canva/elements/ElementImage.tsx
import React from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface ElementImageProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ElementImage: React.FC<ElementImageProps> = ({ element, onSelect }) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <img
      src={element.src}
      alt={element.name || 'Image'}
      className="w-full h-full object-cover"
      onClick={handleSelect}
    />
  );
};

export default ElementImage;