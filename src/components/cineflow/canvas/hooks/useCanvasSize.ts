import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateCanvasSize, parseAspectRatio, Size } from '../utils/coordinates';

export interface UseCanvasSizeProps {
  aspectRatio: string;
  containerRef: React.RefObject<HTMLElement>;
}

export interface UseCanvasSizeReturn {
  canvasSize: Size;
  scale: number;
  isResizing: boolean;
  startResizing: (e: React.MouseEvent) => void;
  resetSize: () => void;
  setCanvasSize: (size: Size) => void;
  setIsResizing: (resizing: boolean) => void;
}

// Base canvas dimensions (logical dimensions)
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

export function useCanvasSize({ aspectRatio, containerRef }: UseCanvasSizeProps): UseCanvasSizeReturn {
  const [canvasSize, setCanvasSize] = useState<Size>({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState<Size>({ width: 0, height: 0 });
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Calculate canvas dimensions based on aspect ratio and container size
  const updateCanvasSize = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const aspectRatioValue = parseAspectRatio(aspectRatio);
    const newSize = calculateCanvasSize(containerWidth, containerHeight, aspectRatioValue);

    setCanvasSize(newSize);
    setScale(newSize.width / BASE_WIDTH);
  }, [aspectRatio, containerRef]);

  // Set up ResizeObserver for dynamic container size monitoring
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateCanvasSize]);

  // Initial canvas size calculation
  useEffect(() => {
    updateCanvasSize();
  }, [updateCanvasSize]);

  // Handle canvas resize from bottom-right corner
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: canvasSize.width, height: canvasSize.height });
  }, [canvasSize]);

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const aspectRatioValue = parseAspectRatio(aspectRatio);

      // Calculate new dimensions based on both X and Y movement
      // Use the movement that would result in a larger canvas
      const newWidthFromX = startSize.width + deltaX;
      const newHeightFromX = newWidthFromX / aspectRatioValue;
      
      const newHeightFromY = startSize.height + deltaY;
      const newWidthFromY = newHeightFromY * aspectRatioValue;

      // Choose the dimension that gives the larger canvas
      const areaFromX = newWidthFromX * newHeightFromX;
      const areaFromY = newWidthFromY * newHeightFromY;

      let newWidth, newHeight;
      if (areaFromX >= areaFromY) {
        newWidth = newWidthFromX;
        newHeight = newHeightFromX;
      } else {
        newWidth = newWidthFromY;
        newHeight = newHeightFromY;
      }

      // Update canvas size and scale
      setCanvasSize({ width: newWidth, height: newHeight });
      setScale(newWidth / BASE_WIDTH);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos, startSize, aspectRatio]);

  // Reset canvas size to fit container
  const resetSize = useCallback(() => {
    updateCanvasSize();
  }, [updateCanvasSize]);

  return {
    canvasSize,
    scale,
    isResizing,
    startResizing,
    resetSize,
    setCanvasSize,
    setIsResizing
  };
}