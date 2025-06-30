import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface ModelParameter {
  id: string;
  name: string;
  description: string;
  type: 'slider' | 'select' | 'checkbox' | 'color' | 'text';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  defaultValue: any;
  helpText?: string;
}

interface ParameterControlProps {
  parameter: ModelParameter;
  value: any;
  onChange: (id: string, value: any) => void;
}

export default function ParameterControl({ parameter, value, onChange }: ParameterControlProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleChange = (newValue: any) => {
    onChange(parameter.id, newValue);
  };

  const renderHelpText = () => {
    if (!parameter.helpText) return null;
    
    return (
      <div className="relative inline-block ml-1">
        <button
          type="button"
          className="text-white/60 hover:text-white/80 transition-colors focus:outline-none"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
        
        {showTooltip && (
          <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1">
            {parameter.helpText}
            <div className="absolute w-2 h-2 bg-gray-900 border-t border-l border-white/20 transform rotate-45 -top-1 left-2"></div>
          </div>
        )}
      </div>
    );
  };

  switch (parameter.type) {
    case 'slider':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-white font-semibold text-sm flex items-center">
              {parameter.name}
              {renderHelpText()}
            </label>
            <span className="text-white/70 text-sm">{value}</span>
          </div>
          <input
            type="range"
            min={parameter.min || 0}
            max={parameter.max || 100}
            step={parameter.step || 1}
            value={value}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500"
          />
          <p className="text-white/50 text-sm">{parameter.description}</p>
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <label className="block text-white font-semibold text-sm flex items-center">
            {parameter.name}
            {renderHelpText()}
          </label>
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all text-base"
          >
            {parameter.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-white/50 text-sm">{parameter.description}</p>
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id={parameter.id}
            checked={value}
            onChange={(e) => handleChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-400 focus:ring-1"
          />
          <div>
            <label htmlFor={parameter.id} className="text-white font-semibold text-sm flex items-center">
              {parameter.name}
              {renderHelpText()}
            </label>
            <p className="text-white/50 text-sm">{parameter.description}</p>
          </div>
        </div>
      );

    case 'color':
      return (
        <div className="space-y-2">
          <label className="block text-white font-semibold text-sm flex items-center">
            {parameter.name}
            {renderHelpText()}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="h-8 w-8 rounded-lg border-0 bg-transparent"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all text-base"
            />
          </div>
          <p className="text-white/50 text-sm">{parameter.description}</p>
        </div>
      );

    case 'text':
    default:
      return (
        <div className="space-y-2">
          <label className="block text-white font-semibold text-sm flex items-center">
            {parameter.name}
            {renderHelpText()}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            rows={parameter.name.toLowerCase().includes('prompt') ? 3 : 2}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all resize-none text-base"
            placeholder={parameter.description}
          />
          <p className="text-white/50 text-sm">{parameter.description}</p>
        </div>
      );
  }
}