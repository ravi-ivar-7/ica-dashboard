// CanvasResizeHandle.tsx
import React from 'react';
import { MoveDiagonal2 } from 'lucide-react';
interface CanvasResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
  onResizeTouchStart: (e: React.TouchEvent) => void;
  onResizeTouchMove: (e: React.TouchEvent) => void;
  onResizeTouchEnd: (e: React.TouchEvent) => void;
}

// CanvasResizeHandle.tsx
const CanvasResizeHandle: React.FC<CanvasResizeHandleProps> = ({
  onResizeStart,
  onResizeTouchStart,
  onResizeTouchMove,
  onResizeTouchEnd,
}) => {
  return (
    
<div
  className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 text-white rounded-full cursor-move z-50 flex items-center justify-center"
  onMouseDown={onResizeStart}
  onTouchStart={onResizeTouchStart}
  onTouchMove={onResizeTouchMove}
  onTouchEnd={onResizeTouchEnd}
  style={{ 
    touchAction: 'none',
    transform: 'translate(50%, 50%)'  
  }}
>
  <MoveDiagonal2 className="w-3.5 h-3.5" />
</div>
  );
};

export default CanvasResizeHandle;