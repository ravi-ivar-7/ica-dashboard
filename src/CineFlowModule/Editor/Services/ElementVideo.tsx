// /canva/elements/ElementVideo.tsx
import React, { useRef, useEffect, useState } from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface ElementVideoProps {
  element: CanvasElementType;
  isSelected: boolean;
  isPlaying: boolean;
  currentTime: number;
  isVisible: boolean;
  onSelect: (id: string) => void;
}

const ElementVideo: React.FC<ElementVideoProps> = ({
  element,
  isSelected,
  isPlaying,
  currentTime,
  isVisible,
  onSelect,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaybackBlocked, setVideoPlaybackBlocked] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying && isVisible) {
      videoRef.current.currentTime = currentTime - element.startTime;
      videoRef.current.volume = volume;
      videoRef.current.play().catch(err => {
        if (err.name === 'NotAllowedError') {
          setVideoPlaybackBlocked(true);
        }
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentTime, isVisible, volume, element.startTime]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => setVideoPlaybackBlocked(true));
    } else {
      videoRef.current.pause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const handleUserInteraction = () => {
    setVideoPlaybackBlocked(false);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={element.src}
        className="w-full h-full object-cover"
        onClick={handleVideoClick}
        onPlay={handleUserInteraction}
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
};

export default ElementVideo;