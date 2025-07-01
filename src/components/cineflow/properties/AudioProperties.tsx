// properties/AudioProperties.tsx
import React from 'react';
import { CanvasElementType } from '@/types/cineflow';

interface AudioPropertiesProps {
  element: CanvasElementType;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
}

export const AudioProperties: React.FC<AudioPropertiesProps> = ({ element, onUpdateElement }) => {
  const handleChange = (key: string, value: any) => {
    onUpdateElement(element.id, { [key]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateElement(element.id, { 
            src: event.target.result as string,
            duration: element.duration || 30 // Default duration if not set
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <label className="block text-white/70 text-xs font-medium mb-1">Audio Source</label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            id={`audio-upload-${element.id}`}
          />
          <label
            htmlFor={`audio-upload-${element.id}`}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer hover:bg-white/20 text-center"
          >
            Upload Audio
          </label>
          {element.src && (
            <button
              onClick={() => handleChange('src', '')}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              Remove
            </button>
          )}
        </div>
      </div>

       

       

       

      {element.src && (
        <div className="pt-2">
          <div className="text-white/70 text-xs font-medium mb-1">Preview</div>
          <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10 p-2">
            <audio
              src={element.src}
              controls
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
};