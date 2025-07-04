// export/components/FormatSelector.tsx
import React from 'react';
import { Video, Image as ImageIcon, FileJson } from 'lucide-react';
import { ExportFormat } from '../Types/ExportTypes';

interface FormatSelectorProps {
  format: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const formatOptions = [
  { value: 'video', icon: Video, label: 'Video', desc: 'MP4/WebM' },
  { value: 'image-sequence', icon: ImageIcon, label: 'Images', desc: 'PNG Seq' },
  { value: 'json', icon: FileJson, label: 'Project', desc: 'JSON' }
];

export const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onChange }) => (
  <div>
    <h3 className="text-sm font-semibold text-white mb-2">Format</h3>
    <div className="grid grid-cols-3 gap-2">
      {formatOptions.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value as ExportFormat)}
          className={`flex flex-col items-center p-2 rounded-lg border text-xs ${
            format === item.value
              ? 'bg-amber-500/20 border-amber-500/50 text-white'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
          }`}
        >
          <item.icon className="w-4 h-4 mb-1" />
          <span className="font-medium">{item.label}</span>
          <span className="text-white/50">{item.desc}</span>
        </button>
      ))}
    </div>
  </div>
);