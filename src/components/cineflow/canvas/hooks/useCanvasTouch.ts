import { useState, useCallback } from 'react';
import { Position, Size } from '../utils/coordinates';

export interface UseCanvasTouchProps {
  selectedElementId: string | null;
  zoom: number;
  panOffset: Position;
  canvasSize: Size;
  isResizing: boolean;
  setPanOffset: (offset: Position | ((prev: Position) => Position)) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setCanvasSize: (size: Size) => void;
  setIsResizing: (resizing: boolean) => void;
  resetView: () => void;
}

export interface UseCanvasTouchReturn {
  isPinching: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleResizeTouchStart: (e: React.TouchEvent) => void;
  handleResizeTouchMove: (e: React.TouchEvent) => void;
  handleResizeTouchEnd: (e: React.TouchEvent) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const DOUBLE_TAP_THRESHOLD = 300;

export function useCanvasTouch(props: UseCanvasTouchProps): UseCanvasTouchReturn {
  const {
    selectedElementId,
    canvasSize,
    isResizing,
    setPanOffset,
    setZoom,
    setCanvasSize,
    setIsResizing,
    resetView
  } = props;

  const [touchStartPos, setTouchStartPos] = useState<Position>({ x: 0, y: 0 });
  const [touchStartDistance, setTouchStartDistance] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [resizeTouchStartPos, setResizeTouchStartPos] = useState<Position>({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState<Size>({ width: 0, height: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't handle touch events if an element is selected (let element handle it)
    if (selectedElementId) return;

    if (e.touches.length === 1) {
      // Single touch - for panning
      const touch = e.touches[0];
      setTouchStartPos({
        x: touch.clientX,
        y: touch.clientY
      });

      // Check for double tap to reset view
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTouchTime;
      if (tapLength < DOUBLE_TAP_THRESHOLD && tapLength > 0) {
        resetView();
      }
      setLastTouchTime(currentTime);
    } else if (e.touches.length === 2) {
      // Two touches - for pinch zoom
      e.preventDefault();
      setIsPinching(true);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDistance(distance);
    }
  }, [selectedElementId, lastTouchTime, resetView]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Don't handle touch events if an element is selected (let element handle it)
    if (selectedElementId) return;

    if (e.touches.length === 1 && !isPinching) {
      // Single touch pan
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.x;
      const deltaY = touch.clientY - touchStartPos.y;

      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2 && isPinching) {
      // Pinch zoom
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (touchStartDistance > 0) {
        const zoomFactor = distance / touchStartDistance;
        setZoom(prevZoom => {
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * zoomFactor));
          return newZoom;
        });
        setTouchStartDistance(distance);
      }
    }
  }, [selectedElementId, isPinching, touchStartPos, touchStartDistance, setPanOffset, setZoom]);

  const handleTouchEnd = useCallback(() => {
    setIsPinching(false);
    setTouchStartDistance(0);
  }, []);

  const handleResizeTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setResizeTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setResizeStartSize({ width: canvasSize.width, height: canvasSize.height });
      setIsResizing(true);
      e.stopPropagation();
      e.preventDefault();
    }
  }, [canvasSize, setIsResizing]);

  const handleResizeTouchMove = useCallback((e: React.TouchEvent) => {
    if (isResizing && e.touches.length === 1) {
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      const deltaX = touch.clientX - resizeTouchStartPos.x;
      const deltaY = touch.clientY - resizeTouchStartPos.y;

      // Use the larger delta to maintain aspect ratio
      const delta = Math.max(deltaX, deltaY);
      const newWidth = Math.max(200, resizeStartSize.width + delta);
      const aspectRatio = resizeStartSize.width / resizeStartSize.height;
      const newHeight = newWidth / aspectRatio;

      setCanvasSize({ width: newWidth, height: newHeight });
    }
  }, [isResizing, resizeTouchStartPos, resizeStartSize, setCanvasSize]);

  const handleResizeTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isResizing) {
      setIsResizing(false);
      e.stopPropagation();
      e.preventDefault();
    }
  }, [isResizing, setIsResizing]);

  return {
    isPinching,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleResizeTouchStart,
    handleResizeTouchMove,
    handleResizeTouchEnd
  };
}