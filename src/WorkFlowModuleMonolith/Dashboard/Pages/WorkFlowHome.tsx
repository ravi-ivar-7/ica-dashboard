// WorkflowHome.tsx
import { useState, useEffect } from 'react';
import { Workflow, Plus, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
import { toast } from '@/CommonModule/Contexts/ToastContext';
import { WorkflowProject } from '@/WorkFlowModule/Types/workflow';
import { getAllWorkflows } from '@/WorkFlowModule/Editor/APIs/workflow';

// Import section components 
import SearchFilterBar from '../Components/SearchFilterBar';
import EmptyState from '../Components/EmptyState';
import WorkflowCard from '../Components/WorkflowCard';
import NewWorkflowModal from '../Components/NewWorkflowModal';

export default function WorkflowHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowProject[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAllWorkflows();
        setWorkflows(result);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load workflows');
      }
    };
    load();
  }, []);

  // Filter workflows based on search
  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (workflow.tags && workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Handle creating a new workflow
  const handleCreateWorkflow = (formData: {
    name: string;
    description: string;
    tags: string[];
  }) => {
    if (!formData.name.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    const newWorkflow: WorkflowProject = {
      id: `wf${Date.now()}`,
      name: formData.name,
      thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: formData.description,
      status: 'draft',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || []
    };

    setWorkflows([newWorkflow, ...workflows]);
    setShowNewWorkflowModal(false);

    // Navigate to editor
    navigate(`/dashboard/workflow/editor/${newWorkflow.id}`, {
      state: {
        workflow: newWorkflow,
        imported: false,
        metadata: { source: 'new' }
      }
    });

    toast.success('New AI Workflow created', {
      subtext: 'Opening workflow builder...',
      duration: 3000
    });
  };

  const handleImportWorkflow = (importedWorkflow: { metadata: any; workflow: WorkflowProject }) => {
    try {
      // Validate required fields
      const workflow = importedWorkflow.workflow;

      if (!workflow?.name?.trim()) {
        throw new Error('Imported workflow is missing a name');
      }

      const sanitizedWorkflow: WorkflowProject = {
        id: `wf${Date.now()}`,
        name: workflow.name.trim(),
        description: workflow.description || '',
        status: 'draft',
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        tags: workflow.tags || [],
        thumbnail: workflow.thumbnail || 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        createdAt: workflow.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update state
      setWorkflows(prev => [sanitizedWorkflow, ...prev]);
      setShowNewWorkflowModal(false);

      // Navigate to editor
      navigate(`/dashboard/workflow/editor/${sanitizedWorkflow.id}`, {
        state: {
          workflow: sanitizedWorkflow,
          imported: true,
          metadata: importedWorkflow.metadata
        }
      });

      toast.success('Workflow imported successfully', {
        subtext: 'Opening workflow builder...',
        duration: 3000
      });

    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import workflow', {
        subtext: error instanceof Error ? error.message : 'Invalid workflow file',
        duration: 5000
      });
    }
  };

  // Handle deleting a workflow
  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(workflow => workflow.id !== id));
    toast.success('Workflow deleted successfully');
  };

  // Handle opening a workflow in the editor
  const handleOpenWorkflow = (workflow: WorkflowProject) => {
    navigate(`/dashboard/workflow/editor/${workflow.id}`, {
      state: { workflow, imported: false, metadata: { source: 'existing' } }
    });
  };


  return (
    <ErrorBoundary>
      <div className="space-y-6 p-2 md:p-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Workflow className="w-8 h-8 mr-3 text-blue-400" />
              AI Workflows
            </h1>
            <p className="text-lg text-white/70">
              Chain AI models to automate creative processes
            </p>
          </div>

          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowNewWorkflowModal(true)}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black px-6 py-2.5 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
            >
              <Plus className="w-5 h-5" />
              <span>New Workflow</span>
            </button>
          </div>
        </div>

        {/* Search and View Options */}
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          placeholder="Search workflows, tags, or AI models..."
        />

        {/* Workflows Grid/List */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-lg">
          {filteredWorkflows.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              onCreateNew={() => setShowNewWorkflowModal(true)}
              emptyMessage="No workflows found. Create your first AI automation workflow!"
            />
          ) : (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  viewMode={viewMode}
                  onOpen={() => handleOpenWorkflow(workflow)}
                  onDelete={() => handleDeleteWorkflow(workflow.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Workflow Modal */}
      <NewWorkflowModal
        isOpen={showNewWorkflowModal}
        onClose={() => setShowNewWorkflowModal(false)}
        onCreateWorkflow={handleCreateWorkflow}
        onImportWorkflow={handleImportWorkflow}
      />
    </ErrorBoundary>
  );
}