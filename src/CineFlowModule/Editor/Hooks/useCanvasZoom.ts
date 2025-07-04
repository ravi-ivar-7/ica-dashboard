import { useState, useEffect, useCallback } from 'react';
import { Position } from '../Utils/coordinates';

export interface UseCanvasZoomProps {
  containerRef: React.RefObject<HTMLElement>;
  selectedElementId: string | null;
}

export interface UseCanvasZoomReturn {
  zoom: number;
  panOffset: Position;
  isPanning: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  startPanning: (e: React.MouseEvent) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPanOffset: (offset: Position | ((prev: Position) => Position)) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_FACTOR = 1.2;

export function useCanvasZoom({ containerRef, selectedElementId }: UseCanvasZoomProps): UseCanvasZoomReturn {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });

  // Zoom functionality with shift + mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey || selectedElementId) return;

      e.preventDefault();

      const zoomFactor = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
      setZoom(newZoom);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [zoom, containerRef, selectedElementId]);

  // Panning functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && !selectedElementId) {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        setPanOffset(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart, selectedElementId]);

  // Start panning
  const startPanning = useCallback((e: React.MouseEvent) => {
    if (selectedElementId) return;
    
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [selectedElementId]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev * ZOOM_FACTOR));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev / ZOOM_FACTOR));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  return {
    zoom,
    panOffset,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    startPanning,
    setZoom,
    setPanOffset
  };
}