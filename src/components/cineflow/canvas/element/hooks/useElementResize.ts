// /canva/elements/hooks/useElementResize.ts
import { useState, useEffect } from 'react';
import { CanvasElementType } from '@/types/cineflow';

interface UseElementResizeProps {
  element: CanvasElementType;
  onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
}

const useElementResize = ({ element, onUpdate }: UseElementResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchStartSize, setTouchStartSize] = useState({ width: 0, height: 0 });
  const [touchStartElementPos, setTouchStartElementPos] = useState({ x: 0, y: 0 });

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: element.width, height: element.height });
    setStartPosition({ x: element.x, y: element.y });
  };

  const handleResizeTouchStart = (e: React.TouchEvent, direction: string) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setTouchStartElementPos({ x: element.x, y: element.y });
      setTouchStartSize({ width: element.width, height: element.height });
      setResizeDirection(direction);
      setIsResizing(true);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeDirection) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = element.width;
      let newHeight = element.height;
      let newX = element.x;
      let newY = element.y;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(50, startSize.width + deltaX);
      } else if (resizeDirection.includes('left')) {
        newWidth = Math.max(50, startSize.width - deltaX);
        newX = startPosition.x + (startSize.width - newWidth);
      }

      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(50, startSize.height + deltaY);
      } else if (resizeDirection.includes('top')) {
        newHeight = Math.max(50, startSize.height - deltaY);
        newY = startPosition.y + (startSize.height - newHeight);
      }

      onUpdate(element.id, { width: newWidth, height: newHeight, x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing || !resizeDirection || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.x;
      const deltaY = touch.clientY - touchStartPos.y;

      let newWidth = element.width;
      let newHeight = element.height;
      let newX = element.x;
      let newY = element.y;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(50, touchStartSize.width + deltaX);
      } else if (resizeDirection.includes('left')) {
        newWidth = Math.max(50, touchStartSize.width - deltaX);
        newX = touchStartElementPos.x + (touchStartSize.width - newWidth);
      }

      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(50, touchStartSize.height + deltaY);
      } else if (resizeDirection.includes('top')) {
        newHeight = Math.max(50, touchStartSize.height - deltaY);
        newY = touchStartElementPos.y + (touchStartSize.height - newHeight);
      }

      onUpdate(element.id, { width: newWidth, height: newHeight, x: newX, y: newY });
      e.preventDefault();
    };

    const handleEnd = () => {
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing, resizeDirection, startPos, startSize, startPosition, touchStartPos, touchStartSize, touchStartElementPos, element, onUpdate]);

  return {
    isResizing,
    resizeDirection,
    handleResizeStart,
    handleResizeTouchStart
  };
};

export default useElementResize;