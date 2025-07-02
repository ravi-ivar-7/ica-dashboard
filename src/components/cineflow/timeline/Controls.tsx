import React from 'react';
import { Play, Pause, Clock } from 'lucide-react';

interface TimelineControlsProps {
  currentTime: number;
  duration: number;
  customDuration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onDurationChange: (duration: number) => void;
  className?: string;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  duration,
  customDuration,
  isPlaying,
  onPlayPause,
  onDurationChange,
  className = ''
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Math.max(1, Number(e.target.value));
    onDurationChange(newDuration);
  };

  return (
    <div className={`flex items-center justify-between p-2 border-b border-white/10 flex-shrink-0 bg-gray-900/95 backdrop-blur-sm ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPlayPause}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors touch-manipulation"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center space-x-1 text-white/80 text-xs">
          <Clock className="w-3 h-3" />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
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
  );
};

export default TimelineControls;