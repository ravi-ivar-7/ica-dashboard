import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Play, Download, ArrowLeft, Undo, Redo, Settings as SettingsIcon } from 'lucide-react';
import { toast } from '@/CommonModule/Contexts/ToastContext';

import { WorkflowProject, WorkflowNode, WorkflowEditorState } from '@/WorkFlowModule/Types/workflow';
import WorkflowCanvas from '@/WorkFlowModule/Editor/Components/WorkflowCanvas';
import NodeLibrary from '@/WorkFlowModule/Editor/Components/NodeLibrary';
import PropertiesPanel from '@/WorkFlowModule/Editor/Components/PropertiesPanel';
import { WorkflowEngine } from '@/WorkFlowModule/Editor/Nodes/WorkflowEngine';

export default function WorkFlowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<WorkflowEditorState>({
    project: {
      id: id || 'new',
      name: 'Untitled Workflow',
      description: '',
      status: 'draft',
      nodes: [],
      edges: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    viewport: { x: 0, y: 0, zoom: 1 },
    panels: { leftPanel: true, rightPanel: true },
    history: [],
    historyIndex: -1,
    isDirty: false,
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const workflowEngine = WorkflowEngine.getInstance();

  // Load workflow on mount
  useEffect(() => {
    if (id && id !== 'new') {
      loadWorkflow(id);
    } else {
      // Initialize with a sample workflow for demo
      initializeSampleWorkflow();
    }
  }, [id]);


const loadWorkflow = async (workflowId: string) => {
  try {
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`);
    if (savedWorkflow) {
      const project = JSON.parse(savedWorkflow);
      setEditorState(prev => ({
        ...prev,
        project,
        history: [project],
        historyIndex: 0,
        isDirty: false,
      }));
      toast.success('Workflow loaded successfully');
    } else {
      // 🔧 If not found, create a new blank workflow with that ID
      const newWorkflow: WorkflowProject = {
        id: workflowId,
        name: 'Untitled Workflow',
        description: '',
        status: 'draft',
        nodes: [],
        edges: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage for persistence
      localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(newWorkflow));

      setEditorState(prev => ({
        ...prev,
        project: newWorkflow,
        history: [newWorkflow],
        historyIndex: 0,
        isDirty: false,
      }));

      toast.info('New workflow created');
    }
  } catch (error) {
    console.error('Failed to load or create workflow:', error);
    toast.error('Failed to load or create workflow');
  }
};

  const initializeSampleWorkflow = () => {
    const sampleProject: WorkflowProject = {
      id: 'sample',
      name: 'Sample Workflow',
      description: 'A sample workflow to demonstrate the editor',
      status: 'draft',
      nodes: [],
      edges: [],
      tags: ['sample', 'demo'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditorState(prev => ({
      ...prev,
      project: sampleProject,
      history: [sampleProject],
      historyIndex: 0,
      isDirty: false,
    }));
  };

  const saveWorkflow = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const updatedProject = {
        ...editorState.project,
        updatedAt: new Date().toISOString(),
      };

      // In a real app, this would save to API
      localStorage.setItem(`workflow_${updatedProject.id}`, JSON.stringify(updatedProject));
      
      setEditorState(prev => ({
        ...prev,
        project: updatedProject,
        isDirty: false,
      }));

      toast.success('Workflow saved successfully');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  }, [editorState.project, isSaving]);

  const handleProjectChange = useCallback((newProject: WorkflowProject) => {
    setEditorState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      
      return {
        ...prev,
        project: newProject,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
        isDirty: true,
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          project: prev.history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
        };
      }
      return prev;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          project: prev.history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
        };
      }
      return prev;
    });
  }, []);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setEditorState(prev => ({
      ...prev,
      panels: {
        ...prev.panels,
        selectedNodeId: nodeId,
        rightPanel: nodeId ? true : prev.panels.rightPanel,
      },
    }));
  }, []);

  const handleNodeUpdate = useCallback((updatedNode: WorkflowNode) => {
    const updatedProject = {
      ...editorState.project,
      nodes: editorState.project.nodes.map(node =>
        node.id === updatedNode.id ? updatedNode : node
      ),
    };
    handleProjectChange(updatedProject);
  }, [editorState.project, handleProjectChange]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    const updatedProject = {
      ...editorState.project,
      nodes: editorState.project.nodes.filter(node => node.id !== nodeId),
      edges: editorState.project.edges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      ),
    };
    handleProjectChange(updatedProject);
    
    // Clear selection if deleted node was selected
    if (editorState.panels.selectedNodeId === nodeId) {
      handleNodeSelect(null);
    }
  }, [editorState.project, editorState.panels.selectedNodeId, handleProjectChange, handleNodeSelect]);

  const handleNodeExecute = useCallback(async (nodeId: string) => {
    const node = editorState.project.nodes.find(n => n.id === nodeId);
    if (!node) return;

    try {
      await workflowEngine.executeNode(node, editorState.project, (nodeId, status, result) => {
        const updatedProject = {
          ...editorState.project,
          nodes: editorState.project.nodes.map(n => 
            n.id === nodeId 
              ? { 
                  ...n, 
                  status,
                  error: result?.error,
                  lastRun: new Date().toISOString()
                }
              : n
          )
        };
        handleProjectChange(updatedProject);
      });
    } catch (error) {
      console.error('Node execution failed:', error);
      toast.error('Node execution failed');
    }
  }, [editorState.project, workflowEngine, handleProjectChange]);

  const executeWorkflow = useCallback(async () => {
    if (isExecuting) return;

    // Validate workflow first
    const validation = workflowEngine.validateWorkflow(editorState.project);
    if (!validation.valid) {
      toast.error(`Workflow validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    setIsExecuting(true);
    try {
      await workflowEngine.executeWorkflow(editorState.project, (nodeId, status, result) => {
        const updatedProject = {
          ...editorState.project,
          nodes: editorState.project.nodes.map(node => 
            node.id === nodeId 
              ? { 
                  ...node, 
                  status,
                  error: result?.error,
                  lastRun: new Date().toISOString()
                }
              : node
          )
        };
        handleProjectChange(updatedProject);
      });
      
      toast.success('Workflow executed successfully');
    } catch (error) {
      console.error('Workflow execution failed:', error);
      toast.error('Workflow execution failed');
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, workflowEngine, editorState.project, handleProjectChange]);

  const exportWorkflow = useCallback(() => {
    const dataStr = JSON.stringify(editorState.project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editorState.project.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Workflow exported successfully');
  }, [editorState.project]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            saveWorkflow();
            break;
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'r':
            event.preventDefault();
            executeWorkflow();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveWorkflow, handleUndo, handleRedo, executeWorkflow]);

  const selectedNode = editorState.panels.selectedNodeId 
    ? editorState.project.nodes.find(n => n.id === editorState.panels.selectedNodeId) || null
    : null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workflows')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Workflows"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <h1 className="font-semibold text-lg text-gray-900">
              {editorState.project.name}
              {editorState.isDirty && <span className="text-orange-500 ml-2">*</span>}
            </h1>
            <p className="text-sm text-gray-500">{editorState.project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={editorState.historyIndex <= 0}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
          </button>
          
          <button
            onClick={handleRedo}
            disabled={editorState.historyIndex >= editorState.history.length - 1}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Run Workflow (Ctrl+R)"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run
              </>
            )}
          </button>

          <button
            onClick={saveWorkflow}
            disabled={isSaving || !editorState.isDirty}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Save Workflow (Ctrl+S)"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>

          <button
            onClick={exportWorkflow}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            title="Export Workflow"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Node Library */}
        <NodeLibrary
          isOpen={editorState.panels.leftPanel}
          onToggle={() => setEditorState(prev => ({
            ...prev,
            panels: { ...prev.panels, leftPanel: !prev.panels.leftPanel }
          }))}
        />

        {/* Center - Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            project={editorState.project}
            onProjectChange={handleProjectChange}
            onNodeSelect={handleNodeSelect}
            selectedNodeId={editorState.panels.selectedNodeId || null}
            isExecuting={isExecuting}
            onExecutionStart={() => setIsExecuting(true)}
            onExecutionEnd={() => setIsExecuting(false)}
          />
        </div>

        {/* Right Panel - Properties */}
        <PropertiesPanel
          isOpen={editorState.panels.rightPanel}
          onToggle={() => setEditorState(prev => ({
            ...prev,
            panels: { ...prev.panels, rightPanel: !prev.panels.rightPanel }
          }))}
          selectedNode={selectedNode}
          project={editorState.project}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
          onNodeExecute={handleNodeExecute}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Nodes: {editorState.project.nodes.length}</span>
          <span>Connections: {editorState.project.edges.length}</span>
          <span>Status: {editorState.project.status}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {editorState.isDirty && <span className="text-orange-600">Unsaved changes</span>}
          <span>Last saved: {new Date(editorState.project.updatedAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

