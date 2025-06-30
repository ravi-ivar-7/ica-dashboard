import React, { useRef, useEffect, useState } from 'react';
import { CanvasElementType } from '../../types/cineflow';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Plus, Minus } from 'lucide-react';

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
  onUpdateElement
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'move' | 'start' | 'end' | null>(null);
  const [startPos, setStartPos] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [startDuration, setStartDuration] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [customDuration, setCustomDuration] = useState(duration);

  // Update timeline width on resize
  useEffect(() => {
    const updateTimelineWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.clientWidth);
      }
    };
    
    updateTimelineWidth();
    window.addEventListener('resize', updateTimelineWidth);
    
    return () => {
      window.removeEventListener('resize', updateTimelineWidth);
    };
  }, []);

  // Update custom duration when duration changes
  useEffect(() => {
    setCustomDuration(duration);
  }, [duration]);

  // Calculate the maximum duration needed based on elements
  useEffect(() => {
    if (elements.length === 0) return;
    
    const maxEndTime = Math.max(...elements.map(el => el.startTime + el.duration));
    if (maxEndTime > customDuration) {
      setCustomDuration(Math.ceil(maxEndTime));
    }
  }, [elements, customDuration]);

  // Convert time to position
  const timeToPosition = (time: number) => {
    return (time / customDuration) * timelineWidth * zoom;
  };

  // Convert position to time
  const positionToTime = (position: number) => {
    return (position / (timelineWidth * zoom)) * customDuration;
  };

  // Format time as MM:SS.ms
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Handle playhead drag
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingPlayhead(true);
    setStartPos(e.clientX);
  };

  // Handle timeline click (scrub)
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newTime = positionToTime(clickPosition);
    
    onTimeUpdate(Math.max(0, Math.min(newTime, customDuration)));
  };

  // Handle element drag
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string, type: 'move' | 'start' | 'end') => {
    e.stopPropagation();
    setIsDraggingElement(elementId);
    setDragType(type);
    setStartPos(e.clientX);
    
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setStartTime(element.startTime);
      setStartDuration(element.duration);
    }
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead) {
        if (!timelineRef.current) return;
        
        const rect = timelineRef.current.getBoundingClientRect();
        const position = e.clientX - rect.left;
        const newTime = positionToTime(position);
        
        onTimeUpdate(Math.max(0, Math.min(newTime, customDuration)));
      } else if (isDraggingElement && dragType) {
        const deltaPos = e.clientX - startPos;
        const deltaTime = positionToTime(deltaPos);
        
        const element = elements.find(el => el.id === isDraggingElement);
        if (!element) return;
        
        if (dragType === 'move') {
          // Move the entire element
          let newStartTime = startTime + deltaTime;
          newStartTime = Math.max(0, Math.min(newStartTime, customDuration - element.duration));
          
          onUpdateElement(isDraggingElement, { startTime: newStartTime });
        } else if (dragType === 'start') {
          // Adjust start time and duration
          let newStartTime = startTime + deltaTime;
          newStartTime = Math.max(0, Math.min(newStartTime, startTime + startDuration - 0.1));
          
          const newDuration = startDuration - (newStartTime - startTime);
          
          onUpdateElement(isDraggingElement, { 
            startTime: newStartTime,
            duration: newDuration
          });
        } else if (dragType === 'end') {
          // Adjust duration
          let newDuration = startDuration + deltaTime;
          newDuration = Math.max(0.1, Math.min(newDuration, customDuration - startTime));
          
          onUpdateElement(isDraggingElement, { duration: newDuration });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      setIsDraggingElement(null);
      setDragType(null);
    };

    if (isDraggingPlayhead || isDraggingElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPlayhead, isDraggingElement, dragType, startPos, startTime, startDuration, elements, customDuration, onTimeUpdate, onUpdateElement]);

  // Zoom in/out
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  // Update custom duration
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Number(e.target.value);
    if (newDuration >= 1) {
      setCustomDuration(newDuration);
    }
  };

  return (
    <div className="flex flex-col bg-gray-900/90 border-t border-white/10">
      {/* Timeline controls */}
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center space-x-1 text-white/80 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatTime(currentTime)} / {formatTime(customDuration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              disabled={zoom <= 0.5}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white/80 text-xs">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              disabled={zoom >= 5}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-white/80 text-xs">Duration:</span>
            <input
              type="number"
              min="1"
              value={customDuration}
              onChange={handleDurationChange}
              className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
            />
            <span className="text-white/80 text-xs">s</span>
          </div>
        </div>
      </div>

      {/* Timeline ruler */}
      <div className="h-6 border-b border-white/10 relative">
        <div className="absolute inset-0 flex">
          {Array.from({ length: Math.ceil(customDuration) + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 border-l border-white/20 h-full relative"
              style={{ width: `${timeToPosition(1)}px` }}
            >
              <span className="absolute bottom-1 left-1 text-white/50 text-[10px]">{i}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline content */}
      <div 
        className="flex-1 min-h-[120px] overflow-y-auto relative"
        ref={timelineRef}
        onClick={handleTimelineClick}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
          style={{ left: `${timeToPosition(currentTime)}px` }}
          onMouseDown={handlePlayheadMouseDown}
        >
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-500 rounded-full cursor-ew-resize"></div>
        </div>
        
        {/* Element timelines */}
        <div className="p-2 space-y-2" style={{ width: `${timelineWidth * zoom}px`, minWidth: '100%' }}>
          {elements.map(element => (
            <div 
              key={element.id}
              className={`h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                selectedElementId === element.id ? 'border border-amber-500' : ''
              }`}
              onClick={() => onSelectElement(element.id)}
            >
              {/* Element info */}
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-2 pointer-events-none">
                <span className="text-white/80 text-xs truncate max-w-[100px]">{element.name || element.type}</span>
              </div>
              
              {/* Element timeline bar */}
              <div 
                className={`absolute h-10 rounded-lg ${
                  element.type === 'image' ? 'bg-blue-500/70' :
                  element.type === 'video' ? 'bg-red-500/70' :
                  element.type === 'audio' ? 'bg-purple-500/70' :
                  element.type === 'text' ? 'bg-green-500/70' :
                  'bg-amber-500/70'
                } flex items-center px-2`}
                style={{ 
                  left: `${timeToPosition(element.startTime)}px`,
                  width: `${timeToPosition(element.duration)}px`,
                }}
                onMouseDown={(e) => handleElementMouseDown(e, element.id, 'move')}
              >
                <span className="text-white text-xs truncate max-w-full">
                  {element.name || element.type}
                </span>
                
                {/* Resize handles */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
                  onMouseDown={(e) => handleElementMouseDown(e, element.id, 'start')}
                ></div>
                <div 
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                  onMouseDown={(e) => handleElementMouseDown(e, element.id, 'end')}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;