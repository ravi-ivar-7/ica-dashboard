import React from 'react';
import { Search, Grid, List } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function SearchFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  viewMode, 
  setViewMode 
}: SearchFilterBarProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid' 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              } transition-colors`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list' 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              } transition-colors`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}