import React, { useState } from 'react';
import { Film, Plus, Search, Filter, Grid, List, X, Check, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import { toast } from '../../../contexts/ToastContext';

// Import section components
import StatsSection from './sections/StatsSection';
import SearchFilterBar from './sections/SearchFilterBar';
import EmptyState from './sections/EmptyState';
import ProjectCard from './sections/ProjectCard';
import NewProjectModal from './sections/NewProjectModal';

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

export default function CineFlowHome() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Filter projects based on search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle creating a new project
  const handleCreateProject = (formData: any) => {
    if (!formData.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const newProject = {
      id: `cf${Date.now()}`,
      name: formData.name,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: formData.type,
      aspectRatio: formData.aspectRatio,
      duration: '00:00:00',
      lastEdited: 'Just now',
      status: 'draft',
      tags: formData.tags
    };

    setProjects([newProject, ...projects]);
    setShowNewProjectModal(false);
    
    // Navigate to editor
    navigate(`/dashboard/cineflow/editor/${newProject.id}`);
    
    toast.success('New CineFlow project created', {
      subtext: 'Opening editor...',
      duration: 3000
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
        <StatsSection projects={projects} />

        {/* Search and View Options */}
        <SearchFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        {/* Projects Grid/List */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {filteredProjects.length === 0 ? (
            <EmptyState 
              searchQuery={searchQuery} 
              onCreateNew={() => setShowNewProjectModal(true)} 
            />
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  handleOpenProject={handleOpenProject}
                  handleDeleteProject={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
      />
    </ErrorBoundary>
  );
}