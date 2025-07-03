// /canva/CanvasElement.tsx
import React, { useRef } from 'react';
import { CanvasElementType } from '@/types/cineflow';
import useElementResize from './element/hooks/useElementResize';
import useElementMove from './element/hooks/useElementMove';
import ElementAudio from './element/ElementAudio'
import ElementVideo from './element/ElementVideo';
import ElementImage from './element/ElementImage';
import ElementText from './element/ElementText';
import ElementDefault from './element/ElementDefault';

import {
    MoveDiagonal,
    MoveDiagonal2,
    MoveHorizontal,
    MoveVertical,
} from 'lucide-react';

interface CanvasElementProps {
    element: CanvasElementType;
    isSelected: boolean;
    isPlaying: boolean;
    currentTime: number;
    isVisible: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, updates: Partial<CanvasElementType>) => void;
    onDelete: (id: string) => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
    element,
    isSelected,
    isPlaying,
    currentTime,
    isVisible,
    onSelect,
    onUpdate,
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    // Use modular hooks
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

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(element.id);
    };

    // Render the appropriate element type
    const renderElement = () => {
        switch (element.type) {
            case 'audio':
                return (
                    <ElementAudio
                        element={element}
                        isSelected={isSelected}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        isVisible={isVisible}
                        onSelect={onSelect}
                    />
                );
            case 'video':
                return (
                    <ElementVideo
                        element={element}
                        isSelected={isSelected}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        isVisible={isVisible}
                        onSelect={onSelect}
                    />
                );
            case 'image':
                return <ElementImage element={element} isSelected={isSelected} onSelect={onSelect} />;
            case 'text':
                return <ElementText element={element} isSelected={isSelected} onSelect={onSelect} />;
            default:
                return <ElementDefault element={element} isSelected={isSelected} onSelect={onSelect} />;
        }
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
                        {['left-top', 'right-top', 'left-bottom', 'right-bottom'].map((dir) => {
                            const Icon = dir === 'left-top' || dir === 'right-bottom' ? MoveDiagonal2 : MoveDiagonal;
                            return (
                                <div
                                    key={dir}
                                    className={`absolute   rounded-sm z-50 flex items-center justify-center
        ${dir.includes('left') ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}
        ${dir.includes('top') ? 'top-0 -translate-y-1/2' : 'bottom-0 translate-y-1/2'}
        cursor-nwse-resize`}
                                    onMouseDown={(e) => handleResizeStart(e, dir)}
                                    onTouchStart={(e) => handleResizeTouchStart(e, dir)}
                                    style={{ touchAction: 'none' }}
                                >
                                    <Icon className="w-4 h-4 text-amber-400" strokeWidth={3} />
                                </div>
                            );
                        })}


                        {/* Edge resize handles */}
                        {['top', 'right', 'bottom', 'left'].map((dir) => {
                            const isVertical = dir === 'top' || dir === 'bottom';
                            const Icon = isVertical ? MoveVertical : MoveHorizontal;

                            return (
                                <div
                                    key={dir}
                                    className={`absolute   rounded-sm z-50 flex items-center justify-center
        ${isVertical
                                            ? 'left-1/2   -translate-x-1/2'
                                            : 'top-1/2  -translate-y-1/2'}
        ${dir === 'top' ? 'top-0 -translate-y-1/2' : ''}
        ${dir === 'right' ? 'right-0 translate-x-1/2' : ''}
        ${dir === 'bottom' ? 'bottom-0 translate-y-1/2' : ''}
        ${dir === 'left' ? 'left-0 -translate-x-1/2' : ''}
        ${isVertical ? 'cursor-ns-resize' : 'cursor-ew-resize'}`}
                                    onMouseDown={(e) => handleResizeStart(e, dir)}
                                    onTouchStart={(e) => handleResizeTouchStart(e, dir)}
                                    style={{ touchAction: 'none' }}
                                >
                                    <Icon className="w-4 h-4 text-amber-400" strokeWidth={3} />

                                </div>
                            );
                        })}

                    </>
                )}
            </div>
        </>
    );
};

export default CanvasElement;