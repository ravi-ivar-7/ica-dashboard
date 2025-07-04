import React, { useState, useRef, useEffect } from 'react';
import CanvasElement from '@/CineFlowModule/Editor/Components/CanvasElement';
import CanvasControls from './CanvasControls';
import GridOverlay from './GridOverlay';
import PositionInfoBar from './CanvasLayoutInfoBar';
import CanvasResizeHandle from './CanvasResizeHandle';
import { useCanvasSize } from '../Hooks/useCanvasSize';
import { useCanvasZoom } from '../Hooks/useCanvasZoom';
import { useCanvasTouch } from '../Hooks/useCanvasTouch';
import { useCanvasGrid } from '../Hooks/useCanvasGrid';
import { useCanvasDrop } from '../Hooks/useCanvasDrop';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';
import { Position } from '../Utils/coordinates';

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

// Base canvas dimensions (logical dimensions)
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

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

    // Canvas state
    const [backgroundColor, setBackgroundColor] = useState('#4a4a4a');
    const [controlsExpanded, setControlsExpanded] = useState(false);
    const [mousePosition, setMousePosition] = useState<Position | undefined>();
    const [showPositionInfo, setShowPositionInfo] = useState(false);
    const [openPositionInfo, setOpenPositionInfo] = useState(false);

    // Context menu state
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        elementId: string | null;
    }>({ visible: false, x: 0, y: 0, elementId: null });

    // Custom hooks
    const {
        canvasSize,
        scale,
        isResizing,
        startResizing,
        setCanvasSize,
        setIsResizing
    } = useCanvasSize({
        aspectRatio,
        containerRef,
    });

    const {
        zoom,
        panOffset,
        isPanning,
        zoomIn,
        zoomOut,
        resetView,
        startPanning,
        setZoom,
        setPanOffset
    } = useCanvasZoom({ containerRef, selectedElementId });

    const { showGrid, snapToGrid, gridSize, setShowGrid, setSnapToGrid, snapToGridIfEnabled } = useCanvasGrid({
        gridSize: 20,
    });

    const { handleDragOver, handleDrop } = useCanvasDrop({
        canvasRef,
        canvasSize,
        transform: { scale, zoom, panOffset },
        showGrid,
        snapToGrid,
        snapToGridIfEnabled,
        onDropAsset,
    });

    const {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleResizeTouchStart,
        handleResizeTouchMove,
        handleResizeTouchEnd,
    } = useCanvasTouch({
        selectedElementId,
        zoom,
        panOffset,
        canvasSize,
        isResizing,
        setPanOffset,
        setZoom,
        setCanvasSize,
        setIsResizing,
        resetView,
    });

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

    // Handle canvas click (deselect elements)
    const handleCanvasClick = () => {
        onSelectElement(null);
        setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
    };

    // Handle mouse move for position tracking
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const relativeX = e.clientX - canvasRect.left;
        const relativeY = e.clientY - canvasRect.top;

        // Account for zoom and pan
        const adjustedX = (relativeX / zoom) - (panOffset.x / zoom);
        const adjustedY = (relativeY / zoom) - (panOffset.y / zoom);

        // Convert from display coordinates to logical coordinates
        const logicalX = adjustedX / scale;
        const logicalY = adjustedY / scale;

        setMousePosition({ x: logicalX, y: logicalY });
    };

    // Sort elements by layer for proper stacking
    const sortedElements = [...elements].sort((a, b) => {
        const layerA = a.layer || 0;
        const layerB = b.layer || 0;
        return layerA - layerB;
    });

    // Get selected element for position info
    const selectedElement = selectedElementId
        ? elements.find(el => el.id === selectedElementId)
        : undefined;
 

const togglePositionInfo = () => {
  setOpenPositionInfo(prev => !prev);
};

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-900"
            style={{ width: '100%', height: '100%', touchAction: 'none' }}
        >
            {/* Controls Panel */}
            <CanvasControls
                backgroundColor={backgroundColor}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
                zoom={zoom}
                controlsExpanded={controlsExpanded}
                setBackgroundColor={setBackgroundColor}
                setShowGrid={setShowGrid}
                setSnapToGrid={setSnapToGrid}
                setControlsExpanded={setControlsExpanded}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                resetView={resetView}
                 openPositionInfo={openPositionInfo}
                onTogglePositionInfo={() => setOpenPositionInfo(prev => !prev)}
            />

            {/* Position Info Bar */}
            <PositionInfoBar
                mousePosition={mousePosition}
                selectedElement={selectedElement}
                canvasSize={canvasSize}
                zoom={zoom}
                scale={scale}
                visible={showPositionInfo}
                openPositionInfo={openPositionInfo}
                  onTogglePositionInfo={togglePositionInfo}
            />


            {/* Canvas */}
            <div
                ref={canvasRef}
                className="relative shadow-2xl touch-none"
                style={{
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                    transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
                    transformOrigin: 'center',
                    backgroundColor: backgroundColor,
                    cursor: isPanning ? 'grabbing' : 'grab'
                }}
                onClick={handleCanvasClick}
                onMouseDown={startPanning}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowPositionInfo(true)}
                onMouseLeave={() => setShowPositionInfo(false)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Grid Overlay */}
                <GridOverlay
                    showGrid={showGrid}
                    canvasSize={canvasSize}
                    scale={scale}
                    backgroundColor={backgroundColor}
                    gridSize={gridSize}
                />

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

                {/* Canvas Resize Handle */}
                <CanvasResizeHandle
                    onResizeStart={startResizing}
                    onResizeTouchStart={handleResizeTouchStart}
                    onResizeTouchMove={handleResizeTouchMove}
                    onResizeTouchEnd={handleResizeTouchEnd}
                />
            </div>
        </div>
    );
};

export default Canvas;