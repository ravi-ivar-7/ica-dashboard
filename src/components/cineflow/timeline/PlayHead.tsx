import React, { useState, useRef, useEffect } from 'react';
import { 
  formatTime, 
  parseTime, 
  getEventPosition, 
  disableScrolling, 
  enableScrolling,
  timeToPosition,
  positionToTime,
  clamp
} from './utils';

interface PlayheadProps {
  currentTime: number;
  duration: number;
  timelineWidth: number;
  onTimeUpdate: (time: number) => void;
  className?: string;
}

const Playhead: React.FC<PlayheadProps> = ({
  currentTime,
  duration,
  timelineWidth,
  onTimeUpdate,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlayheadStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    
    // Disable horizontal scrolling immediately when drag starts
    disableScrolling({ horizontal: true });
    
    // For touch events, also prevent default behavior on document
    if ('touches' in e) {
      document.body.style.touchAction = 'pan-y pinch-zoom';
    }
  };

  const handleTimeDisplayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isDragging) {
      setIsEditing(true);
      setEditValue(formatTime(currentTime));
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleTimeInputSubmit = () => {
    const newTime = parseTime(editValue);
    if (newTime !== null) {
      const clampedTime = clamp(newTime, 0, duration);
      onTimeUpdate(clampedTime);
    }
    setIsEditing(false);
  };

  const handleTimeInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeInputSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(formatTime(currentTime));
    }
  };

  const handleTimeInputBlur = () => {
    handleTimeInputSubmit();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const pos = getEventPosition(e);

      // Find the timeline element to get its bounds
      const timelineElement = document.querySelector('[data-timeline-ref]') as HTMLElement;
      if (timelineElement) {
        const rect = timelineElement.getBoundingClientRect();
        const position = Math.max(0, pos.x - rect.left);
        const newTime = positionToTime(position, duration, timelineWidth);
        onTimeUpdate(clamp(newTime, 0, duration));
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      
      // Re-enable scrolling and reset touch behavior
      enableScrolling();
      document.body.style.touchAction = '';
    };

    if (isDragging) {
      // Add passive: false to ensure preventDefault works on touch events
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      // Additional safeguard: prevent scroll on document during drag
      document.addEventListener('scroll', (e) => e.preventDefault(), { passive: false });
      document.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('scroll', (e) => e.preventDefault());
      document.removeEventListener('wheel', (e) => e.preventDefault());
    };
  }, [isDragging, duration, onTimeUpdate, timelineWidth]);

  return (
    <div
      className={`absolute z-20 top-0 bottom-0 w-0.5 bg-amber-500 pointer-events-none ${className}`}
      style={{ left: `${timeToPosition(currentTime, duration, timelineWidth)}px` }}
    >
      {/* Time display */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={handleTimeInputChange}
            onKeyDown={handleTimeInputKeyDown}
            onBlur={handleTimeInputBlur}
            className="w-20 px-1 py-0.5 bg-gray-800 text-white text-[10px] rounded border border-amber-500 focus:outline-none focus:border-amber-400 text-center"
            placeholder="mm:ss.ms"
          />
        ) : (
          <div
            className="px-1 py-0.5 bg-gray-900 text-white text-[10px] rounded shadow-lg border border-amber-500 cursor-pointer hover:bg-gray-800 transition-colors touch-manipulation"
            onClick={handleTimeDisplayClick}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTimeDisplayClick(e as any);
            }}
          >
            {formatTime(currentTime)}
          </div>
        )}
      </div>

      {/* Playhead handle */}
      <div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-amber-500 cursor-ew-resize pointer-events-auto touch-manipulation hover:bg-amber-400 transition-colors select-none"
        onMouseDown={handlePlayheadStart}
        onTouchStart={handlePlayheadStart}
        style={{
          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
          touchAction: 'none' // Prevent all default touch behaviors on the handle itself
        }}
      />
    </div>
  );
};

export default Playhead;