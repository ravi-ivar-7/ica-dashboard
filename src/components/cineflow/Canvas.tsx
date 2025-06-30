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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  // Calculate canvas dimensions based on aspect ratio and container size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      const container = containerRef.current;
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
      
      // Ensure the element stays within canvas bounds
      const boundedX = Math.max(0, Math.min(x, canvasSize.width / scale - 100));
      const boundedY = Math.max(0, Math.min(y, canvasSize.height / scale - 100));
      
      onDropAsset(assetData, { x: boundedX, y: boundedY });
    } catch (error) {
      console.error('Error parsing dropped asset:', error);
    }
  };

  // Handle canvas resize from bottom-right corner only
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: canvasSize.width, height: canvasSize.height });
  };

  // Sort elements by layer for proper stacking
  const sortedElements = [...elements].sort((a, b) => {
    const layerA = a.layer || 0;
    const layerB = b.layer || 0;
    return layerA - layerB;
  });

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startPos.x;
      
      // Calculate new dimensions based on aspect ratio
      const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
      const aspectRatioValue = aspectWidth / aspectHeight;
      
      // Resize from bottom-right corner only, maintaining aspect ratio
      let newWidth = Math.max(200, startSize.width + deltaX);
      let newHeight = newWidth / aspectRatioValue;
      
      // Update canvas size
      setCanvasSize({ width: newWidth, height: newHeight });
      setScale(newWidth / 1920); // Update scale based on new width
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

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-900"
    >
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
          
          // Ensure element stays within canvas bounds
          const boundedElement = {
            ...element,
            x: Math.max(0, Math.min(element.x, canvasSize.width / scale - element.width)),
            y: Math.max(0, Math.min(element.y, canvasSize.height / scale - element.height))
          };
          
          return (
            <CanvasElement
              key={element.id}
              element={boundedElement}
              isSelected={selectedElementId === element.id}
              isPlaying={isPlaying}
              currentTime={currentTime}
              isVisible={isVisible}
              onSelect={onSelectElement}
              onUpdate={(id, updates) => {
                // Ensure updates keep element within canvas bounds
                const updatedElement = { ...element, ...updates };
                const boundedUpdates = {
                  ...updates,
                  x: updates.x !== undefined ? 
                    Math.max(0, Math.min(updatedElement.x, canvasSize.width / scale - updatedElement.width)) : 
                    undefined,
                  y: updates.y !== undefined ? 
                    Math.max(0, Math.min(updatedElement.y, canvasSize.height / scale - updatedElement.height)) : 
                    undefined
                };
                onUpdateElement(id, boundedUpdates);
              }}
              onDelete={onDeleteElement}
            />
          );
        })}
        
        {/* Bottom-right resize handle only */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 bg-amber-500 rounded-full cursor-se-resize transform translate-x-1/2 translate-y-1/2"
          onMouseDown={handleResizeStart}
        ></div>
      </div>
    </div>
  );
};

export default Canvas;