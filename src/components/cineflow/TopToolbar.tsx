import React, { useState, useRef, useEffect } from 'react';
import { Save, Download, Undo, Redo, Play, Pause, HelpCircle, ChevronDown, Edit, Check, X, Tag, FileText } from 'lucide-react';
import { toast } from '../../contexts/ToastContext';
import { AspectRatio, AspectRatioOption } from '@/types/cineflow';

interface TopToolbarProps {
  projectName: string;
  isPlaying: boolean;
  canUndo: boolean;
  canRedo: boolean;
  aspectRatio: string;
  onAspectRatioChange: (ratio: AspectRatio) => void;
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const aspectRatios: AspectRatioOption[] = [
    { value: '16:9', label: '16:9 - Landscape' },
    { value: '9:16', label: '9:16 - Portrait' },
    { value: '1:1', label: '1:1 - Square' },
    { value: '4:3', label: '4:3 - Classic' },
    { value: '21:9', label: '21:9 - Cinematic' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)) {
        setShowAspectRatioDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  <div className="sticky top-0 z-50 bg-gray-900/90 border-b border-white/10 backdrop-blur-sm">
    {/* Scrollable toolbar container */}
    <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="inline-flex items-center justify-between p-2 w-full min-w-max">
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

          {!isEditing && (
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
              <div className="bg-white/10 rounded-lg px-1.5 py-1">
                <span className="text-white text-xs sm:text-sm font-medium">
                  {aspectRatio}
                </span>
              </div>
            </div>
          )}

          <div className="text-white/50 text-xs hidden sm:block">Local Saving...</div>
        </div>

        {/* Center section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 mx-2">
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
    </div>

    {/* Editing sections (non-scrollable) */}
    <div className="space-y-2 px-2">
      {/* Project Description Section */}
      {isEditing && (
        <div className="border-t border-white/10 pt-2">
          <div className="flex items-start space-x-2">
            <FileText className="w-3.5 h-3.5 text-white/60 mt-1 flex-shrink-0" />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 resize-y w-full min-h-[40px]"
              placeholder="Project Description (optional)"
              rows={1}
            />
          </div>
        </div>
      )}

      {/* Tags Section */}
      {isEditing && (
        <div className="border-t border-white/10 pt-2">
          <div className="flex items-center space-x-2">
            <Tag className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Add tags separated by commas"
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 w-full"
            />
          </div>
        </div>
      )}

      {/* Aspect Ratio Dropdown */}
      {isEditing && (
        <div className="border-t border-white/10 pt-2">
          <div className="relative group w-full sm:w-auto">
            <button className="flex items-center justify-between w-full sm:w-auto space-x-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <span className="text-xs font-medium">Aspect Ratio: {aspectRatio}</span>
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            </button>

            <div className="absolute left-0 right-0 sm:right-auto mt-1 hidden group-hover:block bg-gray-900 border border-white/20 rounded-lg shadow-lg z-50 min-w-[160px]">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => onAspectRatioChange(ratio.value)}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors ${
                    aspectRatio === ratio.value ? 'bg-white/10 text-white' : 'text-white/70'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default TopToolbar;