import React, { useRef, useEffect, useState } from 'react';
import { CanvasElementType } from '../../types/cineflow';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Layers } from 'lucide-react';

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
  const timelineContentRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'move' | 'start' | 'end' | 'layer' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [startDuration, setStartDuration] = useState(0);
  const [startLayer, setStartLayer] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [customDuration, setCustomDuration] = useState(duration);
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<CanvasElementType | null>(null);

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

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingPlayhead(true);
    setStartPos({ x: e.clientX, y: e.clientY });

    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = Math.max(0, e.clientX - rect.left);
      const newTime = positionToTime(position);
      onTimeUpdate(Math.max(0, Math.min(newTime, effectiveDuration)));
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || isDraggingElement || isDraggingPlayhead) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = Math.max(0, e.clientX - rect.left);
    const newTime = positionToTime(clickPosition);
    onTimeUpdate(Math.max(0, Math.min(newTime, effectiveDuration)));
  };

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string, type: 'move' | 'start' | 'end') => {
    e.stopPropagation();
    e.preventDefault();

    setIsDraggingElement(elementId);
    setDragType(type);
    setStartPos({ x: e.clientX, y: e.clientY });

    const element = elements.find(el => el.id === elementId);
    if (element) {
      setStartTime(element.startTime);
      setStartDuration(element.duration);
      setStartLayer(element.layer || 0);
      onSelectElement(elementId);
    }
  };

  const handleLayerDragStart = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    e.preventDefault();

    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setIsDraggingElement(elementId);
    setDragType('layer');
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartLayer(element.layer || 0);
    setDraggedElement(element);
    onSelectElement(elementId);
    document.body.classList.add('dragging-layer');
  };

  const handleDragOver = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragType === 'layer' && isDraggingElement && isDraggingElement !== elementId) {
      setDragOverElementId(elementId);
    }
  };

  const handleDrop = (e: React.MouseEvent, targetElementId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragType === 'layer' && isDraggingElement && isDraggingElement !== targetElementId) {
      const sourceElement = elements.find(el => el.id === isDraggingElement);
      const targetElement = elements.find(el => el.id === targetElementId);

      if (sourceElement && targetElement) {
        const targetLayer = targetElement.layer || 0;
        onUpdateElement(sourceElement.id, { layer: targetLayer });
      }
    }

    setIsDraggingElement(null);
    setDragType(null);
    setDragOverElementId(null);
    setDraggedElement(null);
    document.body.classList.remove('dragging-layer');
  };

  const handleDragLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragOverElementId(null);
  };

  // Handle mouse move and mouse up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead) {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const position = Math.max(0, e.clientX - rect.left);
        const newTime = positionToTime(position);
        onTimeUpdate(Math.max(0, Math.min(newTime, effectiveDuration)));
      } else if (isDraggingElement && dragType && dragType !== 'layer') {
        const element = elements.find(el => el.id === isDraggingElement);
        if (!element) return;

        if (dragType === 'move') {
          if (!timelineRef.current) return;

          const rect = timelineRef.current.getBoundingClientRect();
          const position = Math.max(0, e.clientX - rect.left);
          let newTime = positionToTime(position - timeToPosition(element.duration) / 2);
          newTime = Math.max(0, Math.min(newTime, effectiveDuration - element.duration));
          onUpdateElement(isDraggingElement, { startTime: newTime });
        } else if (dragType === 'start') {
          const deltaPos = e.clientX - startPos.x;
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
          const deltaPos = e.clientX - startPos.x;
          const deltaTime = positionToTime(Math.abs(deltaPos)) * (deltaPos < 0 ? -1 : 1);

          let newDuration = Math.max(0.1, startDuration + deltaTime);
          const maxDuration = effectiveDuration - startTime;
          newDuration = Math.min(newDuration, maxDuration);

          onUpdateElement(isDraggingElement, { duration: newDuration });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      setIsDraggingElement(null);
      setDragType(null);
      setDragOverElementId(null);
      setDraggedElement(null);
      document.body.classList.remove('dragging-layer');
    };

    if (isDraggingPlayhead || isDraggingElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('dragging-layer');
    };
  }, [
    isDraggingPlayhead,
    isDraggingElement,
    dragType,
    startPos,
    startTime,
    startDuration,
    elements,
    effectiveDuration,
    onTimeUpdate,
    onUpdateElement,
    timelineWidth
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
    <div className="flex flex-col bg-gray-900/90 border-t border-white/10  ">
      {/* 1. TOP HEADER - STICKY BOTH VERTICALLY AND HORIZONTALLY */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-2 border-b border-white/10 flex-shrink-0 bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
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

      {/* 2. MAIN SCROLLABLE AREA - LAYERS AND TRACKS SCROLL TOGETHER */}
      <div className="flex-1 overflow-auto">
        <div className="flex" style={{ minWidth: `${Math.max(timelineWidth, 800)}px` }}>

          {/* 3. LAYERS PANEL - SCROLLS WITH TRACKS */}
          {showLayerPanel && (
            <div className="w-48 flex-shrink-0 border-r border-white/10 bg-gray-900/80">
              {/* Layer Panel Header - Sticky within the scrollable area */}
              <div className="sticky top-0 p-2 border-b border-white/10 bg-gray-900/90 z-30">
                <h3 className="text-white font-bold text-xs flex items-center">
                  <Layers className="w-3 h-3 mr-1" />
                  Layers ({elements.length})
                </h3>
              </div>

              {/* Layer Panel Content */}
              <div className="p-2 space-y-1">
                {sortedElements.map(element => (
                  <div
                    key={element.id}
                    data-id={element.id}
                    className={`flex items-center p-2 h-8 rounded-lg text-xs cursor-grab active:cursor-grabbing transition-colors ${selectedElementId === element.id
                      ? 'bg-amber-500/20 border border-amber-500/50'
                      : dragOverElementId === element.id
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'hover:bg-white/5 border border-transparent'
                      }`}
                    onClick={() => onSelectElement(element.id)}
                    onMouseDown={(e) => handleLayerDragStart(e, element.id)}
                    onMouseOver={(e) => handleDragOver(e, element.id)}
                    onMouseLeave={handleDragLeave}
                    onMouseUp={(e) => handleDrop(e, element.id)}
                  >
                    <div className="flex items-center space-x-2 overflow-hidden w-full">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${element.type === 'image' ? 'bg-blue-500' :
                        element.type === 'video' ? 'bg-red-500' :
                          element.type === 'audio' ? 'bg-purple-500' :
                            element.type === 'text' ? 'bg-green-500' :
                              'bg-amber-500'
                        }`}></span>
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

          {/* 4. TIMELINE CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* TIMELINE RULER - STICKY VERTICALLY, SCROLLS HORIZONTALLY */}
            <div className="sticky top-0 h-8 border-b border-white/10 relative flex-shrink-0 bg-gray-900/90  ">
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
              style={{ minHeight: '120px' }}
            >
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500   pointer-events-none"
                style={{ left: `${timeToPosition(currentTime)}px` }}
              >
                {/* Time Display */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2  ">
                  <div className="px-2 py-0.5 bg-gray-900 text-white  text-[10px] rounded shadow-lg border border-amber-500">
                    {formatTime(currentTime)}
                  </div>
                </div>


                {/* Playhead Drag Handle */}
                <div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-amber-500    cursor-ew-resize pointer-events-auto"
                  onMouseDown={handlePlayheadMouseDown}
                />
              </div>


              {/* Element timelines */}
              <div className="p-2 space-y-1">
                {sortedElements.map((element, index) => {
                  const isVisible = currentTime >= element.startTime &&
                    currentTime < (element.startTime + element.duration);

                  const elementWidth = Math.max(20, timeToPosition(element.duration));
                  const elementLeft = timeToPosition(element.startTime);

                  return (
                    <div
                      key={element.id}
                      data-id={element.id}
                      className="relative h-8 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectElement(element.id);
                      }}
                    >
                      <div
                        className={`absolute h-8 rounded-lg flex items-center px-2 cursor-grab active:cursor-grabbing transition-all ${element.type === 'image' ? 'bg-blue-500/70 hover:bg-blue-500/80' :
                          element.type === 'video' ? 'bg-red-500/70 hover:bg-red-500/80' :
                            element.type === 'audio' ? 'bg-purple-500/70 hover:bg-purple-500/80' :
                              element.type === 'text' ? 'bg-green-500/70 hover:bg-green-500/80' :
                                'bg-amber-500/70 hover:bg-amber-500/80'
                          } ${selectedElementId === element.id ? 'ring-2 ring-amber-400' : ''
                          } ${isVisible ? 'opacity-100' : 'opacity-70'
                          }`}
                        style={{
                          left: `${elementLeft}px`,
                          width: `${elementWidth}px`
                        }}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'move')}
                      >
                        <span className="text-white text-xs truncate flex-1 pointer-events-none">
                          {element.name || `${element.type} ${element.id.slice(-4)}`}
                        </span>

                        {/* Resize handles */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-l-lg"
                          onMouseDown={(e) => handleElementMouseDown(e, element.id, 'start')}
                        ></div>
                        <div
                          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-r-lg"
                          onMouseDown={(e) => handleElementMouseDown(e, element.id, 'end')}
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