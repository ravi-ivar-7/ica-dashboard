// properties/ImageProperties.tsx
import React from 'react';
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface ImagePropertiesProps {
  element: CanvasElementType;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
}

export const ImageProperties: React.FC<ImagePropertiesProps> = ({ element, onUpdateElement }) => {
  const handleChange = (key: string, value: any) => {
    onUpdateElement(element.id, { [key]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateElement(element.id, { src: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <label className="block text-white/70 text-xs font-medium mb-1">Image Source</label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${element.id}`}
          />
          <label
            htmlFor={`image-upload-${element.id}`}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer hover:bg-white/20 text-center"
          >
            Upload Image
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

      <div>
        <label className="block text-white/70 text-xs font-medium mb-1">Image Width</label>
        <input
          type="number"
          value={element.width || 100}
          onChange={(e) => handleChange('width', Number(e.target.value))}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400"
        />
      </div>
    </>
  );
};