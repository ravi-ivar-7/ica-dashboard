import React from 'react';
import { Film, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  onCreateNew: () => void;
}

export default function EmptyState({ searchQuery, onCreateNew }: EmptyStateProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-full inline-block mb-4">
        <Film className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {searchQuery ? 'No matching projects found' : 'No projects yet'}
      </h3>
      <p className="text-white/70 mb-6">
        {searchQuery 
          ? 'Try adjusting your search terms' 
          : 'Create your first CineFlow project to get started'}
      </p>
      <button 
        onClick={onCreateNew}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        <span>Create New CineFlow</span>
      </button>
    </div>
  );
}