import { Search, Grid, List } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  placeholder?: string;
}

export default function SearchFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  viewMode, 
  setViewMode,
  placeholder = "Search workflows, tags, or AI models..."
}: SearchFilterBarProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
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
                  ? 'bg-blue-500 text-white' 
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