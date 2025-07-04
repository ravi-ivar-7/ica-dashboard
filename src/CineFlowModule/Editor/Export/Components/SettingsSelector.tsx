// export/components/SettingsSelector.tsx
import React from 'react';
import { ExportConfig } from '../Types/ExportTypes';

interface SettingsSelectorProps {
  config: ExportConfig;
  onChange: (config: Partial<ExportConfig>) => void;
  showSettings: boolean;
}

export const SettingsSelector: React.FC<SettingsSelectorProps> = ({ 
  config, 
  onChange,
  showSettings 
}) => {
  if (!showSettings) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-white/80 text-xs mb-1">Resolution</label>
        <select
          value={config.resolution}
          onChange={(e) => onChange({ resolution: e.target.value as any })}
          className="w-full bg-gray-800  border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
        >
          <option value="240p">240p (Low)</option>
          <option value="360p">360p (SD)</option>
          <option value="480p">480p (SD+)</option>
          <option value="720p">720p (HD)</option>
          <option value="1080p">1080p (Full HD)</option>
          <option value="2160p">2160p (4K)</option>
        </select>
      </div>
      <div>
        <label className="block text-white/80 text-xs mb-1">Quality</label>
        <select
          value={config.quality}
          onChange={(e) => onChange({ quality: e.target.value as any })}
          className="w-full bg-gray-800 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white"
        >
          <option value="low">Low (Faster)</option>
          <option value="medium">Medium</option>
          <option value="high">High (Quality)</option>
        </select>
      </div>
    </div>
  );
};
