import React, { useState, useRef, useEffect, useCallback } from 'react';
import CanvasElement from './CanvasElement';
import { CanvasElementType } from '@/types/cineflow';

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

function getComplementColor(hex: string) {
  if (!hex || hex.length < 7) return '#ffffff';
  const r = 255 - parseInt(hex.slice(1, 3), 16);
  const g = 255 - parseInt(hex.slice(3, 5), 16);
  const b = 255 - parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
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
  onDropAsset,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    elementId: string | null;
  }>({ visible: false, x: 0, y: 0, elementId: null });

  // New enhancement states
  const [backgroundColor, setBackgroundColor] = useState('#4a4a4a');

  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize] = useState(20);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [controlsExpanded, setControlsExpanded] = useState(false);

  // Base canvas dimensions (logical dimensions)
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;

  // Snap to grid helper function
  const snapToGridIfEnabled = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Calculate canvas dimensions based on aspect ratio and container size
  const updateCanvasSize = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Parse aspect ratio
    const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
    const aspectRatioValue = aspectWidth / aspectHeight;

    // Calculate maximum possible dimensions to use full container space
    const containerAspect = containerWidth / containerHeight;

    let width, height;
    if (containerAspect > aspectRatioValue) {
      // Container is wider - height is the limiting factor
      height = containerHeight * 0.95; // Use 95% to leave small margin
      width = height * aspectRatioValue;
    } else {
      // Container is taller - width is the limiting factor
      width = containerWidth * 0.95; // Use 95% to leave small margin
      height = width / aspectRatioValue;
    }

    setCanvasSize({ width, height });

    // Calculate scale based on the canvas width relative to base width
    setScale(width / BASE_WIDTH);
  }, [aspectRatio]);

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

  // Hide context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.visible]);

  // Listen for double-clicked assets - FIXED VERSION
  useEffect(() => {
    const handleAssetDoubleClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const asset = customEvent.detail;

      if (!canvasRef.current) return;

      onDropAsset(asset, { x: canvasSize.width/3, y: canvasSize.height/3 });
    };

    document.addEventListener('asset-double-clicked', handleAssetDoubleClick);

    return () => {
      document.removeEventListener('asset-double-clicked', handleAssetDoubleClick);
    };
  }, [onDropAsset, snapToGridIfEnabled, snapToGrid, showGrid]);

  // Zoom functionality with shift + mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;

      e.preventDefault();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
      setZoom(newZoom);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel);
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [zoom]);

  // Panning functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
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
  }, [isPanning, panStart]);

  // Convert screen coordinates to logical canvas coordinates
  const screenToLogical = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Get position relative to canvas
    const relativeX = screenX - canvasRect.left;
    const relativeY = screenY - canvasRect.top;
    
    // Account for zoom and pan
    const adjustedX = (relativeX / zoom) - (panOffset.x / zoom);
    const adjustedY = (relativeY / zoom) - (panOffset.y / zoom);
    
    // Convert from display coordinates to logical coordinates
    const logicalX = adjustedX / scale;
    const logicalY = adjustedY / scale;
    
    
    
    return { x: logicalX, y: logicalY };
  }, [scale, zoom, panOffset]);

  // Handle canvas click (deselect elements)
  const handleCanvasClick = () => {
    onSelectElement(null);
    setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
  };

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt + left click
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };
 
  // Handle drag over (prevent default to allow drop)
  const handleDragOver = (e: React.DragEvent) => {
    console.log('📋 handleDragOver called');
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle drop (add new element) - FIXED VERSION
  const handleDrop = (e: React.DragEvent) => {
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
      const logicalPosition = screenToLogical(e.clientX, e.clientY);
      
      // Apply snap to grid if enabled
      const finalX = (snapToGrid && showGrid) ? snapToGridIfEnabled(logicalPosition.x) : logicalPosition.x;
      const finalY = (snapToGrid && showGrid) ? snapToGridIfEnabled(logicalPosition.y) : logicalPosition.y;
      
      // Clamp to canvas bounds (assuming default element size)
      const elementWidth = 300; // Default width, adjust as needed
      const elementHeight = 200; // Default height, adjust as needed
      
      const clampedX = Math.max(0, Math.min(finalX, BASE_WIDTH - elementWidth));
      const clampedY = Math.max(0, Math.min(finalY, BASE_HEIGHT - elementHeight));
      
      onDropAsset(assetData, { x: clampedX, y: clampedY });
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

  // Reset view function
  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(5, prev * 1.2));
  const zoomOut = () => setZoom(prev => Math.max(0.1, prev / 1.2));

  // Grid SVG pattern
  const GridOverlay = () => {
    if (!showGrid) return null;

    const actualCanvasWidth = canvasSize.width;
    const actualCanvasHeight = canvasSize.height;
    const gridDotColor = getComplementColor(backgroundColor);

    return (
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={actualCanvasWidth}
        height={actualCanvasHeight}
        style={{ opacity: 1 }}
      >
        <defs>
          <pattern
            id="grid"
            width={gridSize * scale}
            height={gridSize * scale}
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.8" fill={gridDotColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-900"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Controls Panel */}
      <div className="absolute top-2 right-2 bg-gray-800 rounded-lg shadow-lg z-20    max-w-xs sm:max-w-sm md:max-w-md">
        {/* Sticky Header with toggle */}
        <div
          className="sticky top-0   flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer"
          onClick={() => setControlsExpanded(!controlsExpanded)}
        >
          <span className="w-4 h-4">⚙️</span>
          <svg
            className={`w-4 h-4 mx-1 pt-1 text-white transition-transform ${controlsExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Scrollable Collapsible Content */}
        {controlsExpanded && (
          <div className="max-h-[40vh] overflow-y-auto bg-gray-800 rounded-b-xl shadow-xl text-sm text-white p-4 pt-2 space-y-5">

            {/* Background Color */}
            <div className="space-y-1">
              <label className="block font-semibold">Background Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer shadow-sm"
                />
                <span className="text-gray-400 text-xs">Set canvas background</span>
              </div>
            </div>

            {/* Grid Toggle */}
            <div className="space-y-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="form-checkbox accent-amber-500"
                />
                Show Grid
              </label>
              <p className="text-gray-400 text-xs pl-5">Overlay grid for alignment</p>
            </div>

            {/* Snap To Grid */}
            <div className="space-y-1">
              <label className={`flex items-center gap-2 ${!showGrid ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="checkbox"
                  id="snapToGrid"
                  checked={snapToGrid}
                  disabled={!showGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="form-checkbox accent-amber-500"
                />
                Snap to Grid
              </label>
              <p className="text-gray-400 text-xs pl-5">Snap elements to nearest grid line</p>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-semibold">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={zoomOut}
                  className="flex-1 py-1 bg-gray-600 hover:bg-gray-500 rounded transition"
                >
                  − Zoom Out
                </button>
                <button
                  onClick={zoomIn}
                  className="flex-1 py-1 bg-gray-600 hover:bg-gray-500 rounded transition"
                >
                  ＋ Zoom In
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">Shift + Scroll to zoom</p>
            </div>

            {/* Reset View */}
            <div className="space-y-1">
              <button
                onClick={resetView}
                className="w-full py-1 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition"
              >
                Reset View
              </button>
              <p className="text-gray-400 text-xs text-center">Reset zoom and pan to default</p>
            </div>

            {/* Help */}
            <div className="pt-3 border-t border-gray-700 space-y-1">
              <h4 className="font-semibold text-sm">Quick Tips</h4>
              <ul className="text-xs text-gray-300 space-y-0.5 pl-4 list-disc">
                <li>Shift + Scroll: Zoom</li>
                <li>Alt + Drag / Middle Click: Pan</li>
                <li>Drag assets onto canvas</li>
                <li>Resize canvas from bottom-right corner</li>
                <li>Double-click: Center asset</li>
                <li>Right-click selected element: Context menu</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div
        ref={canvasRef}
        className="relative shadow-2xl"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
          transformOrigin: 'center',
          backgroundColor: backgroundColor,
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Grid Overlay */}
        <GridOverlay />

        {/* Canvas elements */}
        {sortedElements.map(element => {
          // Check if element should be visible based on timeline
          const isVisible = currentTime >= element.startTime &&
            currentTime < (element.startTime + element.duration);

          // Ensure element stays within logical canvas bounds
          const boundedElement = {
            ...element,
            x: Math.max(0, Math.min(element.x, BASE_WIDTH - element.width)),
            y: Math.max(0, Math.min(element.y, BASE_HEIGHT - element.height))
          };

          return (
            <div key={element.id} className="relative">
              <CanvasElement
                element={boundedElement}
                isSelected={selectedElementId === element.id}
                isPlaying={isPlaying}
                currentTime={currentTime}
                isVisible={isVisible}
                onSelect={onSelectElement}
                onUpdate={(id, updates) => {
                  // Apply snap to grid for position updates if snap is enabled
                  let snappedUpdates = { ...updates };
                  if (snapToGrid && showGrid) {
                    if (updates.x !== undefined) {
                      snappedUpdates.x = snapToGridIfEnabled(updates.x);
                    }
                    if (updates.y !== undefined) {
                      snappedUpdates.y = snapToGridIfEnabled(updates.y);
                    }
                  }

                  // Ensure updates keep element within logical canvas bounds
                  const updatedElement = { ...element, ...snappedUpdates };
                  const boundedUpdates = {
                    ...snappedUpdates,
                    x: snappedUpdates.x !== undefined ?
                      Math.max(0, Math.min(updatedElement.x, BASE_WIDTH - updatedElement.width)) :
                      undefined,
                    y: snappedUpdates.y !== undefined ?
                      Math.max(0, Math.min(updatedElement.y, BASE_HEIGHT - updatedElement.height)) :
                      undefined
                  };
                  onUpdateElement(id, boundedUpdates);
                }}
                onDelete={onDeleteElement}
              />
            </div>
          );
        })}

        {/* Bottom-right resize handle only */}
        <div
          className="absolute bottom-0 right-0 w-4 h-3 bg-blue-500 cursor-se-resize transform translate-x-1/2 translate-y-1/2"
          onMouseDown={handleResizeStart}
        ></div>
      </div>
    </div>
  );
};

export default Canvas;