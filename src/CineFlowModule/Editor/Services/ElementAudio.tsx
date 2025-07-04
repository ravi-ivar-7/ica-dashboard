// /canva/elements/ElementAudio.tsx
import React, { useRef, useEffect, useState } from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface ElementAudioProps {
  element: CanvasElementType;
  isSelected: boolean;
  isPlaying: boolean;
  currentTime: number;
  isVisible: boolean;
  onSelect: (id: string) => void;
}

const ElementAudio: React.FC<ElementAudioProps> = ({
  element,
  isSelected,
  isPlaying,
  currentTime,
  isVisible,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && isVisible) {
      audioRef.current.currentTime = currentTime - element.startTime;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(err => {
        if (err.name === 'NotAllowedError') {
          console.log('Audio autoplay blocked');
        }
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTime, isVisible, volume, element.startTime]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg p-4">
      <audio ref={audioRef} src={element.src} className="hidden" />
      <div className="text-white text-center mb-4">
        <div className="text-xl mb-2">🎵</div>
        <div className="font-semibold">{element.name || 'Audio Track'}</div>
      </div>

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
            />
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
};

export default ElementAudio;