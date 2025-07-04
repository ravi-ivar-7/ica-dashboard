// export/components/ExportProgress.tsx
import React from 'react';
import { Loader } from 'lucide-react';
import { ExportProgressTypes } from '../Types/ExportTypes';
 

interface ExportProgressProps {
  progress: ExportProgressTypes;
  format: string;
}

export const ExportProgress: React.FC<ExportProgressProps> = ({ progress, format }) => (
  <div className="text-center py-4 space-y-4">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-2">
      <Loader className="w-5 h-5 text-white animate-spin" />
    </div>
    <h3 className="text-lg font-bold text-white">
      Exporting {format === 'video' ? 'Video' : format === 'image-sequence' ? 'Images' : 'Project'}
    </h3>
    <p className="text-white/70 text-sm">{progress.message}</p>
    <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
      <div 
        className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
        style={{ width: `${progress.percentage}%` }}
      />
    </div>
    <p className="text-white/50 text-xs">{progress.percentage}% complete</p>
  </div>
);