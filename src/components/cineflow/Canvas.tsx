import React, { useState, useRef, useEffect } from 'react';
import CanvasElement from './CanvasElement';
import { CanvasElementType } from '../../types/cineflow';

interface CanvasProps {
  elements: CanvasElementType[];
  selectedElementId: string | null;
  aspectRatio: string;
  isPlaying: boolean;
  currentTime: number;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
  onDeleteElement: (id: string) => void;
  onDropAsset: (asset: any, position: { x: number, y: number }) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElementId,
  aspectRatio,
  isPlaying,
  currentTime,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDropAsset
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  // Calculate canvas dimensions based on aspect ratio and container size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const container = canvasRef.current.parentElement;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      let width, height;
      const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
      
      if (containerWidth / containerHeight > aspectWidth / aspectHeight) {
        // Container is wider than the aspect ratio
        height = containerHeight * 0.9;
        width = height * (aspectWidth / aspectHeight);
      } else {
        // Container is taller than the aspect ratio
        width = containerWidth * 0.9;
        height = width * (aspectHeight / aspectWidth);
      }
      
      setCanvasSize({ width, height });
      setScale(width / 1920); // Assuming 1920 is the base width
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [aspectRatio]);

  // Listen for double-clicked assets
  useEffect(() => {
    const handleAssetDoubleClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const asset = customEvent.detail;
      
      if (!canvasRef.current) return;
      
      // Calculate center position of canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = rect.width / (2 * scale);
      const centerY = rect.height / (2 * scale);
      
      // Add asset to canvas at center position
      onDropAsset(asset, { x: centerX - 150, y: centerY - 100 });
    };
    
    document.addEventListener('asset-double-clicked', handleAssetDoubleClick);
    
    return () => {
      document.removeEventListener('asset-double-clicked', handleAssetDoubleClick);
    };
  }, [onDropAsset, scale]);

  // Handle canvas click (deselect elements)
  const handleCanvasClick = () => {
    onSelectElement(null);
  };

  // Handle drag over (prevent default to allow drop)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle drop (add new element)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const assetDataString = e.dataTransfer.getData('application/json');
      
      // Check if we have valid data before parsing
      if (!assetDataString || assetDataString.trim() === '') {
        console.warn('No asset data found in drop event');
        return;
      }
      
      const assetData = JSON.parse(assetDataString);
      
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      
      onDropAsset(assetData, { x, y });
    } catch (error) {
      console.error('Error parsing dropped asset:', error);
    }
  };

  // Sort elements by layer for proper stacking
  const sortedElements = [...elements].sort((a, b) => {
    const layerA = a.layer || 0;
    const layerB = b.layer || 0;
    return layerA - layerB;
  });

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-900">
      <div
        ref={canvasRef}
        className="relative bg-black shadow-2xl"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Canvas elements */}
        {sortedElements.map(element => {
          // Check if element should be visible based on timeline
          const isVisible = currentTime >= element.startTime && 
                           currentTime < (element.startTime + element.duration);
          
          // Only render if visible or selected
          if (isVisible || selectedElementId === element.id) {
            return (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                isPlaying={isPlaying}
                currentTime={currentTime}
                isVisible={isVisible}
                onSelect={onSelectElement}
                onUpdate={onUpdateElement}
                onDelete={onDeleteElement}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Canvas;