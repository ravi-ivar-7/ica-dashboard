import React from 'react';
import { Film, Clock, Play, Pencil, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    thumbnail: string;
    type: string;
    aspectRatio: string;
    duration: string;
    lastEdited: string;
    status: string;
    tags: string[];
  };
  viewMode: 'grid' | 'list';
  handleOpenProject: (id: string) => void;
  handleDeleteProject: (id: string) => void;
}

export default function ProjectCard({ 
  project, 
  viewMode, 
  handleOpenProject, 
  handleDeleteProject 
}: ProjectCardProps) {
  return viewMode === 'grid' ? (
    <div 
      className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
    >
      <div className="relative">
        <img 
          src={project.thumbnail} 
          alt={project.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleOpenProject(project.id)}
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <Play className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => handleOpenProject(project.id)}
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => handleDeleteProject(project.id)}
              className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-full p-2 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            project.status === 'completed' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          } backdrop-blur-xl`}>
            {project.status === 'completed' ? 'Completed' : 'Draft'}
          </span>
        </div>
        
        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
            {project.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-1 truncate">{project.name}</h3>
        <div className="flex items-center justify-between text-white/60 text-xs mb-2">
          <span>{project.aspectRatio} • {project.duration}</span>
          <span>Edited {project.lastEdited}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags.map((tag, index) => (
            <span key={index} className="bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div 
      className="flex items-center bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:border-white/30 transition-all duration-300"
    >
      <div className="relative w-24 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
        <img 
          src={project.thumbnail} 
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-bold text-base truncate">{project.name}</h3>
          <div className="flex space-x-1">
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              project.status === 'completed' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            } backdrop-blur-xl`}>
              {project.status === 'completed' ? 'Completed' : 'Draft'}
            </span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur-xl">
              {project.type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-white/60 text-xs mb-1">
          <span>{project.aspectRatio} • {project.duration} • Edited {project.lastEdited}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <button 
          onClick={() => handleOpenProject(project.id)}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Open project"
        >
          <Play className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleOpenProject(project.id)}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Edit project"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDeleteProject(project.id)}
          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}