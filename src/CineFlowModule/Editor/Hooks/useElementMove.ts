// /canva/elements/hooks/useElementMove.ts
import { useState, useEffect } from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface UseElementMoveProps {
  element: CanvasElementType;
  isSelected: boolean;
  isResizing: boolean;
  onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
}

const useElementMove = ({ element, isSelected, isResizing, onUpdate }: UseElementMoveProps) => {
  const [isMoving, setIsMoving] = useState(false);
  const [showPositionBar, setShowPositionBar] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchStartElementPos, setTouchStartElementPos] = useState({ x: 0, y: 0 });

  const handleMoveStart = (e: React.MouseEvent) => {
    if (isResizing || !isSelected) return;
    e.stopPropagation();
    setIsMoving(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartPosition({ x: element.x, y: element.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isResizing || !isSelected || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchStartElementPos({ x: element.x, y: element.y });
    setIsMoving(true);
    setShowPositionBar(true);
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isSelected && isMoving && !isResizing) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.x;
      const deltaY = touch.clientY - touchStartPos.y;
      const newX = touchStartElementPos.x + deltaX;
      const newY = touchStartElementPos.y + deltaY;
      onUpdate(element.id, { x: newX, y: newY });
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchEnd = () => {
    if (isMoving && !isResizing) {
      setIsMoving(false);
      setShowPositionBar(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoving || isResizing) return;
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const newX = startPosition.x + deltaX;
      const newY = startPosition.y + deltaY;
      onUpdate(element.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsMoving(false);
    };

    if (isMoving) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMoving, isResizing, startPos, startPosition, element.id, onUpdate]);

  return {
    isMoving,
    showPositionBar,
    handleMoveStart,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

export default useElementMove;