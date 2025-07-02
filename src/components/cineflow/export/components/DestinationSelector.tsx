// export/components/DestinationSelector.tsx
import React from 'react';
import { Download, Save, Cloud } from 'lucide-react';
import { ExportDestination } from '../types/exportTypes';

interface DestinationSelectorProps {
  destination: ExportDestination;
  onChange: (destination: ExportDestination) => void;
}

const destinationOptions = [
  { value: 'download', icon: Download, label: 'Download', desc: 'Local' },
  { value: 'assets', icon: Save, label: 'Assets', desc: 'Library' },
  { value: 'cloud', icon: Cloud, label: 'Cloud', desc: 'Drive' }
];

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({ destination, onChange }) => (
  <div>
    <h3 className="text-sm font-semibold text-white mb-2">Destination</h3>
    <div className="grid grid-cols-3 gap-2">
      {destinationOptions.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value as ExportDestination)}
          className={`flex flex-col items-center p-2 rounded-lg border text-xs ${
            destination === item.value
              ? 'bg-amber-500/20 border-amber500/50 text-white'
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