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
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasPos, setCanvasPos] = useState({ x: 0, y: 0 });

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

  // Handle canvas resize
  const handleCanvasResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = canvasSize.width;
    const startHeight = canvasSize.height;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      // Calculate new dimensions based on resize direction
      if (direction.includes('right')) {
        newWidth = Math.max(200, startWidth + deltaX);
      } else if (direction.includes('left')) {
        newWidth = Math.max(200, startWidth - deltaX);
      }
      
      if (direction.includes('bottom')) {
        newHeight = Math.max(200, startHeight + deltaY);
      } else if (direction.includes('top')) {
        newHeight = Math.max(200, startHeight - deltaY);
      }
      
      // Maintain aspect ratio if needed
      const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
      if (direction === 'right' || direction === 'left') {
        newHeight = newWidth * (aspectHeight / aspectWidth);
      } else if (direction === 'bottom' || direction === 'top') {
        newWidth = newHeight * (aspectWidth / aspectHeight);
      }
      
      setCanvasSize({ width: newWidth, height: newHeight });
      setScale(newWidth / 1920);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle canvas dragging
  const handleCanvasDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target !== canvasRef.current) return;
    
    setIsDraggingCanvas(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCanvas) return;
      
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      setCanvasPos(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setStartPos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDraggingCanvas(false);
    };
    
    if (isDraggingCanvas) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCanvas, startPos]);

  // Sort elements by layer for proper stacking
  const sortedElements = [...elements].sort((a, b) => {
    const layerA = a.layer || 0;
    const layerB = b.layer || 0;
    return layerA - layerB;
  });

  // Filter out audio elements from visual display
  const visualElements = sortedElements.filter(element => element.type !== 'audio');

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-900">
      <div
        ref={canvasRef}
        className="relative bg-black shadow-2xl cursor-move"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          transform: `scale(${scale}) translate(${canvasPos.x}px, ${canvasPos.y}px)`,
          transformOrigin: 'center',
        }}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseDown={handleCanvasDragStart}
      >
        {/* Canvas elements - only render visual elements */}
        {visualElements.map(element => {
          // Check if element should be visible based on timeline
          const isVisible = currentTime >= element.startTime && 
                           currentTime < (element.startTime + element.duration);
          
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
        })}
        
        {/* Resize handles */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-amber-500 rounded-full cursor-ne-resize -translate-x-1/2 -translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'right-top')}></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-500 rounded-full cursor-se-resize -translate-x-1/2 translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'right-bottom')}></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-amber-500 rounded-full cursor-sw-resize translate-x-1/2 translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'left-bottom')}></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-amber-500 rounded-full cursor-nw-resize translate-x-1/2 -translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'left-top')}></div>
        
        <div className="absolute top-0 right-1/2 w-4 h-4 bg-amber-500 rounded-full cursor-n-resize translate-x-1/2 -translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'top')}></div>
        <div className="absolute bottom-0 right-1/2 w-4 h-4 bg-amber-500 rounded-full cursor-s-resize translate-x-1/2 translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'bottom')}></div>
        <div className="absolute top-1/2 right-0 w-4 h-4 bg-amber-500 rounded-full cursor-e-resize -translate-x-1/2 -translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'right')}></div>
        <div className="absolute top-1/2 left-0 w-4 h-4 bg-amber-500 rounded-full cursor-w-resize translate-x-1/2 -translate-y-1/2"
             onMouseDown={(e) => handleCanvasResize(e, 'left')}></div>
      </div>
    </div>
  );
};

export default Canvas;