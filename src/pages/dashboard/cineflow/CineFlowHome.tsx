// CineFlowHome.tsx
import { useState, useEffect } from 'react';
import { Film, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import { toast } from '../../../contexts/ToastContext';
import { CineFlowProject } from '@/types/cineflow';
import { getAllProjects } from '@/services/api/projects';
// Import section components
import StatsSection from './sections/StatsSection';
import SearchFilterBar from './sections/SearchFilterBar';
import EmptyState from './sections/EmptyState';
import ProjectCard from './sections/ProjectCard';
import NewProjectModal from './sections/NewProjectModal';
import { AspectRatio } from '@/types/cineflow';

export default function CineFlowHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projects, setProjects] = useState<CineFlowProject[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAllProjects();
        setProjects(result);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load projects');
      }
    };
    load();
  }, []);

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ));

  // Handle creating a new project
  const handleCreateProject = (formData: {
    name: string;
    description: string;
    aspectRatio: AspectRatio;
    tags: string[];
  }) => {
    if (!formData.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const newProject: CineFlowProject = {
      id: `cf${Date.now()}`,
      name: formData.name,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: formData.description,
      aspectRatio: formData.aspectRatio,
      duration: 5,
      status: 'draft',
      elements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || []
    };

    setProjects([newProject, ...projects]);
    setShowNewProjectModal(false);

    // Navigate to editor
    navigate(`/dashboard/cineflow/editor/${newProject.id}`, {
      state: { 
        project: newProject,
        imported: false,
        metadata: { source: 'new' } 
      }
    });

    toast.success('New CineFlow project created', {
      subtext: 'Opening editor...',
      duration: 3000
    });
  };

  const handleImportProject = (importedProject: { metadata: any; project: CineFlowProject }) => {
    try {
      // Validate required fields
      const project = importedProject.project;

      if (!project?.name?.trim()) {
        throw new Error('Imported project is missing a name');
      }

      const sanitizedProject: CineFlowProject = {
        id: `cf${Date.now()}`,
        name: project.name.trim(),
        description: project.description || '',
        aspectRatio: project.aspectRatio || '1:1',
        duration: typeof project.duration === 'number' ? project.duration : 5,
        status: 'draft',
        elements: project.elements || [],
        tags: project.tags || [],
        thumbnail: project.thumbnail || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update state
      setProjects(prev => [sanitizedProject, ...prev]);
      setShowNewProjectModal(false);

      // Navigate to editor
      navigate(`/dashboard/cineflow/editor/${sanitizedProject.id}`, {
        state: { 
          project: sanitizedProject, 
          imported: true, 
          metadata: importedProject.metadata 
        }
      });

      toast.success('Project imported successfully', {
        subtext: 'Opening editor...',
        duration: 3000
      });

    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import project', {
        subtext: error instanceof Error ? error.message : 'Invalid project file',
        duration: 5000
      });
    }
  };

  // Handle deleting a project
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast.success('Project deleted successfully');
  };

  // Handle opening a project in the editor
  const handleOpenProject = (project: CineFlowProject) => {
    navigate(`/dashboard/cineflow/editor/${project.id}`, {
      state: { project }
    });
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-2 md:p-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-lg">
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
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-lg">
          {filteredProjects.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              onCreateNew={() => setShowNewProjectModal(true)}
            />
          ) : (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  handleOpenProject={() => handleOpenProject(project)}
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
        onImportProject={handleImportProject}
      />
    </ErrorBoundary>
  );
}