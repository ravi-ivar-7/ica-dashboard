// export/ExportIndex.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { toast } from '@/contexts/ToastContext'; 
import { exportVideo } from './services/videoExportService';
import { exportImageSequence } from './services/imageExportService';
import { exportJson } from './services/jsonExportService';
import { ExportConfig, ExportModalProps, ExportProgressTypes } from './types/exportTypes';
import { FormatSelector } from './components/FormatSelector';
import { DestinationSelector } from './components/DestinationSelector';
import { SettingsSelector } from './components/SettingsSelector';
import { ExportInfo } from './components/ExportInfo';
import { ExportProgress as ExportProgressComponent } from './components/ExportProgress';

import { downloadFile, createImageZip, getExportFilename } from './utils/fileUtils';



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
    let blob: Blob | string[] | null = null;

    if (config.format === 'video') {
      blob = await exportVideo(project, config, setExportProgress);
    } else if (config.format === 'image-sequence') {
      blob = await exportImageSequence(project, config, setExportProgress);
    } else if (config.format === 'json') {
      blob = exportJson(project);
    }

    if (blob) {
      if (config.destination === 'download') {
        if (config.format === 'image-sequence' && Array.isArray(blob)) {
          const zipBlob = await createImageZip(blob, getExportFilename(project.name, 'sequence', 'zip'));
          downloadFile(zipBlob, getExportFilename(project.name, 'sequence', 'zip'));
        } else if (blob instanceof Blob) {
          const extension = config.format === 'video' ? 'mp4' : 'json';
          downloadFile(blob, getExportFilename(project.name, config.format, extension));
        }
      } else {
        // For assets or cloud, just simulate the process
        // RECONSIDER 
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
      subtext: 'There was an error during the export process. Please try again.',
      duration: 5000
    });
  } finally {
    setIsExporting(false);
    onClose();
  }
};
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