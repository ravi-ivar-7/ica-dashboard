import React from 'react';
import { Image as LucideImage, Video, Music, FileText, Sticker } from 'lucide-react';

export interface AssetItemProps {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text' | 'element';
  name: string;
  src: string;
  duration?: string;
  onDragStart: (e: React.DragEvent, asset: any) => void;
}

const AssetItem: React.FC<AssetItemProps> = ({ id, type, name, src, duration, onDragStart }) => {
  const getIcon = () => {
    switch (type) {
      case 'image':
        return <LucideImage className="w-4 h-4 text-blue-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-purple-400" />;
      case 'text':
        return <FileText className="w-4 h-4 text-green-400" />;
      case 'element':
        return <Sticker className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    const asset = { id, type, name, src, duration };
    
    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    onDragStart(e, asset);
    
    // Set a drag image using the native Image constructor
    if (type === 'image' || type === 'video') {
      const img = new window.Image();
      img.src = src;
      e.dataTransfer.setDragImage(img, 0, 0);
    }
    
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Double-click to add asset to canvas
  const handleDoubleClick = () => {
    // Create a custom event to add the asset to canvas
    const event = new CustomEvent('asset-double-clicked', {
      detail: { id, type, name, src, duration }
    });
    document.dispatchEvent(event);
  };

  return (
    <div
      className="group bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center space-x-2">
        {type === 'image' || type === 'video' ? (
          <div className="w-10 h-10 rounded-md overflow-hidden bg-black/30 flex-shrink-0">
            <img src={src} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-black/30 flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-medium truncate">{name}</p>
          <div className="flex items-center text-white/50 text-xs">
            {getIcon()}
            <span className="ml-1">{duration || type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetItem;