import React from 'react';
import { MoreHorizontal, Download, Edit, Trash2, Eye, Heart, Play } from 'lucide-react';

interface AssetCardProps {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  thumbnail: string;
  size: string;
  createdAt: string;
  status: 'processing' | 'ready' | 'failed';
  likes?: number;
  views?: number;
}

export default function AssetCard({
  id,
  name,
  type,
  thumbnail,
  size,
  createdAt,
  status,
  likes = 0,
  views = 0
}: AssetCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'image':
        return <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-md"><Eye className="w-3 h-3 text-white" /></div>;
      case 'video':
        return <div className="bg-gradient-to-r from-red-500 to-pink-500 p-1 rounded-md"><Play className="w-3 h-3 text-white" /></div>;
      case 'audio':
        return <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-md"><Play className="w-3 h-3 text-white" /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-1">
              <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-1.5 hover:bg-white/30 transition-colors">
                <Eye className="w-3 h-3 text-white" />
              </button>
              <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-1.5 hover:bg-white/30 transition-colors">
                <Download className="w-3 h-3 text-white" />
              </button>
              <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-1.5 hover:bg-white/30 transition-colors">
                <Edit className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-1.5 left-1.5">
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-xl ${getStatusColor()}`}>
            {status}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-1.5 right-1.5">
          {getTypeIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-xs truncate mb-0.5">
              {name}
            </h3>
            <p className="text-white/60 text-[10px]">
              {size} • {createdAt}
            </p>
          </div>
          
          <button className="text-white/60 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              <Heart className="w-2.5 h-2.5 text-red-400" />
              <span className="text-white/60 text-[10px]">
                {likes}
              </span>
            </div>
            <div className="flex items-center space-x-0.5">
              <Eye className="w-2.5 h-2.5 text-blue-400" />
              <span className="text-white/60 text-[10px]">
                {views}
              </span>
            </div>
          </div>
          
          <button className="text-red-400 hover:text-red-300 p-0.5 rounded-md hover:bg-red-500/10 transition-colors">
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}