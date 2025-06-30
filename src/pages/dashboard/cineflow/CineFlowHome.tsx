import React, { useState } from 'react';
import { Film, Plus, Clock, Video, Play, Pencil, Trash2, Search, Filter, Grid, List, X, Check, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import { toast } from '../../../contexts/ToastContext';

// Mock data for CineFlow projects
const mockProjects = [
  {
    id: 'cf1',
    name: 'Summer Vacation Highlights',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    type: 'Montage',
    aspectRatio: '16:9',
    duration: '00:01:45',
    lastEdited: '2 hours ago',
    status: 'draft',
    tags: ['vacation', 'summer', 'family']
  },
  {
    id: 'cf2',
    name: 'Product Launch Teaser',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    type: 'Trailer',
    aspectRatio: '16:9',
    duration: '00:00:30',
    lastEdited: '1 day ago',
    status: 'completed',
    tags: ['product', 'business', 'promo']
  },
  {
    id: 'cf3',
    name: 'Instagram Story Collection',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    type: 'Reel',
    aspectRatio: '9:16',
    duration: '00:00:15',
    lastEdited: '3 days ago',
    status: 'draft',
    tags: ['instagram', 'social', 'vertical']
  },
  {
    id: 'cf4',
    name: 'Brand Intro Video',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    type: 'Custom',
    aspectRatio: '16:9',
    duration: '00:00:45',
    lastEdited: '1 week ago',
    status: 'completed',
    tags: ['brand', 'intro', 'corporate']
  }
];

// Interface for the new project form
interface NewProjectForm {
  name: string;
  type: 'Reel' | 'Trailer' | 'Montage' | 'Custom';
  aspectRatio: '16:9' | '9:16' | '1:1';
  tags: string[];
}

export default function CineFlowHome() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState<NewProjectForm>({
    name: '',
    type: 'Reel',
    aspectRatio: '16:9',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  // Filter projects based on search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle creating a new project
  const handleCreateProject = () => {
    if (!newProjectForm.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const newProject = {
      id: `cf${Date.now()}`,
      name: newProjectForm.name,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: newProjectForm.type,
      aspectRatio: newProjectForm.aspectRatio,
      duration: '00:00:00',
      lastEdited: 'Just now',
      status: 'draft',
      tags: newProjectForm.tags
    };

    setProjects([newProject, ...projects]);
    setShowNewProjectModal(false);
    
    // Reset form
    setNewProjectForm({
      name: '',
      type: 'Reel',
      aspectRatio: '16:9',
      tags: []
    });

    // Navigate to editor
    navigate(`/dashboard/cineflow/editor/${newProject.id}`);
    
    toast.success('New CineFlow project created', {
      subtext: 'Opening editor...',
      duration: 3000
    });
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (newTag.trim() && !newProjectForm.tags.includes(newTag.trim())) {
      setNewProjectForm({
        ...newProjectForm,
        tags: [...newProjectForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setNewProjectForm({
      ...newProjectForm,
      tags: newProjectForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle deleting a project
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast.success('Project deleted successfully');
  };

  // Handle opening a project in the editor
  const handleOpenProject = (id: string) => {
    navigate(`/dashboard/cineflow/editor/${id}`);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Film className="w-8 h-8 mr-3 text-amber-400" />
              CineFlow
            </h1>
            <p className="text-lg text-white/70">
              Create cinematic videos with our timeline editor
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Create New CineFlow</span>
            </button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{projects.length}</h3>
                  <p className="text-white/60 text-sm">Total Projects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">2 hours ago</h3>
                  <p className="text-white/60 text-sm">Last Edit</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Learn CineFlow</h3>
                  <p className="text-white/60 text-sm">Watch tutorial</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Options */}
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
        
        {/* Projects Grid/List */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
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
                onClick={() => setShowNewProjectModal(true)}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create New CineFlow</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredProjects.map((project) => (
                viewMode === 'grid' ? (
                  <div 
                    key={project.id} 
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
                    key={project.id}
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
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewProjectModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white flex items-center">
                <Film className="w-6 h-6 mr-2 text-amber-400" />
                Create New CineFlow
              </h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({...newProjectForm, name: e.target.value})}
                  placeholder="Enter project name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Video Type
                </label>
                <select
                  value={newProjectForm.type}
                  onChange={(e) => setNewProjectForm({...newProjectForm, type: e.target.value as any})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                >
                  <option value="Reel" className="bg-gray-900">Reel</option>
                  <option value="Trailer" className="bg-gray-900">Trailer</option>
                  <option value="Montage" className="bg-gray-900">Montage</option>
                  <option value="Custom" className="bg-gray-900">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Aspect Ratio
                </label>
                <div className="flex space-x-3">
                  {['16:9', '9:16', '1:1'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setNewProjectForm({...newProjectForm, aspectRatio: ratio as any})}
                      className={`flex-1 py-2.5 rounded-xl text-center font-semibold transition-colors ${
                        newProjectForm.aspectRatio === ratio
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Tags (optional)
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProjectForm.tags.map((tag, index) => (
                    <div key={index} className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Create Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}