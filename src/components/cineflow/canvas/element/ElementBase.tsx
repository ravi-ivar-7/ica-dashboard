// /canva/elements/ElementBase.tsx
import React, { useRef } from 'react';
import { CanvasElementType } from '@/types/cineflow';
import ElementAudio from './ElementAudio';
import ElementVideo from './ElementVideo';
import ElementImage from './ElementImage';
import ElementText from './ElementText';
import ElementDefault from './ElementDefault';
import useElementResize from './hooks/useElementResize';
import useElementMove from './hooks/useElementMove';

interface ElementBaseProps {
  element: CanvasElementType;
  isSelected: boolean;
  isPlaying: boolean;
  currentTime: number;
  isVisible: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
  onDelete: (id: string) => void;
}

const ElementBase: React.FC<ElementBaseProps> = ({
  element,
  isSelected,
  isPlaying,
  currentTime,
  isVisible,
  onSelect,
  onUpdate,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    isResizing,
    handleResizeStart,
    handleResizeTouchStart
  } = useElementResize({ element, onUpdate });

  const {
    handleMoveStart,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useElementMove({ element, isSelected, isResizing, onUpdate });

  const renderElement = () => {
    switch (element.type) {
      case 'audio': return (
        <ElementAudio
          element={element}
          isSelected={isSelected}
          isPlaying={isPlaying}
          currentTime={currentTime}
          isVisible={isVisible}
          onSelect={onSelect}
        />
      );
      case 'video': return (
        <ElementVideo
          element={element}
          isSelected={isSelected}
          isPlaying={isPlaying}
          currentTime={currentTime}
          isVisible={isVisible}
          onSelect={onSelect}
        />
      );
      case 'image': return (
        <ElementImage
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
      case 'text': return (
        <ElementText
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
      default: return (
        <ElementDefault
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <>
      
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
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 bg-amber-500 cursor-nesw-resize translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'right-top')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right-top')}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 bg-amber-500 cursor-nesw-resize -translate-x-1/2 translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'left-bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'left-bottom')}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 cursor-nwse-resize translate-x-1/2 translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'right-bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right-bottom')}
            />

            {/* Edge resize handles */}
            <div
              className="absolute top-0 left-1/2 w-4 h-2 bg-amber-500 cursor-ns-resize -translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'top')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'top')}
            />
            <div
              className="absolute right-0 top-1/2 w-2 h-4 bg-amber-500 cursor-ew-resize translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right')}
            />
            <div
              className="absolute bottom-0 left-1/2 w-4 h-2 bg-amber-500 cursor-ns-resize -translate-x-1/2 translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'bottom')}
            />
            <div
              className="absolute left-0 top-1/2 w-2 h-4 bg-amber-500 cursor-ew-resize -translate-x-1/2 -translate-y-1/2 touch-none"
              onMouseDown={(e) => handleResizeStart(e, 'left')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'left')}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ElementBase;