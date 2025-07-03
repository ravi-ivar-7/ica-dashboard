import { useState, useCallback } from 'react';
import { snapToGrid as snapToGridUtil } from '../utils/coordinates';

export interface UseCanvasGridProps {
  gridSize?: number;
}

export interface UseCanvasGridReturn {
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  setShowGrid: (show: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  snapToGridIfEnabled: (value: number) => number;
}

const DEFAULT_GRID_SIZE = 20;

export function useCanvasGrid({ gridSize = DEFAULT_GRID_SIZE }: UseCanvasGridProps = {}): UseCanvasGridReturn {
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);

  const snapToGridIfEnabled = useCallback((value: number) => {
    return snapToGridUtil(value, gridSize, snapToGrid);
  }, [snapToGrid, gridSize]);

  return {
    showGrid,
    snapToGrid,
    gridSize,
    setShowGrid,
    setSnapToGrid,
    snapToGridIfEnabled
  };
}