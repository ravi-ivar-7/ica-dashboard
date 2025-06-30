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
  const [canvasBounds, setCanvasBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

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
      
      // Apply zoom level
      width = width * zoomLevel;
      height = height * zoomLevel;
      
      setCanvasSize({ width, height });
      setScale(width / 1920); // Assuming 1920 is the base width
      
      // Update canvas boundaries
      setCanvasBounds({
        left: 0,
        top: 0,
        right: width,
        bottom: height
      });
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [aspectRatio, zoomLevel]);
  
  // Listen for double-clicked assets
  useEffect(() => {
    const handleAssetDoubleClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const asset = customEvent.detail;
      
      if (!canvasRef.current) return;
      
      // Calculate center position of canvas
      const centerX = canvasSize.width / (2 * scale);
      const centerY = canvasSize.height / (2 * scale);
      
      // Add asset to canvas at center position
      onDropAsset(asset, { x: centerX - 150, y: centerY - 100 });
    };
    
    document.addEventListener('asset-double-clicked', handleAssetDoubleClick);
    
    return () => {
      document.removeEventListener('asset-double-clicked', handleAssetDoubleClick);
    };
  }, [onDropAsset, scale, canvasSize]);

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
      
      // Ensure the position is within canvas bounds
      const boundedX = Math.max(0, Math.min(x, canvasBounds.right - 100));
      const boundedY = Math.max(0, Math.min(y, canvasBounds.bottom - 100));
      
      onDropAsset(assetData, { x: boundedX, y: boundedY });
    } catch (error) {
      console.error('Error parsing dropped asset:', error);
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle canvas resize
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
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

  return (
    <div className="relative flex-1 flex items-center justify-center w-full h-full overflow-hidden bg-gray-900" ref={containerRef}>
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-20 bg-black/50 rounded-lg p-2">
        <button 
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          disabled={zoomLevel <= 0.5}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <span className="text-white/80 text-xs">{Math.round(zoomLevel * 100)}%</span>
        <button 
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          disabled={zoomLevel >= 2}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div
        ref={canvasRef}
        className="relative bg-black shadow-2xl"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
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
              canvasBounds={canvasBounds}
            />
          );
        })}

        {/* Resize handles for the canvas itself */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 bg-amber-500/50 rounded-tl-lg cursor-nwse-resize"
          onMouseDown={(e) => handleResizeStart(e, 'bottomright')}
        ></div>
      </div>

      {/* Canvas resize handler */}
      {isResizing && (
        <div 
          className="fixed inset-0 z-50 cursor-nwse-resize"
          onMouseMove={(e) => {
            if (isResizing && containerRef.current) {
              const deltaX = e.clientX - startPos.x;
              const deltaY = e.clientY - startPos.y;
              
              // Calculate new size while maintaining aspect ratio
              const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
              const aspectRatio1 = aspectWidth / aspectHeight;
              
              // Determine which dimension to prioritize based on drag direction
              let newWidth, newHeight;
              if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newWidth = Math.max(200, startSize.width + deltaX);
                newHeight = newWidth / aspectRatio1;
              } else {
                newHeight = Math.max(150, startSize.height + deltaY);
                newWidth = newHeight * aspectRatio1;
              }
              
              // Calculate new zoom level
              const containerWidth = containerRef.current.clientWidth;
              const containerHeight = containerRef.current.clientHeight;
              
              let baseWidth, baseHeight;
              if (containerWidth / containerHeight > aspectRatio1) {
                baseHeight = containerHeight * 0.9;
                baseWidth = baseHeight * aspectRatio1;
              } else {
                baseWidth = containerWidth * 0.9;
                baseHeight = baseWidth / aspectRatio1;
              }
              
              const newZoomLevel = newWidth / baseWidth;
              setZoomLevel(Math.max(0.5, Math.min(2, newZoomLevel)));
            }
          }}
          onMouseUp={() => {
            setIsResizing(false);
          }}
          onMouseLeave={() => {
            setIsResizing(false);
          }}
        />
      )}
    </div>
  );
};

export default Canvas;