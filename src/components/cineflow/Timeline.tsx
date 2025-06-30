import React, { useRef, useEffect, useState } from 'react';
import { CanvasElementType } from '../../types/cineflow';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Plus, Minus, Layers } from 'lucide-react';

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
  const timelineContentRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'move' | 'start' | 'end' | 'layer' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [startDuration, setStartDuration] = useState(0);
  const [startLayer, setStartLayer] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [zoom, setZoom] = useState(0.5);
  const [customDuration, setCustomDuration] = useState(duration);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<CanvasElementType | null>(null);

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
    setStartPos({ x: e.clientX, y: e.clientY });
    
    // Immediately update playhead position
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = e.clientX - rect.left;
      const newTime = positionToTime(position);
      onTimeUpdate(Math.max(0, Math.min(newTime, customDuration)));
    }
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
    e.preventDefault();
    
    setIsDraggingElement(elementId);
    setDragType(type);
    setStartPos({ x: e.clientX, y: e.clientY });
    
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setStartTime(element.startTime);
      setStartDuration(element.duration);
      setStartLayer(element.layer || 0);
      
      // Select the element when starting to drag
      onSelectElement(elementId);
      
      // Add dragging class to the element
      const timelineItem = (e.currentTarget as HTMLElement).closest('.timeline-item');
      if (timelineItem) {
        timelineItem.classList.add('dragging');
      }
    }
    
    // Immediately start updating position
    if (type === 'move' && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = e.clientX - rect.left;
      const element = elements.find(el => el.id === elementId);
      
      if (element) {
        const elementWidth = timeToPosition(element.duration);
        const maxPosition = timelineWidth - elementWidth;
        const newPosition = Math.max(0, Math.min(position - elementWidth / 2, maxPosition));
        const newTime = positionToTime(newPosition);
        
        onUpdateElement(elementId, { startTime: newTime });
      }
    }
  };

  // Start layer drag
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
    
    // Select the element when starting to drag
    onSelectElement(elementId);
    
    // Add dragging class to the element
    const timelineItem = (e.currentTarget as HTMLElement).closest('.timeline-item');
    if (timelineItem) {
      timelineItem.classList.add('dragging');
    }
    
    // Add a class to the body to indicate dragging
    document.body.classList.add('dragging-layer');
  };

  // Handle drag over for layer reordering
  const handleDragOver = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragType === 'layer' && isDraggingElement && isDraggingElement !== elementId) {
      setDragOverElementId(elementId);
    }
  };

  // Handle drop for layer reordering
  const handleDrop = (e: React.MouseEvent, targetElementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragType === 'layer' && isDraggingElement && isDraggingElement !== targetElementId) {
      const sourceElement = elements.find(el => el.id === isDraggingElement);
      const targetElement = elements.find(el => el.id === targetElementId);
      
      if (sourceElement && targetElement) {
        // Update the layer of the dragged element to be the same as the target
        const targetLayer = targetElement.layer || 0;
        
        // Reorder all elements
        const updatedElements = [...elements];
        
        // If moving up in the stack (higher layer number)
        if ((sourceElement.layer || 0) < targetLayer) {
          // Decrease layer value for elements between source and target
          updatedElements.forEach(el => {
            if (el.id !== sourceElement.id && 
                (el.layer || 0) <= targetLayer && 
                (el.layer || 0) > (sourceElement.layer || 0)) {
              onUpdateElement(el.id, { layer: (el.layer || 0) - 1 });
            }
          });
          
          // Set source element to target layer
          onUpdateElement(sourceElement.id, { layer: targetLayer });
        } 
        // If moving down in the stack (lower layer number)
        else if ((sourceElement.layer || 0) > targetLayer) {
          // Increase layer value for elements between target and source
          updatedElements.forEach(el => {
            if (el.id !== sourceElement.id && 
                (el.layer || 0) >= targetLayer && 
                (el.layer || 0) < (sourceElement.layer || 0)) {
              onUpdateElement(el.id, { layer: (el.layer || 0) + 1 });
            }
          });
          
          // Set source element to target layer
          onUpdateElement(sourceElement.id, { layer: targetLayer });
        }
      }
      
      // Reset drag state
      setIsDraggingElement(null);
      setDragType(null);
      setDragOverElementId(null);
      setDraggedElement(null);
      
      // Remove dragging class from all timeline items
      document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('dragging');
      });
    }
  };

  // Handle drag leave
  const handleDragLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragOverElementId(null);
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
        const element = elements.find(el => el.id === isDraggingElement);
        if (!element) return;
        
        if (dragType === 'move') {
          // Move the entire element
          if (!timelineRef.current) return;
          
          const rect = timelineRef.current.getBoundingClientRect();
          const position = e.clientX - rect.left;
          
          // Calculate new time based on mouse position
          let newTime = positionToTime(position - timeToPosition(element.duration) / 2);
          
          // Ensure the element stays within the timeline bounds
          newTime = Math.max(0, Math.min(newTime, customDuration - element.duration));
          
          onUpdateElement(isDraggingElement, { startTime: newTime });
        } else if (dragType === 'start') {
          // Adjust start time and duration
          const deltaPos = e.clientX - startPos.x;
          const deltaTime = positionToTime(deltaPos);
          
          let newStartTime = startTime + deltaTime;
          newStartTime = Math.max(0, Math.min(newStartTime, startTime + startDuration - 0.1));
          
          const newDuration = startDuration - (newStartTime - startTime);
          
          onUpdateElement(isDraggingElement, { 
            startTime: newStartTime,
            duration: newDuration
          });
        } else if (dragType === 'end') {
          // Adjust duration
          const deltaPos = e.clientX - startPos.x;
          const deltaTime = positionToTime(deltaPos);
          
          let newDuration = startDuration + deltaTime;
          newDuration = Math.max(0.1, Math.min(newDuration, customDuration - startTime));
          
          onUpdateElement(isDraggingElement, { duration: newDuration });
        } else if (dragType === 'layer') {
          // For layer dragging, we'll handle this in the dragOver and drop events
          // Just update the cursor position for visual feedback
          const timelineItems = document.querySelectorAll('.timeline-item');
          
          // Find the closest timeline item based on cursor position
          let closestItem: Element | null = null;
          let closestDistance = Infinity;
          
          timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = Math.abs(e.clientY - centerY);
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestItem = item;
            }
          });
          
          if (closestItem && closestDistance < 20) {
            const itemId = closestItem.getAttribute('data-id');
            if (itemId && itemId !== isDraggingElement) {
              setDragOverElementId(itemId);
            }
          } else {
            setDragOverElementId(null);
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (dragType === 'layer' && isDraggingElement && dragOverElementId) {
        // Perform the actual layer update
        const sourceElement = elements.find(el => el.id === isDraggingElement);
        const targetElement = elements.find(el => el.id === dragOverElementId);
        
        if (sourceElement && targetElement) {
          // Update the layer of the dragged element to be the same as the target
          const targetLayer = targetElement.layer || 0;
          
          // Reorder all elements
          const updatedElements = [...elements];
          
          // If moving up in the stack (higher layer number)
          if ((sourceElement.layer || 0) < targetLayer) {
            // Decrease layer value for elements between source and target
            updatedElements.forEach(el => {
              if (el.id !== sourceElement.id && 
                  (el.layer || 0) <= targetLayer && 
                  (el.layer || 0) > (sourceElement.layer || 0)) {
                onUpdateElement(el.id, { layer: (el.layer || 0) - 1 });
              }
            });
            
            // Set source element to target layer
            onUpdateElement(sourceElement.id, { layer: targetLayer });
          } 
          // If moving down in the stack (lower layer number)
          else if ((sourceElement.layer || 0) > targetLayer) {
            // Increase layer value for elements between target and source
            updatedElements.forEach(el => {
              if (el.id !== sourceElement.id && 
                  (el.layer || 0) >= targetLayer && 
                  (el.layer || 0) < (sourceElement.layer || 0)) {
                onUpdateElement(el.id, { layer: (el.layer || 0) + 1 });
              }
            });
            
            // Set source element to target layer
            onUpdateElement(sourceElement.id, { layer: targetLayer });
          }
        }
      }
      
      // Remove dragging class from all timeline items
      document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('dragging');
      });
      
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
    startLayer,
    elements, 
    customDuration, 
    onTimeUpdate, 
    onUpdateElement,
    dragOverElementId,
    timelineWidth,
    zoom
  ]);

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

  // Sort elements by layer for the timeline display
  const sortedElements = [...elements].sort((a, b) => {
    const layerA = a.layer || 0;
    const layerB = b.layer || 0;
    return layerB - layerA; // Highest layer at top
  });

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
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`p-1.5 rounded-lg ${showLayerPanel ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'} transition-colors`}
            title="Toggle Layer Panel"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          
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

      <div className="flex flex-1">
        {/* Layer Panel (when visible) */}
        {showLayerPanel && (
          <div className="w-48 border-r border-white/10 bg-gray-900/80 overflow-y-auto">
            <div className="p-2 border-b border-white/10">
              <h3 className="text-white font-bold text-xs flex items-center">
                <Layers className="w-3 h-3 mr-1" />
                Layers (Drag to Reorder)
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {sortedElements.map(element => (
                <div 
                  key={element.id}
                  className={`flex items-center p-1.5 rounded-lg text-xs cursor-grab active:cursor-grabbing ${
                    selectedElementId === element.id ? 'bg-amber-500/20 border border-amber-500/50' : 
                    dragOverElementId === element.id ? 'bg-blue-500/20 border border-blue-500/50' : 
                    'hover:bg-white/5 border border-transparent'
                  }`}
                  onClick={() => onSelectElement(element.id)}
                  onMouseDown={(e) => handleLayerDragStart(e, element.id)}
                  onMouseOver={(e) => handleDragOver(e, element.id)}
                  onMouseOut={handleDragLeave}
                  onMouseUp={(e) => handleDrop(e, element.id)}
                  draggable="true"
                >
                  <div className="flex items-center space-x-1 overflow-hidden">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      element.type === 'image' ? 'bg-blue-500' :
                      element.type === 'video' ? 'bg-red-500' :
                      element.type === 'audio' ? 'bg-purple-500' :
                      element.type === 'text' ? 'bg-green-500' :
                      'bg-amber-500'
                    }`}></span>
                    <span className="text-white/80 truncate">{element.name || element.type}</span>
                  </div>
                </div>
              ))}
              {elements.length === 0 && (
                <div className="text-white/50 text-xs text-center py-2">
                  No elements added yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline ruler and content */}
        <div className="flex-1 flex flex-col">
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
            <div 
              className="p-2 space-y-2" 
              style={{ width: `${timelineWidth * zoom}px`, minWidth: '100%' }}
              ref={timelineContentRef}
            >
              {sortedElements.map(element => {
                // Check if element should be visible based on timeline
                const isVisible = currentTime >= element.startTime && 
                                currentTime < (element.startTime + element.duration);
                
                return (
                  <div 
                    key={element.id}
                    data-id={element.id}
                    className={`timeline-item h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing ${
                      selectedElementId === element.id ? 'border border-amber-500' : 
                      dragOverElementId === element.id ? 'border border-blue-500' : ''
                    }`}
                    onClick={() => onSelectElement(element.id)}
                  >
                    {/* Layer indicator */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center bg-gray-800/50 rounded-l-lg cursor-ns-resize"
                      onMouseDown={(e) => handleLayerDragStart(e, element.id)}
                    >
                      <span className="text-white/60 text-[10px] font-mono">{element.layer || 0}</span>
                    </div>
                    
                    {/* Element info */}
                    <div className="absolute left-8 top-0 bottom-0 z-10 flex items-center pointer-events-none">
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
                      } flex items-center px-2 pl-8 ${isVisible ? 'opacity-100' : 'opacity-70'}`}
                      style={{ 
                        left: `${timeToPosition(element.startTime)}px`,
                        width: `${timeToPosition(element.duration)}px`,
                      }}
                      onMouseDown={(e) => handleElementMouseDown(e, element.id, 'move')}
                    >
                      <span className="text-white text-xs truncate max-w-full ml-6">
                        {element.name || element.type}
                      </span>
                      
                      {/* Resize handles */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize"
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'start')}
                      ></div>
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize"
                        onMouseDown={(e) => handleElementMouseDown(e, element.id, 'end')}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;