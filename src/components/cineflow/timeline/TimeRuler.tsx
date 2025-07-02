import React, { useRef, useState, useEffect } from 'react'; 
interface TimeRulerProps {
  duration: number;
  currentTime: number;
  timelineWidth: number;
  onTimeUpdate: (time: number) => void;
  className?: string;
}

const TimeRuler: React.FC<TimeRulerProps> = ({
  duration,
  currentTime,
  timelineWidth,
  onTimeUpdate,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const timeToPosition = (time: number) => {
    if (timelineWidth === 0 || duration === 0) return 0;
    return Math.max(0, (time / duration) * timelineWidth);
  };

  const positionToTime = (position: number) => {
    if (timelineWidth === 0) return 0;
    return Math.max(0, (position / timelineWidth) * duration);
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleRulerInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!rulerRef.current) return;

    const pos = getEventPosition(e);
    const rect = rulerRef.current.getBoundingClientRect();
    const position = Math.max(0, pos.x - rect.left);
    const newTime = positionToTime(position);
    onTimeUpdate(Math.max(0, Math.min(newTime, duration)));
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    
    // Disable horizontal scrolling during ruler drag
    document.body.style.overflowX = 'hidden';
    document.body.style.touchAction = 'pan-y pinch-zoom';
    
    handleRulerInteraction(e);
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) {
      handleRulerInteraction(e);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const pos = 'touches' in e ? 
        { x: e.touches[0].clientX, y: e.touches[0].clientY } : 
        { x: e.clientX, y: e.clientY };

      if (rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const position = Math.max(0, pos.x - rect.left);
        const newTime = positionToTime(position);
        onTimeUpdate(Math.max(0, Math.min(newTime, duration)));
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      
      // Re-enable scrolling
      document.body.style.overflowX = '';
      document.body.style.touchAction = '';
    };

    if (isDragging) {
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
  }, [isDragging, duration, onTimeUpdate, timelineWidth]);

  // Generate time markers
  const timelineMarkers = [];
  const markerInterval = duration > 60 ? 10 : duration > 30 ? 5 : 1;

  for (let i = 0; i <= duration; i += markerInterval) {
    timelineMarkers.push(i);
  }

  return (
    <div
      ref={rulerRef}
      className={`relative h-8 border-b border-white/10 bg-gray-900/90 cursor-pointer select-none touch-manipulation ${className}`}
      onMouseDown={handleStart}
    //   onTouchStart={handleStart}
    //   onClick={handleClick}
      onTouchEnd={handleClick}
    >
      <div className="absolute inset-0">
        {timelineMarkers.map((time) => (
          <div
            key={time}
            className="absolute border-l border-white/20 h-full pointer-events-none"
            style={{ left: `${timeToPosition(time)}px` }}
          >
            <span className="absolute top-1   text-white text-[10px] whitespace-nowrap transform -translate-x-1/2 ">
              {time}s
            </span>
          </div>
        ))}
      </div>
      
      {/* Current time indicator line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-amber-500 pointer-events-none"
        style={{ left: `${timeToPosition(currentTime)}px` }}
      />
    </div>
  );
};

export default TimeRuler;