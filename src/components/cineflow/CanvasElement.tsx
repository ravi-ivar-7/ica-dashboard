import React, { useState, useRef, useEffect } from 'react';
import { CanvasElementType } from '../../types/cineflow';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  isPlaying: boolean;
  currentTime: number;
  isVisible: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
  onDelete: (id: string) => void;
  canvasBounds: { left: number; top: number; right: number; bottom: number };
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  isPlaying,
  currentTime,
  isVisible,
  onSelect,
  onUpdate,
  onDelete,
  canvasBounds
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [videoPlaybackBlocked, setVideoPlaybackBlocked] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle element selection
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  // Handle video click to play/pause
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
    
    if (element.type === 'video' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => {
          // Handle autoplay restrictions gracefully
          if (err.name === 'NotAllowedError' || err.message.includes('interrupted')) {
            setVideoPlaybackBlocked(true);
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Handle element movement
  const handleMoveStart = (e: React.MouseEvent) => {
    if (isResizing || !isSelected) return;
    e.stopPropagation();
    setIsMoving(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartPosition({ x: element.x, y: element.y });
  };

  // Handle element resizing
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: element.width, height: element.height });
    setStartPosition({ x: element.x, y: element.y });
  };

  // Handle mouse move for both resizing and moving
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizeDirection) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;
        
        // Calculate new width, height, and position based on resize direction
        let newWidth = element.width;
        let newHeight = element.height;
        let newX = element.x;
        let newY = element.y;
        
        // Handle different resize directions
        if (resizeDirection.includes('right')) {
          newWidth = Math.max(50, startSize.width + deltaX);
        } else if (resizeDirection.includes('left')) {
          const widthChange = Math.min(startSize.width - 50, deltaX);
          newWidth = Math.max(50, startSize.width - widthChange);
          newX = startPosition.x + widthChange;
        }
        
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(50, startSize.height + deltaY);
        } else if (resizeDirection.includes('top')) {
          const heightChange = Math.min(startSize.height - 50, deltaY);
          newHeight = Math.max(50, startSize.height - heightChange);
          newY = startPosition.y + heightChange;
        }
        
        // Ensure element stays within canvas bounds
        if (newX < canvasBounds.left) {
          const diff = canvasBounds.left - newX;
          newX = canvasBounds.left;
          if (resizeDirection.includes('left')) {
            newWidth = Math.max(50, newWidth - diff);
          }
        }
        
        if (newY < canvasBounds.top) {
          const diff = canvasBounds.top - newY;
          newY = canvasBounds.top;
          if (resizeDirection.includes('top')) {
            newHeight = Math.max(50, newHeight - diff);
          }
        }
        
        if (newX + newWidth > canvasBounds.right) {
          if (resizeDirection.includes('right')) {
            newWidth = canvasBounds.right - newX;
          } else {
            newX = canvasBounds.right - newWidth;
          }
        }
        
        if (newY + newHeight > canvasBounds.bottom) {
          if (resizeDirection.includes('bottom')) {
            newHeight = canvasBounds.bottom - newY;
          } else {
            newY = canvasBounds.bottom - newHeight;
          }
        }
        
        onUpdate(element.id, { 
          width: newWidth, 
          height: newHeight,
          x: newX,
          y: newY
        });
      } else if (isMoving) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;
        
        // Calculate new position
        let newX = startPosition.x + deltaX;
        let newY = startPosition.y + deltaY;
        
        // Ensure element stays within canvas bounds
        newX = Math.max(canvasBounds.left, Math.min(newX, canvasBounds.right - element.width));
        newY = Math.max(canvasBounds.top, Math.min(newY, canvasBounds.bottom - element.height));
        
        onUpdate(element.id, { 
          x: newX, 
          y: newY 
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsMoving(false);
      setResizeDirection(null);
    };

    if (isResizing || isMoving) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isResizing, 
    isMoving, 
    startPos, 
    startSize, 
    startPosition, 
    element, 
    onUpdate, 
    resizeDirection,
    canvasBounds
  ]);

  // Control video playback based on isPlaying state
  useEffect(() => {
    if (element.type === 'video' && videoRef.current) {
      if (isPlaying && isVisible) {
        videoRef.current.currentTime = currentTime - element.startTime;
        videoRef.current.play().catch(err => {
          // Handle autoplay restrictions gracefully without logging errors
          if (err.name === 'NotAllowedError' || err.message.includes('interrupted') || err.message.includes('background media')) {
            setVideoPlaybackBlocked(true);
            // Silently handle the autoplay restriction
            return;
          }
          // Only log unexpected errors
          console.warn('Unexpected video playback error:', err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentTime, element, isVisible]);

  // Reset video playback blocked state when user interacts
  const handleUserVideoInteraction = () => {
    if (videoPlaybackBlocked) {
      setVideoPlaybackBlocked(false);
    }
  };

  // Render different element types
  const renderElement = () => {
    switch (element.type) {
      case 'image':
        return (
          <img 
            src={element.src} 
            alt={element.name || 'Image'} 
            className="w-full h-full object-cover"
          />
        );
      case 'video':
        return (
          <div className="relative w-full h-full">
            <video 
              ref={videoRef}
              src={element.src}
              className="w-full h-full object-cover"
              onClick={handleVideoClick}
              onPlay={handleUserVideoInteraction}
              loop
              muted
              playsInline
              poster={element.poster}
            />
            {videoPlaybackBlocked && isSelected && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
                <div className="text-center">
                  <div className="mb-2">▶</div>
                  <div>Click to play</div>
                </div>
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{ 
              color: element.color || 'white',
              fontFamily: element.fontFamily || 'sans-serif',
              fontSize: `${element.fontSize || 24}px`,
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'center',
              lineHeight: element.lineHeight || 1.2,
            }}
          >
            {element.text || 'Text Element'}
          </div>
        );
      case 'element':
        return (
          <img 
            src={element.src} 
            alt={element.name || 'Element'} 
            className="w-full h-full object-contain"
          />
        );
      default:
        return <div className="w-full h-full bg-gray-500/30"></div>;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute transition-opacity duration-200 animate-fade-in ${isSelected ? 'z-10' : 'z-0'}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: isVisible ? (element.opacity || 1) : (isSelected ? 0.5 : 0),
        pointerEvents: isVisible || isSelected ? 'auto' : 'none',
        zIndex: element.layer || 0,
        display: (!isVisible && !isSelected) ? 'none' : 'block'
      }}
      onClick={handleSelect}
      onMouseDown={handleMoveStart}
    >
      {/* Element content */}
      <div className="w-full h-full overflow-hidden">
        {renderElement()}
      </div>
      
      {/* Selection border and resize handles */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-amber-500 pointer-events-none"></div>
          
          {/* Resize handles - 8 directions */}
          <div 
            className="absolute top-0 left-0 w-3 h-3 bg-amber-500 rounded-full cursor-nwse-resize -translate-x-1/2 -translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'topleft')}
          ></div>
          <div 
            className="absolute top-0 left-1/2 w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize -translate-x-1/2 -translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          ></div>
          <div 
            className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full cursor-nesw-resize translate-x-1/2 -translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'topright')}
          ></div>
          <div 
            className="absolute top-1/2 right-0 w-3 h-3 bg-amber-500 rounded-full cursor-ew-resize translate-x-1/2 -translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full cursor-nwse-resize translate-x-1/2 translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'bottomright')}
          ></div>
          <div 
            className="absolute bottom-0 left-1/2 w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize -translate-x-1/2 translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-3 h-3 bg-amber-500 rounded-full cursor-nesw-resize -translate-x-1/2 translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'bottomleft')}
          ></div>
          <div 
            className="absolute top-1/2 left-0 w-3 h-3 bg-amber-500 rounded-full cursor-ew-resize -translate-x-1/2 -translate-y-1/2"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          ></div>
        </>
      )}
    </div>
  );
};

export default CanvasElement;