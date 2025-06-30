import React from 'react';
import { Save, Download, Undo, Redo, Play, Pause, Zap, Settings, HelpCircle } from 'lucide-react';
import { toast } from '../../contexts/ToastContext';

interface TopToolbarProps {
  projectName: string;
  isPlaying: boolean;
  canUndo: boolean;
  canRedo: boolean;
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
  onPlayPause,
  onUndo,
  onRedo,
  onSave,
  onExport
}) => {
  const handleHelp = () => {
    toast.info('CineFlow Help', {
      subtext: 'Drag assets from the left panel to the canvas. Use the timeline to control when elements appear.',
      duration: 5000
    });
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-900/90 border-b border-white/10">
      {/* Left section */}
      <div className="flex items-center space-x-3">
        <h2 className="text-white font-bold text-base truncate max-w-[200px]">{projectName}</h2>
        <div className="text-white/50 text-xs">Autosaving...</div>
      </div>
      
      {/* Center section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        
        <div className="h-4 border-l border-white/20 mx-1"></div>
        
        <button
          onClick={onPlayPause}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
          title="Save Project"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold transition-colors hover:scale-105 text-sm"
          title="Export Video"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
        
        <button
          onClick={handleHelp}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TopToolbar;