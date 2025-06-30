import React, { useState } from 'react';
import { X, Download, Save, Cloud, FileJson, Video, Image, Check, Info, Zap } from 'lucide-react';
import { toast } from '../../contexts/ToastContext';
import { CineFlowProject } from '../../types/cineflow';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CineFlowProject;
}

type ExportFormat = 'video' | 'image-sequence' | 'json';
type ExportDestination = 'download' | 'assets' | 'cloud';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('video');
  const [exportDestination, setExportDestination] = useState<ExportDestination>('download');
  const [resolution, setResolution] = useState('1080p');
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  
  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Handle different export formats and destinations
      if (exportFormat === 'json') {
        // For JSON, we can actually create and download the project configuration
        const projectJson = JSON.stringify(project, null, 2);
        const blob = new Blob([projectJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, '_')}_config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Project configuration exported successfully', {
          subtext: 'JSON file has been downloaded to your device',
          duration: 5000
        });
      } else if (exportDestination === 'download') {
        // Simulate download for video or image sequence
        toast.success(`${exportFormat === 'video' ? 'Video' : 'Image sequence'} exported successfully`, {
          subtext: `Your ${exportFormat === 'video' ? 'video' : 'images'} have been downloaded to your device`,
          duration: 5000
        });
      } else if (exportDestination === 'assets') {
        // Simulate saving to assets library
        toast.success(`Saved to assets library`, {
          subtext: `Your ${exportFormat} is now available in your assets`,
          duration: 5000
        });
      } else if (exportDestination === 'cloud') {
        // Simulate cloud upload
        toast.success(`Uploaded to cloud storage`, {
          subtext: 'Your file has been uploaded successfully',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        subtext: 'There was an error during the export process. Please try again.',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-2xl overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl shadow-lg">
                  <Download className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white">Export Project</h2>
              </div>
              <button
                onClick={onClose}
                className="bg-white/10 backdrop-blur-xl p-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-white/70 text-sm">
              Export your CineFlow project in various formats and destinations
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Export Format */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Export Format</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setExportFormat('video')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    exportFormat === 'video'
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Video className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Video</span>
                  <span className="text-xs text-white/50 mt-1">MP4/WebM</span>
                </button>
                
                <button
                  onClick={() => setExportFormat('image-sequence')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    exportFormat === 'image-sequence'
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Image className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Images</span>
                  <span className="text-xs text-white/50 mt-1">PNG Sequence</span>
                </button>
                
                <button
                  onClick={() => setExportFormat('json')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    exportFormat === 'json'
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileJson className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Project</span>
                  <span className="text-xs text-white/50 mt-1">JSON Config</span>
                </button>
              </div>
            </div>

            {/* Export Destination */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Export Destination</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setExportDestination('download')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    exportDestination === 'download'
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Download className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Download</span>
                  <span className="text-xs text-white/50 mt-1">Save locally</span>
                </button>
                
                <button
                  onClick={() => setExportDestination('assets')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    exportDestination === 'assets'
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Save className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Assets</span>
                  <span className="text-xs text-white/50 mt-1">Save to library</span>
                </button>
                
                <button
                  onClick={() => setExportDestination('cloud')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    exportDestination === 'cloud'
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Cloud className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Cloud</span>
                  <span className="text-xs text-white/50 mt-1">Google Drive</span>
                </button>
              </div>
            </div>

            {/* Export Settings */}
            {exportFormat !== 'json' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Export Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Resolution
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="720p" className="bg-gray-900">720p (HD)</option>
                      <option value="1080p" className="bg-gray-900">1080p (Full HD)</option>
                      <option value="2160p" className="bg-gray-900">2160p (4K)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Quality
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    >
                      <option value="low" className="bg-gray-900">Low (Faster)</option>
                      <option value="medium" className="bg-gray-900">Medium</option>
                      <option value="high" className="bg-gray-900">High (Better Quality)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 text-sm font-semibold mb-1">Export Information</p>
                  <p className="text-white/70 text-xs">
                    {exportFormat === 'video' && 'Video export may take several minutes depending on the complexity and duration of your project.'}
                    {exportFormat === 'image-sequence' && 'Image sequence will be exported as a ZIP file containing PNG images for each frame.'}
                    {exportFormat === 'json' && 'JSON export contains your project configuration for backup or sharing with others.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Export Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;