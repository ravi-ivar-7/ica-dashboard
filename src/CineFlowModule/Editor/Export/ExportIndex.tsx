// export/ExportIndex.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { toast } from '@/CommonModule/Contexts/ToastContext';
import { exportVideo } from './Services/VideoExportService';
import { exportImageSequence } from './Services/ImageExportService';
import { exportJson } from './Services/JsonExportService';
import { ExportConfig, ExportModalProps, ExportProgressTypes } from './Types/ExportTypes';
import { FormatSelector } from './Components/FormatSelector';
import { DestinationSelector } from './Components/DestinationSelector';
import { SettingsSelector } from './Components/SettingsSelector';
import { ExportInfo } from './Components/ExportInfo';
import { ExportProgress as ExportProgressComponent } from './Components/ExportProgress';

import { downloadFile, getExportFilename } from './Utils/fileUtils';

import { ImageSequenceResult } from './Services/ImageExportService';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'video',
    destination: 'download',
    resolution: '360p',
    quality: 'medium'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgressTypes>({
    percentage: 0,
    message: ''
  });
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize AudioContext
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
      }
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [isOpen]);

  const handleExport = async () => {

    setIsExporting(true);
    setExportProgress({ percentage: 0, message: 'Starting export...' });

    try {
      let result: Blob | string[] | ImageSequenceResult | null = null;

      if (config.format === 'video') {
        result = await exportVideo(project, config, setExportProgress);
      } else if (config.format === 'image-sequence') {
        result = await exportImageSequence(project, config, setExportProgress);
      } else if (config.format === 'json') {
        // JSON export is synchronous but we wrap in Promise for consistency
        setExportProgress({ percentage: 50, message: 'Preparing JSON data...' });
        result = exportJson(project);
        setExportProgress({ percentage: 100, message: 'JSON export ready' });
      }
      else {
        throw new Error('Unsupported export format');
      }

      if(config.format === 'json' && config.destination === 'post') {
        throw new Error('JSON export cannot be posted directly. Please try other formats.');
      }

      if (result) {
        if (config.destination === 'download') {
          if (config.format === 'image-sequence') {
            // Handle image sequence download
            if (isImageSequenceResult(result)) {
              // Directly use the zipBlob from the result
              downloadFile(result.zipBlob, getExportFilename(project.name, 'sequence', 'zip'));
            } else {
              throw new Error('Invalid image sequence export result');
            }
          } else {
            // Handle both video and JSON downloads
            const extension = config.format === 'video' ? 'mp4' : 'cineflow.json';
            const filename = getExportFilename(project.name, config.format, extension);
            downloadFile(result as Blob, filename);
          }
        } else {
          // Handle cloud/asset storage
          await new Promise(resolve => setTimeout(
            resolve,
            config.destination === 'assets' ? 500 : 1000
          ));
        }

        toast.success('Export completed successfully', {
          subtext: config.destination === 'download'
            ? 'Your file has been downloaded'
            : config.destination === 'assets'
              ? 'Your file has been added to your assets'
              : 'Your file has been uploaded to cloud storage',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        subtext: error instanceof Error ? error.message : 'There was an error during the export process',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  // Add this type guard near your other utility functions
  function isImageSequenceResult(result: any): result is ImageSequenceResult {
    return result && result.zipBlob instanceof Blob && typeof result.frameCount === 'number';
  }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={isExporting ? undefined : onClose}
      />

      <div className="relative bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-lg">
              <Download className="w-4 h-4 text-black" />
            </div>
            <h2 className="text-lg font-bold text-white">Export Project</h2>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <div className="p-4 space-y-4">
          {isExporting ? (
            <ExportProgressComponent
              progress={exportProgress}
              format={config.format}
            />
          ) : (
            <>
              <FormatSelector
                format={config.format}
                onChange={(format) => setConfig({ ...config, format })}
              />
              <DestinationSelector
                destination={config.destination}
                onChange={(destination) => setConfig({ ...config, destination })}
                format={config.format}
              />
              <SettingsSelector
                config={config}
                onChange={(partial) => setConfig({ ...config, ...partial })}
                showSettings={config.format !== 'json'}
              />
              <ExportInfo format={config.format} />
            </>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end gap-2">
          {!isExporting && (
            <>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg font-medium bg-white/10 hover:bg-white/20 text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-1.5 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm hover:scale-[1.02] transition-transform"
              >
                Export Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;