import React, { useState } from 'react';
import { X, Download, Settings, Film, Instagram, Youtube, Twitter, Facebook, Check, Info } from 'lucide-react';
import { CineFlowProject } from '../../types/cineflow';
import { toast } from '../../contexts/ToastContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CineFlowProject;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('mp4');
  const [exportQuality, setExportQuality] = useState('high');
  const [exportResolution, setExportResolution] = useState('1080p');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [postDetails, setPostDetails] = useState({
    title: project.name,
    description: '',
    tags: project.tags.join(', ')
  });

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      toast.info('Preparing to export video...', {
        duration: 3000
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (selectedPlatform) {
        toast.success(`Video prepared for ${selectedPlatform}`, {
          subtext: 'Ready to post when you\'re ready',
          duration: 5000
        });
      } else {
        toast.success('Video exported successfully', {
          subtext: 'Your video has been saved to your downloads folder.',
          duration: 5000
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error exporting video:', error);
      toast.error('Error exporting video', {
        subtext: 'Please try again later.',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-white">Export Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Export Settings */}
          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-1.5 text-amber-500" />
              Export Settings
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1">Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="mp4" className="bg-gray-900">MP4</option>
                  <option value="webm" className="bg-gray-900">WebM</option>
                  <option value="gif" className="bg-gray-900">GIF</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1">Quality</label>
                <select
                  value={exportQuality}
                  onChange={(e) => setExportQuality(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="low" className="bg-gray-900">Low (Faster)</option>
                  <option value="medium" className="bg-gray-900">Medium</option>
                  <option value="high" className="bg-gray-900">High (Slower)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1">Resolution</label>
                <select
                  value={exportResolution}
                  onChange={(e) => setExportResolution(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="720p" className="bg-gray-900">720p</option>
                  <option value="1080p" className="bg-gray-900">1080p</option>
                  <option value="4k" className="bg-gray-900">4K</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-audio"
                  checked={includeAudio}
                  onChange={(e) => setIncludeAudio(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-amber-400 focus:ring-1"
                />
                <label htmlFor="include-audio" className="text-white text-sm">Include Audio</label>
              </div>
            </div>
          </div>
          
          {/* Post to Platform */}
          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center">
              <Download className="w-4 h-4 mr-1.5 text-amber-500" />
              Export Destination
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => setSelectedPlatform(null)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedPlatform === null 
                    ? 'bg-amber-500/20 border-amber-500/50 text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                } transition-colors`}
              >
                <Download className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Download</span>
              </button>
              
              <button
                onClick={() => setSelectedPlatform('instagram')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedPlatform === 'instagram' 
                    ? 'bg-amber-500/20 border-amber-500/50 text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                } transition-colors`}
              >
                <Instagram className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Instagram</span>
              </button>
              
              <button
                onClick={() => setSelectedPlatform('youtube')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedPlatform === 'youtube' 
                    ? 'bg-amber-500/20 border-amber-500/50 text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                } transition-colors`}
              >
                <Youtube className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">YouTube</span>
              </button>
              
              <button
                onClick={() => setSelectedPlatform('twitter')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  selectedPlatform === 'twitter' 
                    ? 'bg-amber-500/20 border-amber-500/50 text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                } transition-colors`}
              >
                <Twitter className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Twitter</span>
              </button>
            </div>
            
            {selectedPlatform && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
                <div>
                  <label className="block text-white/70 text-xs font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={postDetails.title}
                    onChange={(e) => setPostDetails({...postDetails, title: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                    placeholder="Enter a title for your post"
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-xs font-medium mb-1">Description</label>
                  <textarea
                    value={postDetails.description}
                    onChange={(e) => setPostDetails({...postDetails, description: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 resize-none"
                    placeholder="Enter a description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-xs font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={postDetails.tags}
                    onChange={(e) => setPostDetails({...postDetails, tags: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-xs">
                    You'll need to authenticate with {selectedPlatform} before posting. This will open in a new window.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Project Info */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <h3 className="text-white font-bold text-xs mb-2">Project Information</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="text-white/50">Name:</div>
              <div className="text-white">{project.name}</div>
              <div className="text-white/50">Duration:</div>
              <div className="text-white">{project.duration} seconds</div>
              <div className="text-white/50">Aspect Ratio:</div>
              <div className="text-white">{project.aspectRatio}</div>
              <div className="text-white/50">Elements:</div>
              <div className="text-white">{project.elements.length}</div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
            disabled={isExporting}
          >
            Cancel
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{selectedPlatform ? `Export to ${selectedPlatform}` : 'Export'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;