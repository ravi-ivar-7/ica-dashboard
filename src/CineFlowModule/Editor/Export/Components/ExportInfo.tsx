// export/components/ExportInfo.tsx
import React from 'react';
import { ExportFormat } from '../Types/ExportTypes';

interface ExportInfoProps {
  format: ExportFormat;
}

export const ExportInfo: React.FC<ExportInfoProps> = ({ format }) => (
  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-xs text-white/80">
    <p>
      {format === 'video' && 'Video export may take several minutes depending on project complexity.'}
      {format === 'image-sequence' && 'Image sequence will be exported as a ZIP file.'}
      {format === 'json' && 'JSON contains project configuration for backup.'}
    </p>
  </div>
);