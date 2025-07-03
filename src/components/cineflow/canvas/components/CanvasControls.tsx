import React from 'react';

export interface CanvasControlsProps {
  backgroundColor: string;
  showGrid: boolean;
  snapToGrid: boolean;
  zoom: number;
  controlsExpanded: boolean;
  setBackgroundColor: (color: string) => void;
  setShowGrid: (show: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setControlsExpanded: (expanded: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  onTogglePositionInfo?: () => void;
  openPositionInfo?: boolean;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  backgroundColor,
  showGrid,
  snapToGrid,
  zoom,
  controlsExpanded,
  setBackgroundColor,
  setShowGrid,
  setSnapToGrid,
  setControlsExpanded,
  zoomIn,
  zoomOut,
  resetView,
  onTogglePositionInfo = () => { },
  openPositionInfo,
}) => {
  return (
    <div className="absolute top-2 right-2 bg-gray-800 rounded-lg shadow-lg z-20 max-w-xs sm:max-w-sm md:max-w-md">
      {/* Sticky Header with toggle */}
      <div
        className="sticky flex items-center justify-center p-1 bg-amber-500/10 hover:bg-gray-700 rounded-lg cursor-pointer"
        onClick={() => setControlsExpanded(!controlsExpanded)}
      >
        <span className="">⚙️</span>
      </div>

      {/* Scrollable Collapsible Content */}
      {controlsExpanded && (
        <div
          className="max-h-[40vh] overflow-y-auto bg-gray-800 rounded-b-xl shadow-xl text-sm text-white p-4 pt-2 space-y-5 scroll-smooth"
          style={{ touchAction: 'auto', pointerEvents: 'auto' }}
        >
          <div className="space-y-5 text-sm text-white">
            {/* Background Color */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Background</span>
              <div className="w-6 h-6 rounded overflow-hidden border border-white/20 p-0">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-full appearance-none cursor-pointer p-0 border-none"
                />
              </div>
            </div>


            {/* Layout Info Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Layout Info</span>
              <button
                onClick={onTogglePositionInfo}
                className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200 border border-white/10 shadow"
              >
                {openPositionInfo ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Show Grid */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Show Grid</span>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="form-checkbox w-5 h-5 accent-amber-500 transition"
              />
            </div>

            {/* Snap to Grid */}
            <div className="flex items-center justify-between">
              <span className={`font-medium ${!showGrid ? 'opacity-50' : ''}`}>Snap to Grid</span>
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                disabled={!showGrid}
                className="form-checkbox w-5 h-5 accent-amber-500 transition"
              />
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="space-y-1">
            <div className="flex justify-between items-center font-semibold">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={zoomOut}
                className="flex-1 py-1 bg-gray-600 hover:bg-gray-500 rounded transition"
              >
                − Zoom Out
              </button>
              <button
                onClick={zoomIn}
                className="flex-1 py-1 bg-gray-600 hover:bg-gray-500 rounded transition"
              >
                ＋ Zoom In
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">Shift + Scroll to zoom</p>
          </div>

          {/* Reset View */}
          <div className="space-y-1">
            <button
              onClick={resetView}
              className="w-full py-1 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition"
            >
              Reset View
            </button>
            <p className="text-gray-400 text-xs text-center">Reset zoom and pan to default</p>
          </div>

          {/* Help */}
          <div className="pt-3 border-t border-gray-700 space-y-1">
            <h4 className="font-semibold text-sm">Quick Tips</h4>
            <p>Mouse</p>
            <ul className="text-xs text-gray-300 space-y-0.5 pl-4 list-disc">
              <li>Shift + Scroll: Zoom</li>
              <li>Alt + Drag / Middle Click: Pan</li>
              <li>Drag assets onto canvas</li>
              <li>Resize canvas from bottom-right corner</li>
              <li>Double-click: Center asset</li>
              <li>Right-click selected element: Context menu</li>
              <li>No effect on canvas when element selected</li>
            </ul>
            <p>Touch</p>
            <ul className="text-xs text-gray-300 space-y-0.5 pl-4 list-disc">
              <li>Tap element to select</li>
              <li>Drag with 1 finger to move</li>
              <li>Drag corners or edges to resize</li>
              <li>Tap outside to deselect</li>
              <li>Pinch with 2 fingers to zoom canvas</li>
              <li>Drag bottom-right grip to resize canvas</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasControls;