import { useEffect, useCallback } from 'react';
import { screenToLogical, CanvasTransform, Size } from '../utils/coordinates';

export interface UseCanvasDropProps {
  canvasRef: React.RefObject<HTMLElement>;
  canvasSize: Size;
  transform: CanvasTransform;
  showGrid: boolean;
  snapToGrid: boolean;
  snapToGridIfEnabled: (value: number) => number;
  onDropAsset: (asset: any, position: { x: number; y: number }) => void;
}

export interface UseCanvasDropReturn {
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

export function useCanvasDrop(props: UseCanvasDropProps): UseCanvasDropReturn {
  const {
    canvasRef,
    canvasSize,
    transform,
    showGrid,
    snapToGrid,
    snapToGridIfEnabled,
    onDropAsset
  } = props;

  // Listen for double-clicked assets
  useEffect(() => {
    const handleAssetDoubleClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const asset = customEvent.detail;

      if (!canvasRef.current) return;

      onDropAsset(asset, { x: canvasSize.width / 3, y: canvasSize.height / 3 });
    };

    document.addEventListener('asset-double-clicked', handleAssetDoubleClick);

    return () => {
      document.removeEventListener('asset-double-clicked', handleAssetDoubleClick);
    };
  }, [onDropAsset, canvasSize]);

  // Handle drag over (prevent default to allow drop)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drop (add new element)
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const assetDataString = e.dataTransfer.getData('application/json');

      if (!assetDataString || assetDataString.trim() === '') {
        console.warn('No asset data found in drop event');
        return;
      }

      const assetData = JSON.parse(assetDataString);

      if (!canvasRef.current) {
        console.warn('Canvas ref not available');
        return;
      }

      // Convert mouse position to logical coordinates
      const logicalPosition = screenToLogical(
        e.clientX,
        e.clientY,
        canvasRef.current,
        transform
      );

      // Apply snap to grid if enabled
      const finalX = (snapToGrid && showGrid) 
        ? snapToGridIfEnabled(logicalPosition.x) 
        : logicalPosition.x;
      const finalY = (snapToGrid && showGrid) 
        ? snapToGridIfEnabled(logicalPosition.y) 
        : logicalPosition.y;

      // Clamp to canvas bounds (assuming default element size)
      const elementWidth = 300; // Default width, adjust as needed
      const elementHeight = 200; // Default height, adjust as needed

      const clampedX = Math.max(0, Math.min(finalX, BASE_WIDTH - elementWidth));
      const clampedY = Math.max(0, Math.min(finalY, BASE_HEIGHT - elementHeight));

      onDropAsset(assetData, { x: clampedX, y: clampedY });
    } catch (error) {
      console.error('Error parsing dropped asset:', error);
    }
  }, [canvasRef, transform, showGrid, snapToGrid, snapToGridIfEnabled, onDropAsset]);

  return {
    handleDragOver,
    handleDrop
  };
}