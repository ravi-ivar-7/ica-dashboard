import React, { useState } from 'react';
import { Save, Download, Undo, Redo, Play, Pause, HelpCircle, ChevronDown, Edit, Check, X, Tag, FileText } from 'lucide-react';
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
  projectDescription?: string;
  onProjectDetailsChange?: (name: string, description: string) => void;
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
  onExport,
  projectDescription = '',
  onProjectDetailsChange
}) => {
  const [showAspectRatioDropdown, setShowAspectRatioDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  const [editedDescription, setEditedDescription] = useState(projectDescription);
  
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

  const handleSaveDetails = () => {
    if (onProjectDetailsChange) {
      onProjectDetailsChange(editedName, editedDescription);
    }
    setIsEditing(false);
    toast.success('Project details updated');
  };

  const handleCancelEdit = () => {
    setEditedName(projectName);
    setEditedDescription(projectDescription);
    setIsEditing(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-gray-900/90 border-b border-white/10">
      <div className="flex items-center justify-between p-2 overflow-x-auto">
        {/* Left section */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancelEdit}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveDetails}
                className="p-1 rounded-lg bg-amber-500 text-black transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Edit Project Details"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-amber-400 w-40 sm:w-auto"
              placeholder="Project Title"
            />
          ) : (
            <h2 className="text-white font-bold text-base truncate max-w-[120px] sm:max-w-[200px]">{projectName}</h2>
          )}
          <div className="text-white/50 text-xs hidden sm:block">Autosaving...</div>
        </div>
        
        {/* Center section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
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
      </div>
      
      {/* Project Description Section */}
      <div className="px-2 py-1 border-t border-white/10">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-white/60" />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-400 resize-none flex-1"
              placeholder="Project Description (optional)"
              rows={1}
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 overflow-hidden">
            <FileText className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
            <p className="text-white/60 text-xs truncate">
              {projectDescription || "No description provided. Click the edit button to add one."}
            </p>
          </div>
        )}
      </div>
      
      {/* Tags Section (Optional) */}
      {isEditing && (
        <div className="px-2 py-1 border-t border-white/10 flex items-center space-x-2">
          <Tag className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
          <input
            type="text"
            placeholder="Add tags separated by commas"
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-400 flex-1"
          />
        </div>
      )}
    </div>
  );
};

export default TopToolbar;