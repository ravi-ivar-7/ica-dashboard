import {  Pencil, Trash2 } from 'lucide-react';
import type { WorkflowProject } from '@/types/workflow';

interface WorkflowCardProps {
  workflow: WorkflowProject;
  viewMode: 'grid' | 'list';
  onOpen: () => void;
  onDelete: () => void;
}

const formatLastEdited = (updatedAt: string): string => {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diff = Math.floor((now.getTime() - updated.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;

  return updated.toLocaleDateString();
};

const getStatusBadge = (status: WorkflowProject['status']) => {
  switch (status) {
    case 'active':
      return {
        text: 'Active',
        className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
      };
    case 'archived':
      return {
        text: 'Archived',
        className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
      };
    default:
      return {
        text: 'Draft',
        className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      };
  }
};

export default function WorkflowCard({
  workflow,
  viewMode,
  onOpen,
  onDelete,
}: WorkflowCardProps) {
  const lastEditedStr = formatLastEdited(workflow.updatedAt);
  const badge = getStatusBadge(workflow.status);
  const nodeCount = workflow.nodes.length;

  return viewMode === 'grid' ? (
    <div className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
      <div className="relative">
        <img
          src={workflow.thumbnail}
          alt={workflow.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="flex space-x-2">
            <button
              onClick={onOpen}
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors"
              title="Edit workflow"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-full p-2 hover:bg-red-500/30 transition-colors"
              title="Delete workflow"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.className} backdrop-blur-xl`}>
            {badge.text}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-1 truncate">{workflow.name}</h3>
        <div className="flex items-center justify-between text-white/60 text-xs mb-2">
          <span>{nodeCount} nodes</span>
          <span>Edited {lastEditedStr}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:border-white/30 transition-all duration-300">
      <div className="relative w-24 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
        <img src={workflow.thumbnail} alt={workflow.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-bold text-base truncate">{workflow.name}</h3>
          <div className="flex space-x-1">
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${badge.className} backdrop-blur-xl`}>
              {badge.text}
            </span>
          </div>
        </div>

        <div className="flex items-center text-white/60 text-xs mb-1">
          <span>{nodeCount} nodes • Edited {lastEditedStr}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">

        <button
          onClick={onOpen}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Edit workflow"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
          title="Delete workflow"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}