import React, { useRef, useEffect, useState } from 'react';
import { CanvasElementType } from '../../types/cineflow';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Layers, GripVertical } from 'lucide-react';

interface TimelineProps {
  elements: CanvasElementType[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedElementId: string | null;
  onTimeUpdate: (time: number) => void;
  onPlayPause: () => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
  onDurationChange?: (duration: number) => void;
  showLayerPanel?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  elements,
  currentTime,
  duration,
  isPlaying,
  selectedElementId,
  onTimeUpdate,
  onPlayPause,
  onSelectElement,
  onUpdateElement,
  onDurationChange,
  showLayerPanel = true
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerPanelRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'move' | 'start' | 'end' | 'layer' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [startDuration, setStartDuration] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [customDuration, setCustomDuration] = useState(duration);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [touchDragY, setTouchDragY] = useState(0);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Math.max(1, Number(e.target.value));
    setCustomDuration(newDuration);

    if (onDurationChange) {
      onDurationChange(newDuration);
    }
  };

  const getEffectiveDuration = () => {
    if (elements.length === 0) return customDuration;

    const maxEndTime = Math.max(...elements.map(el => el.startTime + el.duration));
    return Math.max(customDuration, maxEndTime + 1);
  };

  const effectiveDuration = getEffectiveDuration();

  // Utility functions to disable/enable scrolling
  const disableScrolling = (horizontal: boolean = false, vertical: boolean = false) => {
    if (containerRef.current) {
      if (horizontal) {
        containerRef.current.style.overflowX = 'hidden';
      }
      if (vertical) {
        containerRef.current.style.overflowY = 'hidden';
      }
    }
    
    // Also disable body scrolling to prevent any interference
    if (vertical) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
  };

  const enableScrolling = () => {
    if (containerRef.current) {
      containerRef.current.style.overflowX = 'auto';
      containerRef.current.style.overflowY = 'auto';
    }
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };

  // Update timeline width on resize
  useEffect(() => {
    const updateTimelineWidth = () => {
      if (timelineRef.current) {
        const newWidth = timelineRef.current.clientWidth - 20;
        setTimelineWidth(Math.max(newWidth, 600));
      }
    };

    updateTimelineWidth();
    window.addEventListener('resize', updateTimelineWidth);
    return () => window.removeEventListener('resize', updateTimelineWidth);
  }, []);

  useEffect(() => {
    setCustomDuration(duration);
  }, [duration]);

  const timeToPosition = (time: number) => {
    if (timelineWidth === 0 || effectiveDuration === 0) return 0;
    return Math.max(0, (time / effectiveDuration) * timelineWidth);
  };

  const positionToTime = (position: number) => {
    if (timelineWidth === 0) return 0;
    return Math.max(0, (position / timelineWidth) * effectiveDuration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Touch and mouse event handlers
  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handlePlayheadStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const pos = getEventPosition(e);
    setIsDraggingPlayhead(true);
    setStartPos(pos);

    // Disable horizontal scrolling during playhead drag
    disableScrolling(true, false);

    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = Math.max(0, pos.x - rect.left);
      const newTime = positionToTime(position);
      onTimeUpdate(Math.max(0, Math.min(newTime, effectiveDuration)));
    }
  };

