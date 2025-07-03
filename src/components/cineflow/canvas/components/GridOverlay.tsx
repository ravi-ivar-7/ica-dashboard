import React from 'react';
import { getComplementColor } from '../utils/colors';
import { Size } from '../utils/coordinates';

export interface GridOverlayProps {
  showGrid: boolean;
  canvasSize: Size;
  scale: number;
  backgroundColor: string;
  gridSize: number;
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  showGrid,
  canvasSize,
  scale,
  backgroundColor,
  gridSize,
}) => {
  if (!showGrid) return null;

  const gridDotColor = getComplementColor(backgroundColor);

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ opacity: 1 }}
    >
      <defs>
        <pattern
          id="grid"
          width={gridSize * scale}
          height={gridSize * scale}
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.8" fill={gridDotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};

export default GridOverlay;