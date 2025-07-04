import React from 'react';
import { Info } from 'lucide-react';
import { Position, Size } from '@/CineFlowModule/Editor/Utils/coordinates';

export interface PositionInfoBarProps {
  mousePosition?: Position;
  selectedElement?: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  canvasSize: Size;
  zoom: number;
  scale: number;
  visible?: boolean;
  openPositionInfo?: boolean;
  onTogglePositionInfo?: () => void;
}

const PositionInfoBar: React.FC<PositionInfoBarProps> = ({
  mousePosition,
  selectedElement,
  canvasSize,
  zoom,
  scale,
  visible = true,
  openPositionInfo = false,
  onTogglePositionInfo = () => { },
}) => {
  visible = true; // Force visibility for now
  if (!visible) return null;

  if (!openPositionInfo) {
    return (
      <div className="absolute bottom-2 left-2 bg-amber-500/10 text-white p-2 rounded-lg shadow-lg z-10 cursor-pointer hover:bg-gray-700 transition"
        onClick={onTogglePositionInfo}
      >
        <Info className="w-4 h-4" />
      </div>
    );
  }

  // Full expanded bar
  return (
    <div
      className="absolute bottom-2 left-2 z-10 pointer-events-none"
    >
      <div className="bg-amber-500/10 text-white text-xs px-3 py-2 rounded-lg shadow-lg space-y-1 w-[240px]">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-white">Layout Info</span>
          <button
            className="text-white text-xs pointer-events-auto border border-white/20  hover:bg-gray-600 p-1 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();  
              onTogglePositionInfo();
            }}
          >
            Hide
          </button>
        </div>

        {/* Canvas Info */}
        <div className="flex space-x-4">
          <span>Canvas: {Math.round(canvasSize.width)}×{Math.round(canvasSize.height)}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Scale: {Math.round(scale * 100)}%</span>
        </div>

        {/* Mouse Position */}
        {mousePosition && (
          <div>
            Mouse: ({Math.round(mousePosition.x)}, {Math.round(mousePosition.y)})
          </div>
        )}

        {/* Selected Element Info */}
        {selectedElement && (
          <div className="border-t border-gray-600 pt-1">
            <div>Selected: {selectedElement.id}</div>
            <div>Position: ({Math.round(selectedElement.x)}, {Math.round(selectedElement.y)})</div>
            <div>Size: {Math.round(selectedElement.width)}×{Math.round(selectedElement.height)}</div>
          </div>
        )}
      </div>
    </div>
  );

};

export default PositionInfoBar;
