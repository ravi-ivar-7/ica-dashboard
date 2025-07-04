import React from 'react';
import { Workflow, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  onCreateNew: () => void;
  emptyMessage?: string;
}

export default function EmptyState({ 
  searchQuery, 
  onCreateNew,
  emptyMessage = "No workflows found. Create your first AI automation workflow!"
}: EmptyStateProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-full inline-block mb-4">
        <Workflow className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {searchQuery ? 'No matching workflows found' : emptyMessage}
      </h3>
      <p className="text-white/70 mb-6">
        {searchQuery 
          ? 'Try adjusting your search terms' 
          : 'Chain AI models to automate creative processes'}
      </p>
      <button 
        onClick={onCreateNew}
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        <span>New Workflow</span>
      </button>
    </div>
  );
}