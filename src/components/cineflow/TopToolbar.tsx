import React, { useState } from 'react';
import { Save, Download, Undo, Redo, Play, Pause, HelpCircle, ChevronDown, Settings, Info, Radio, X } from 'lucide-react';
import { toast } from '../../contexts/ToastContext';

interface TopToolbarProps {
  projectName: string;
  isPlaying: boolean;
  canUndo: boolean;
  canRedo: boolean;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  onPlayPause: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  projectName,
  isPlaying,
  canUndo,
  canRedo,
  aspectRatio,
  onAspectRatioChange,
  onPlayPause,
  onUndo,
  onRedo,
  onSave,
  onExport
}) => {
  const [showAspectRatioDropdown, setShowAspectRatioDropdown] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  
  const aspectRatios = [
    { value: '16:9', label: '16:9 - Landscape' },
    { value: '9:16', label: '9:16 - Portrait' },
    { value: '1:1', label: '1:1 - Square' },
    { value: '4:3', label: '4:3 - Classic' },
    { value: '21:9', label: '21:9 - Cinematic' }
  ];

  const handleHelp = () => {
    toast.info('CineFlow Help', {
      subtext: 'Drag assets from the left panel to the canvas. Use the timeline to control when elements appear.',
      duration: 5000
    });
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-900/90 border-b border-white/10">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <h2 className="text-white font-bold text-sm truncate max-w-[120px] sm:max-w-[200px]">{projectName}</h2>
        <div className="text-white/50 text-xs hidden sm:block">Autosaving...</div>
      </div>
      
      {/* Center section */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="h-4 border-l border-white/20 mx-1 hidden sm:block"></div>
        
        <button
          onClick={onPlayPause}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        
        <div className="h-4 border-l border-white/20 mx-1 hidden sm:block"></div>
        
        {/* Aspect Ratio Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAspectRatioDropdown(!showAspectRatioDropdown)}
            className="flex items-center space-x-1 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <span className="text-xs font-medium">{aspectRatio}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showAspectRatioDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showAspectRatioDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-gray-900/95 border border-white/20 rounded-lg shadow-lg z-50">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => {
                    onAspectRatioChange(ratio.value);
                    setShowAspectRatioDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors ${
                    aspectRatio === ratio.value ? 'bg-white/10 text-white' : 'text-white/70'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Settings Button */}
        <button
          onClick={() => setShowSettingsPanel(!showSettingsPanel)}
          className={`p-1.5 rounded-lg ${
            showSettingsPanel ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
          } transition-colors hidden sm:flex`}
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs"
          title="Save Project"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold transition-colors hover:scale-105 text-xs"
          title="Export Video"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
        
        <button
          onClick={handleHelp}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
          title="Help"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Settings Panel */}
      {showSettingsPanel && (
        <div className="absolute top-10 right-4 mt-1 bg-gray-900/95 border border-white/20 rounded-lg shadow-lg z-50 w-64">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="text-white font-bold text-sm">Project Settings</h3>
            <button
              onClick={() => setShowSettingsPanel(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 space-y-3">
            <div>
              <label className="block text-white/80 text-xs font-semibold mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
                readOnly
              />
            </div>
            <div>
              <label className="block text-white/80 text-xs font-semibold mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => onAspectRatioChange(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
              >
                {aspectRatios.map((ratio) => (
                  <option key={ratio.value} value={ratio.value} className="bg-gray-900">
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/70 text-xs">
                  Changing aspect ratio may affect the positioning of elements on your canvas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopToolbar;