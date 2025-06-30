import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient: string;
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  gradient 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-emerald-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className={`bg-gradient-to-r ${gradient} p-2 rounded-lg shadow-md`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-white mb-0.5">
            {value}
          </div>
          <div className={`text-xs font-semibold ${getChangeColor()}`}>
            {change}
          </div>
        </div>
      </div>
      <div className="text-white/70 font-semibold text-xs">
        {title}
      </div>
    </div>
  );
}