  const handleTimelineClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!timelineRef.current || isDraggingElement || isDraggingPlayhead || isResizing) return;

    const pos = getEventPosition(e);
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = Math.max(0, pos.x - rect.left);
    const newTime = positionToTime(clickPosition);
    onTimeUpdate(Math.max(0, Math.min(newTime, effectiveDuration)));
  };

  const handleElementStart = (e: React.MouseEvent | React.TouchEvent, elementId: string, type: 'move' | 'start' | 'end') => {
    e.stopPropagation();
    e.preventDefault();

    const pos = getEventPosition(e);
    setIsDraggingElement(elementId);
    setDragType(type);
    setStartPos(pos);
    setIsResizing(type === 'start' || type === 'end');

    // Disable horizontal scrolling during timeline element operations
    disableScrolling(true, false);

    const element = elements.find(el => el.id === elementId);
    if (element) {
      setStartTime(element.startTime);
      setStartDuration(element.duration);
      onSelectElement(elementId);
    }
  };

  const handleLayerDragStart = (e: React.MouseEvent | React.TouchEvent, elementId: string) => {
    e.stopPropagation();
    e.preventDefault();

    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const pos = getEventPosition(e);
    setDraggedElementId(elementId);
    setDragType('layer');
    setStartPos(pos);
    setTouchDragY(pos.y);
    
    // Disable vertical scrolling during layer rearrangement
    disableScrolling(false, true);
    
    onSelectElement(elementId);
  };

  // Helper function to get layer index from Y position
  const getLayerIndexFromY = (y: number) => {
    if (!layerPanelRef.current) return null;

    const layerElements = layerPanelRef.current.querySelectorAll('[data-layer-index]');
    let closestIndex = null;
    let closestDistance = Infinity;

    layerElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(y - elementCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const handleLayerDragOver = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedElementId && dragType === 'layer') {
      setDragOverIndex(index);
    }
  };

  const handleLayerDrop = (e: React.MouseEvent | React.TouchEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedElementId || dragType !== 'layer') return;

    const draggedElement = elements.find(el => el.id === draggedElementId);
    if (!draggedElement) return;

    // Create new layer order
    const sortedElements = [...elements].sort((a, b) => {
      const layerA = a.layer || 0;
      const layerB = b.layer || 0;
      return layerB - layerA;
    });

    // Remove dragged element from its current position
    const filteredElements = sortedElements.filter(el => el.id !== draggedElementId);
    
    // Insert at new position
    filteredElements.splice(dropIndex, 0, draggedElement);

    // Update layer values for all elements
    filteredElements.forEach((element, index) => {
      const newLayer = filteredElements.length - index - 1;
      onUpdateElement(element.id, { layer: newLayer });
    });

    setDraggedElementId(null);
    setDragOverIndex(null);
    setDragType(null);
  };

  // Handle mouse/touch move and end
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

      if (isDraggingPlayhead) {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const position = Math.max(0, pos.x - rect.left);
        const newTime = positionToTime(position);
        onTimeUpdate(Math.max(0, Math.min(newTime, effectiveDuration)));
      } else if (isDraggingElement && dragType && dragType !== 'layer') {
        const element = elements.find(el => el.id === isDraggingElement);
        if (!element) return;

        if (dragType === 'move') {
          if (!timelineRef.current) return;

          const rect = timelineRef.current.getBoundingClientRect();
          const position = Math.max(0, pos.x - rect.left);
          let newTime = positionToTime(position - timeToPosition(element.duration) / 2);
          newTime = Math.max(0, Math.min(newTime, effectiveDuration - element.duration));
          onUpdateElement(isDraggingElement, { startTime: newTime });
        } else if (dragType === 'start') {
          const deltaPos = pos.x - startPos.x;
          const deltaTime = positionToTime(Math.abs(deltaPos)) * (deltaPos < 0 ? -1 : 1);

          let newStartTime = Math.max(0, startTime + deltaTime);
          let newDuration = startDuration - deltaTime;

          if (newDuration < 0.1) {
            newDuration = 0.1;
            newStartTime = startTime + startDuration - 0.1;
          }

          onUpdateElement(isDraggingElement, {
            startTime: newStartTime,
            duration: newDuration
          });
        } else if (dragType === 'end') {
          const deltaPos = pos.x - startPos.x;
          const deltaTime = positionToTime(Math.abs(deltaPos)) * (deltaPos < 0 ? -1 : 1);

          let newDuration = Math.max(0.1, startDuration + deltaTime);
          const maxDuration = effectiveDuration - startTime;
          newDuration = Math.min(newDuration, maxDuration);

          onUpdateElement(isDraggingElement, { duration: newDuration });
        }
      } else if (draggedElementId && dragType === 'layer') {
        // Handle layer drag for touch
        setTouchDragY(pos.y);
        const layerIndex = getLayerIndexFromY(pos.y);
        if (layerIndex !== null) {
          setDragOverIndex(layerIndex);
        }
      }
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      // Handle layer drop for touch
      if (draggedElementId && dragType === 'layer') {
        const pos = 'touches' in e && e.changedTouches ? 
          { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : 
          'touches' in e ? { x: e.touches[0]?.clientX || touchDragY, y: e.touches[0]?.clientY || touchDragY } :
          { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };

        const layerIndex = getLayerIndexFromY(pos.y);
        if (layerIndex !== null) {
          handleLayerDrop(e as any, layerIndex);
        }
      }

      setIsDraggingPlayhead(false);
      setIsDraggingElement(null);
      setDragType(null);
      setDraggedElementId(null);
      setDragOverIndex(null);
      setIsResizing(false);
      setTouchDragY(0);

      // Re-enable all scrolling
      enableScrolling();
    };

    if (isDraggingPlayhead || isDraggingElement || draggedElementId) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [
    isDraggingPlayhead,
    isDraggingElement,
    draggedElementId,
    dragType,
    startPos,
    startTime,
    startDuration,
    elements,
    effectiveDuration,
    onTimeUpdate,
    onUpdateElement,
    timelineWidth,
    touchDragY
  ]);

  const sortedElements = [...elements].sort((a, b) => {
    const layerA = a.layer || 0;
    const layerB = b.layer || 0;
    return layerB - layerA;
  });

  const timelineMarkers = [];
  const markerInterval = effectiveDuration > 60 ? 10 : effectiveDuration > 30 ? 5 : 1;

  for (let i = 0; i <= effectiveDuration; i += markerInterval) {
    timelineMarkers.push(i);
  }

  return (
    <div className="flex flex-col bg-gray-900/90 border-t border-white/10">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 flex-shrink-0 bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors touch-manipulation"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="flex items-center space-x-1 text-white/80 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatTime(currentTime)} / {formatTime(effectiveDuration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-white/80 text-xs">Duration:</span>
            <input
              type="number"
              min="1"
              step="1"
              value={customDuration}
              onChange={handleDurationChange}
              className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
            />
            <span className="text-white/80 text-xs">s</span>
          </div>
        </div>
      </div>

      {/* MAIN SCROLLABLE AREA */}
      <div className="flex-1 overflow-auto" ref={containerRef}>
        <div className="flex" style={{ minWidth: `${Math.max(timelineWidth, 800)}px` }}>

          {/* LAYERS PANEL */}
          {showLayerPanel && (
            <div className="w-48 flex-shrink-0 border-r border-white/10 bg-gray-900/80">
              <div className="sticky top-0 p-2 border-b border-white/10 bg-gray-900/90">
                <h3 className="text-white font-bold text-xs flex items-center">
                  <Layers className="w-3 h-3 mr-1" />
                  Layers ({elements.length})
                </h3>
              </div>

              <div className="p-1 mx-1 space-y-1" ref={layerPanelRef}>
                {sortedElements.map((element, index) => (
                  <div
                    key={element.id}
                    data-layer-index={index}
                    className={`flex items-center rounded-lg text-xs transition-all ${
                      selectedElementId === element.id
                        ? 'bg-amber-500/20 border border-amber-500/50'
                        : dragOverIndex === index
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'hover:bg-white/5 border border-transparent'
                    } ${draggedElementId === element.id ? 'opacity-50' : ''}`}
                    onMouseOver={(e) => handleLayerDragOver(e, index)}
                    onMouseUp={(e) => handleLayerDrop(e, index)}
                  >
                    {/* Drag Handle */}
                    <div
                      className=" px-1 cursor-grab active:cursor-grabbing hover:bg-white/10 rounded-l-lg touch-manipulation"
                      onMouseDown={(e) => handleLayerDragStart(e, element.id)}
                      onTouchStart={(e) => handleLayerDragStart(e, element.id)}
                    >
                      <GripVertical className={` h-3 w-3 text-white/60 ${
                        element.type === 'image' ? 'bg-blue-500' :
                        element.type === 'video' ? 'bg-red-500' :
                        element.type === 'audio' ? 'bg-purple-500' :
                        element.type === 'text' ? 'bg-green-500' :
                        'bg-amber-500'
                      }`

                      } />
                    </div>

                    {/* Layer Content */}
                    <div
                      className="flex items-center overflow-hidden flex-1 p-1 cursor-pointer"
                      onClick={() => onSelectElement(element.id)}
                    > 
                      <span className="text-white/80 truncate">
                        {element.name || `${element.type} ${element.id.slice(-4)}`}
                      </span>
                    </div>
                  </div>
                ))}
                {elements.length === 0 && (
                  <div className="text-white/50 text-xs text-center py-4">
                    No elements added yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TIMELINE CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* TIMELINE RULER */}
            <div className="sticky top-0 h-8 border-b border-white/10 relative flex-shrink-0 bg-gray-900/90">
              <div className="absolute inset-0">
                {timelineMarkers.map((time) => (
                  <div
                    key={time}
                    className="absolute border-l border-white/20 h-full"
                    style={{ left: `${timeToPosition(time)}px` }}
                  >
                    <span className="absolute top-1 left-1 text-white/50 text-[10px] whitespace-nowrap">
                      {time}s
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE TRACKS */}
            <div
              className="flex-1 relative"
              ref={timelineRef}
              onClick={handleTimelineClick}
              onTouchStart={handleTimelineClick}
              style={{ minHeight: '120px' }}
            >
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500 pointer-events-none"
                style={{ left: `${timeToPosition(currentTime)}px` }}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="  py-0.5 bg-gray-900 text-white text-[10px] rounded shadow-lg border border-amber-500">
                    {formatTime(currentTime)}
                  </div>
                </div>

                <div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-amber-500 cursor-ew-resize pointer-events-auto touch-manipulation"
                  onMouseDown={handlePlayheadStart}
                  onTouchStart={handlePlayheadStart}
                />
              </div>

              {/* Element timelines */}
              <div className="  space-y-1">
                {sortedElements.map((element) => {
                  const isVisible = currentTime >= element.startTime &&
                    currentTime < (element.startTime + element.duration);

                  const elementWidth = Math.max(20, timeToPosition(element.duration));
                  const elementLeft = timeToPosition(element.startTime);

                  return (
                    <div
                      key={element.id}
                      className="relative h-7 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectElement(element.id);
                      }}
                    >
                      <div
                        className={`absolute h-6   flex items-center px-2 cursor-grab active:cursor-grabbing transition-all touch-manipulation ${
                          element.type === 'image' ? 'bg-blue-500/70 hover:bg-blue-500/80' :
                          element.type === 'video' ? 'bg-red-500/70 hover:bg-red-500/80' :
                          element.type === 'audio' ? 'bg-purple-500/70 hover:bg-purple-500/80' :
                          element.type === 'text' ? 'bg-green-500/70 hover:bg-green-500/80' :
                          'bg-amber-500/70 hover:bg-amber-500/80'
                        } ${selectedElementId === element.id ? 'ring-2 ring-amber-400' : ''
                        } ${isVisible ? 'opacity-100' : 'opacity-70'}`}
                        style={{
                          left: `${elementLeft}px`,
                          width: `${elementWidth}px`
                        }}
                        onMouseDown={(e) => handleElementStart(e, element.id, 'move')}
                        onTouchStart={(e) => handleElementStart(e, element.id, 'move')}
                      >
                        <span className="text-white text-xs truncate flex-1 pointer-events-none">
                          {element.name || `${element.type} ${element.id.slice(-4)}`}
                        </span>

                        {/* Resize handles */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-l-lg touch-manipulation"
                          onMouseDown={(e) => handleElementStart(e, element.id, 'start')}
                          onTouchStart={(e) => handleElementStart(e, element.id, 'start')}
                        ></div>
                        <div
                          className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-r-lg touch-manipulation"
                          onMouseDown={(e) => handleElementStart(e, element.id, 'end')}
                          onTouchStart={(e) => handleElementStart(e, element.id, 'end')}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                {elements.length === 0 && (
                  <div className="text-white/50 text-xs text-center py-8">
                    Add elements to see them on the timeline
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;