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
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  isPlaying,
  currentTime,
  isVisible,
  onSelect,
  onUpdate,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [videoPlaybackBlocked, setVideoPlaybackBlocked] = useState(false);
  const [volume, setVolume] = useState(1);
  const elementRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Touch-specific state
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchStartSize, setTouchStartSize] = useState({ width: 0, height: 0 });
  const [touchStartElementPos, setTouchStartElementPos] = useState({ x: 0, y: 0 });
  const [showPositionBar, setShowPositionBar] = useState(false);

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

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (element.type === 'audio' && audioRef.current) {
      audioRef.current.volume = newVolume;
    } else if (element.type === 'video' && videoRef.current) {
      videoRef.current.volume = newVolume;
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

  // Touch handlers for main element (moving only)
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't handle touch if we're already resizing or if not selected
    if (isResizing || !isSelected || e.touches.length !== 1) return;

    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchStartElementPos({ x: element.x, y: element.y });
    setIsMoving(true);
    setShowPositionBar(true);
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isSelected && isMoving && !isResizing) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.x;
      const deltaY = touch.clientY - touchStartPos.y;

      // Calculate new position
      const newX = touchStartElementPos.x + deltaX;
      const newY = touchStartElementPos.y + deltaY;

      onUpdate(element.id, {
        x: newX,
        y: newY
      });
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchEnd = () => {
    if (isMoving && !isResizing) {
      setIsMoving(false);
      setShowPositionBar(false);
    }
  };

  // Touch handlers for resize handles
  const handleResizeTouchStart = (e: React.TouchEvent, direction: string) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setTouchStartElementPos({ x: element.x, y: element.y });
      setTouchStartSize({ width: element.width, height: element.height });
      setResizeDirection(direction);
      setIsResizing(true);
      setShowPositionBar(true);
      e.stopPropagation();
      e.preventDefault();
    }
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
          newWidth = Math.max(50, startSize.width - deltaX);
          newX = startPosition.x + (startSize.width - newWidth);
        }

        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(50, startSize.height + deltaY);
        } else if (resizeDirection.includes('top')) {
          newHeight = Math.max(50, startSize.height - deltaY);
          newY = startPosition.y + (startSize.height - newHeight);
        }

        onUpdate(element.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY
        });
      } else if (isMoving && !isResizing) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        // Calculate new position
        const newX = startPosition.x + deltaX;
        const newY = startPosition.y + deltaY;

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
  }, [isResizing, isMoving, startPos, startSize, startPosition, element.id, element.width, element.height, element.x, element.y, onUpdate, resizeDirection]);

  // Handle global touch events for resizing
  useEffect(() => {
    const handleTouchMoveGlobal = (e: TouchEvent) => {
      if (isResizing && resizeDirection && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartPos.x;
        const deltaY = touch.clientY - touchStartPos.y;

        // Calculate new width, height, and position based on resize direction
        let newWidth = element.width;
        let newHeight = element.height;
        let newX = element.x;
        let newY = element.y;

        if (resizeDirection.includes('right')) {
          newWidth = Math.max(50, touchStartSize.width + deltaX);
        } else if (resizeDirection.includes('left')) {
          newWidth = Math.max(50, touchStartSize.width - deltaX);
          newX = touchStartElementPos.x + (touchStartSize.width - newWidth);
        }

        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(50, touchStartSize.height + deltaY);
        } else if (resizeDirection.includes('top')) {
          newHeight = Math.max(50, touchStartSize.height - deltaY);
          newY = touchStartElementPos.y + (touchStartSize.height - newHeight);
        }
        onUpdate(element.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY
        });
        e.preventDefault();
      }
    };

    const handleTouchEndGlobal = () => {
      setIsResizing(false);
      setIsMoving(false);
      setResizeDirection(null);
      setShowPositionBar(false);
    };

    if (isResizing) {
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleTouchEndGlobal);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
    };
  }, [isResizing, touchStartPos, touchStartSize, touchStartElementPos, element.id, onUpdate, resizeDirection, element.width, element.height, element.x, element.y]);

  // Control video playback based on isPlaying state
  useEffect(() => {
    if (element.type === 'video' && videoRef.current) {
      if (isPlaying && isVisible) {
        videoRef.current.currentTime = currentTime - element.startTime;
        videoRef.current.volume = volume;
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
  }, [isPlaying, currentTime, element, isVisible, volume]);

  // Control audio playback based on isPlaying state
  useEffect(() => {
    if (element.type === 'audio' && audioRef.current) {
      if (isPlaying && isVisible) {
        // Set the current time based on timeline position
        audioRef.current.currentTime = currentTime - element.startTime;
        audioRef.current.volume = volume;

        // Play the audio
        audioRef.current.play().catch(err => {
          // Handle autoplay restrictions gracefully
          if (err.name === 'NotAllowedError' || err.message.includes('interrupted') || err.message.includes('background media')) {
            console.log('Audio autoplay blocked. User interaction required.');
            return;
          }
          console.warn('Unexpected audio playback error:', err);
        });
      } else {
        // Pause the audio when not playing or not visible
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTime, element, isVisible, volume]);

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
              loop={false}
              muted={volume === 0}
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
            {isSelected && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded-lg p-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}
          </div>
        );
      case 'audio':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg p-4">
            <audio
              ref={audioRef}
              src={element.src}
              className="hidden"
            />
            <div className="text-white text-center mb-4">
              <div className="text-xl mb-2">🎵</div>
              <div className="font-semibold">{element.name || 'Audio Track'}</div>
            </div>

            {/* Audio waveform visualization */}
            <div className="w-full h-12 bg-black/30 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-around px-1">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-400/50 rounded-full"
                    style={{
                      height: `${10 + Math.sin(i * 0.5) * 20}px`,
                      opacity: isPlaying && isVisible && i < (currentTime - element.startTime) / element.duration * 40 ? 1 : 0.5
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {isSelected && (
              <div className="mt-4 w-full">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-amber-500"
                />
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
            alt={element.name || 'Asset'}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/icons/placeholder.png'; // fallback icon
            }}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        );
      default:
        return <div className="w-full h-full bg-gray-500/30"></div>;
    }
  };

  // Position info bar component
  const PositionInfoBar = () => {
    if (!showPositionBar || !isSelected) return null;

    return (
      <div className="fixed -top-12 left-0   mx-auto bg-black/80 text-white text-xs p-1   z-50">
        <div className="grid grid-cols-2 gap-1">
          <span>X: {Math.round(element.x)}</span>
          <span>Y: {Math.round(element.y)}</span>
          <span>W: {Math.round(element.width)}</span>
          <span>H: {Math.round(element.height)}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <PositionInfoBar />
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Element content */}
        <div className="w-full h-full overflow-hidden">
          {renderElement()}
        </div>

        {/* Selection border and resize handles */}
        {isSelected && (
          <>
            <div className="absolute inset-0 border border-amber-500 pointer-events-none"></div>

            {/* Corner resize handles */}
            <div
              className="absolute top-0 left-0 w-3 h-3 bg-amber-500 cursor-nwse-resize -translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'left-top')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'left-top')}
            ></div>
            <div
              className="absolute top-0 right-0 w-3 h-3 bg-amber-500 cursor-nesw-resize translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'right-top')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right-top')}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-3 h-3 bg-amber-500 cursor-nesw-resize -translate-x-1/2 translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'left-bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'left-bottom')}
            ></div>
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 cursor-nwse-resize translate-x-1/2 translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'right-bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right-bottom')}
            ></div>

            {/* Edge resize handles */}
            <div
              className="absolute top-0 left-1/2 w-4 h-2 bg-amber-500 cursor-ns-resize -translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'top')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'top')}
            ></div>
            <div
              className="absolute right-0 top-1/2 w-2 h-4 bg-amber-500 cursor-ew-resize translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right')}
            ></div>
            <div
              className="absolute bottom-0 left-1/2 w-4 h-2 bg-amber-500 cursor-ns-resize -translate-x-1/2 translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'bottom')}
            ></div>
            <div
              className="absolute left-0 top-1/2 w-2 h-4 bg-amber-500 cursor-ew-resize -translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'left')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'left')}
            ></div>
          </>
        )}
      </div>
    </>
  );
};

export default CanvasElement;