/**
 * Coordinate conversion utilities
 */

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CanvasTransform {
  scale: number;
  zoom: number;
  panOffset: Position;
}

/**
 * Convert screen coordinates to logical canvas coordinates
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param canvasElement - Canvas DOM element
 * @param transform - Canvas transform state
 * @returns Logical coordinates
 */
export function screenToLogical(
  screenX: number,
  screenY: number,
  canvasElement: HTMLElement | null,
  transform: CanvasTransform
): Position {
  if (!canvasElement) return { x: 0, y: 0 };

  const canvasRect = canvasElement.getBoundingClientRect();
  const { scale, zoom, panOffset } = transform;

  // Get position relative to canvas
  const relativeX = screenX - canvasRect.left;
  const relativeY = screenY - canvasRect.top;

  // Account for zoom and pan
  const adjustedX = (relativeX / zoom) - (panOffset.x / zoom);
  const adjustedY = (relativeY / zoom) - (panOffset.y / zoom);

  // Convert from display coordinates to logical coordinates
  const logicalX = adjustedX / scale;
  const logicalY = adjustedY / scale;

  return { x: logicalX, y: logicalY };
}

/**
 * Convert logical coordinates to screen coordinates
 * @param logicalX - Logical X coordinate
 * @param logicalY - Logical Y coordinate
 * @param canvasElement - Canvas DOM element
 * @param transform - Canvas transform state
 * @returns Screen coordinates
 */
export function logicalToScreen(
  logicalX: number,
  logicalY: number,
  canvasElement: HTMLElement | null,
  transform: CanvasTransform
): Position {
  if (!canvasElement) return { x: 0, y: 0 };

  const canvasRect = canvasElement.getBoundingClientRect();
  const { scale, zoom, panOffset } = transform;

  // Convert from logical coordinates to display coordinates
  const displayX = logicalX * scale;
  const displayY = logicalY * scale;

  // Account for zoom and pan
  const adjustedX = (displayX + panOffset.x) * zoom;
  const adjustedY = (displayY + panOffset.y) * zoom;

  // Convert to screen coordinates
  const screenX = adjustedX + canvasRect.left;
  const screenY = adjustedY + canvasRect.top;

  return { x: screenX, y: screenY };
}

/**
 * Calculate aspect ratio from string representation
 * @param aspectRatio - Aspect ratio string (e.g., "16:9")
 * @returns Numeric aspect ratio value
 */
export function parseAspectRatio(aspectRatio: string): number {
  const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
  return aspectWidth / aspectHeight;
}

/**
 * Calculate canvas size based on container dimensions and aspect ratio
 * @param containerWidth - Container width
 * @param containerHeight - Container height
 * @param aspectRatio - Target aspect ratio
 * @param margin - Margin factor (0-1)
 * @returns Calculated canvas size
 */
export function calculateCanvasSize(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number,
  margin: number = 0.95
): Size {
  const containerAspect = containerWidth / containerHeight;

  let width: number;
  let height: number;

  if (containerAspect > aspectRatio) {
    // Container is wider - height is the limiting factor
    height = containerHeight * margin;
    width = height * aspectRatio;
  } else {
    // Container is taller - width is the limiting factor
    width = containerWidth * margin;
    height = width / aspectRatio;
  }

  return { width, height };
}

/**
 * Clamp a position within canvas bounds
 * @param position - Position to clamp
 * @param elementSize - Size of the element
 * @param canvasSize - Canvas logical size
 * @returns Clamped position
 */
export function clampToCanvas(
  position: Position,
  elementSize: Size,
  canvasSize: Size
): Position {
  return {
    x: Math.max(0, Math.min(position.x, canvasSize.width - elementSize.width)),
    y: Math.max(0, Math.min(position.y, canvasSize.height - elementSize.height))
  };
}

/**
 * Snap value to grid if enabled
 * @param value - Value to snap
 * @param gridSize - Grid size
 * @param snapEnabled - Whether snapping is enabled
 * @returns Snapped value
 */
export function snapToGrid(
  value: number,
  gridSize: number,
  snapEnabled: boolean
): number {
  if (!snapEnabled) return value;
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 */
export function calculateDistance(p1: Position, p2: Position): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}