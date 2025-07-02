import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, GripHorizontal } from 'lucide-react';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import { toast } from '../../../contexts/ToastContext';
import { CanvasElementType, CineFlowProject, Template, AspectRatio } from '../../../types/cineflow';

import { createFFmpeg } from '@ffmpeg/ffmpeg';

import { getProjectById } from '@/services/api/projects';

// Import components
import LeftPanel from '../../../components/cineflow/LeftPanel';
import Canvas from '../../../components/cineflow/Canvas';
import Timeline from '../../../components/cineflow/Timeline';
import PropertiesPanel from '../../../components/cineflow/PropertiesPanel';
import TopToolbar from '../../../components/cineflow/TopToolbar';
import ExportModal from '../../../components/cineflow/ExportIndex';

// Initialize FFmpeg
let ffmpeg: any = null;

const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  try {
    ffmpeg = createFFmpeg({
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
    });
    await ffmpeg.load();
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    toast.error('Error loading FFmpeg', {
      subtext: 'Video export functionality may not work properly.',
      duration: 5000
    });
    throw error;
  }
};





export default function CineFlowEditor() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [project, setProject] = useState<CineFlowProject | null>();
  const [isLoading, setIsLoading] = useState(false);

  // Editor state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(0);
  const [rightPanelWidth, setRightPanelWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // History for undo/redo
  const [history, setHistory] = useState<CineFlowProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [timelineHeight, setTimelineHeight] = useState(240);

  // Refs
  const playIntervalRef = useRef<number | null>(null);
  const projectRef = useRef(project);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const stateProject = location.state?.project || {};
        const projectId = id || stateProject?.id;
        console.log('Loading project with ID:', projectId);
        console.log('State project:', stateProject);
        // 1. Validate essentials
        if (!projectId || !stateProject?.name) {
          toast.error('Missing project ID or name');
          return;
        }

        let loadedProject: CineFlowProject | null = null;

        // 2. Try localStorage
        const saved = localStorage.getItem(`cineflow-project-${projectId}`);
        if (saved && saved !== 'undefined') {
          const parsed = JSON.parse(saved);
          parsed.elements = parsed.elements.map((el: CanvasElementType, i: number) => ({
            ...el,
            layer: el.layer !== undefined ? el.layer : i,
          }));

          loadedProject = {
            ...parsed,
            ...stateProject,
            elements: parsed.elements,
          };
        } else {
          try {
            // 3. Try backend
            const backend = await getProjectById(projectId);
            loadedProject = {
              ...backend,
              ...stateProject,
            };
          } catch (err) {
            // 4. Fallback: Create new project
            loadedProject = {
              id: projectId,
              name: stateProject.name || 'Untitled Project',
              description: stateProject.description || '',
              aspectRatio: stateProject.aspectRatio || '16:9',
              tags: stateProject.tags || [],
              status: 'draft',
              duration: 1,
              elements: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
        }

        if (!loadedProject) {
          toast.error('Failed to load project');
          return;
        }

        // 5. Set project
        setProject(loadedProject);
        console.log('Loaded project:', loadedProject);

        // 6. Set initial history
        setHistory([loadedProject]);
        setHistoryIndex(0);

        // 7. Load FFmpeg in background
        loadFFmpeg().catch(console.error);

      } catch (err) {
        console.error('Error loading project:', err);
        toast.error('Error loading project');
      }
      finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [id, location.state]);

  // Initialize audio context
  useEffect(() => {
    // Create AudioContext on first user interaction to avoid autoplay restrictions
    const initAudioContext = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      }
    };

    // Add event listeners for user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);

      // Clean up audio context
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(console.error);
      }
    };
  }, [audioContext]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Adjust panels for mobile
  useEffect(() => {
    if (isMobile) {
      setLeftPanelWidth(window.innerWidth);
      setRightPanelWidth(window.innerWidth * 0.8);
      setShowLeftPanel(false);
      setShowRightPanel(false);
    } else {
      setLeftPanelWidth(leftPanelCollapsed ? 40 : 250);
      setRightPanelWidth(rightPanelCollapsed ? 40 : 250);
      setShowLeftPanel(true);
      setShowRightPanel(true);
    }
  }, [isMobile, leftPanelCollapsed, rightPanelCollapsed]);



  // Update project ref when project changes
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  // Toggle left panel
  const toggleLeftPanel = () => {
    if (isMobile) {
      setShowLeftPanel(!showLeftPanel);
    } else {
      setLeftPanelCollapsed(!leftPanelCollapsed);
      setLeftPanelWidth(leftPanelCollapsed ? 250 : 40);
    }
  };

  // Toggle right panel
  const toggleRightPanel = () => {
    if (isMobile) {
      setShowRightPanel(!showRightPanel);
    } else {
      setRightPanelCollapsed(!rightPanelCollapsed);
      setRightPanelWidth(rightPanelCollapsed ? 250 : 40);
    }
  };

  // Update undo/redo state
  useEffect(() => {
    setCanUndo(historyIndex > 0);
    setCanRedo(historyIndex < history.length - 1);
  }, [history, historyIndex]);

  // Handle playback
  useEffect(() => {
    if (!project) return;

    if (isPlaying) {
      playIntervalRef.current = window.setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 0.1;

          // Find the maximum end time of any element
          const maxEndTime = project.elements
            ? project.elements.reduce((max, el) => {
              const endTime = el.startTime + el.duration;
              return endTime > max ? endTime : max;
            }, 0)
            : 0;

          // Use the greater of project duration or max element end time
          const effectiveDuration = Math.max(project.duration, maxEndTime);

          if (newTime >= effectiveDuration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, project?.duration, project?.elements, project]);

  // Autosave project
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      localStorage.setItem(`cineflow-project-${id}`, JSON.stringify(projectRef.current));
    }, 5000);

    return () => {
      clearInterval(autosaveInterval);
    };
  }, [id]);

  // Add to history
  const addToHistory = useCallback((newProject: CineFlowProject) => {
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newProject];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setProject(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setProject(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<CanvasElementType>) => {
    setProject(prev => {
      if (!prev) return prev; // early return if null

      const elementIndex = prev.elements.findIndex(el => el.id === id);
      if (elementIndex === -1) return prev;

      const updatedElements = [...prev.elements];
      updatedElements[elementIndex] = { ...updatedElements[elementIndex], ...updates };

      return {
        ...prev,
        elements: updatedElements,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);


  // Delete element
  const deleteElement = useCallback((id: string) => {
    setProject(prev => {
      if (!prev) return prev; // Handle null safely

      const newElements = prev.elements.filter(el => el.id !== id);

      const newProject = {
        ...prev,
        elements: newElements,
        updatedAt: new Date().toISOString()
      };

      addToHistory(newProject);
      return newProject;
    });

    setSelectedElementId(null);
  }, [addToHistory]);


  // Handle asset drag start
  const handleAssetDragStart = useCallback((e: React.DragEvent, asset: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
  }, []);

  // Handle asset drop on canvas
  const handleAssetDrop = useCallback((asset: any, position: { x: number, y: number }) => {
    // Create a new element based on the asset type
    let newElement: CanvasElementType;

    // Find the highest layer to place the new element on top
    const highestLayer = project && project.elements
      ? project.elements.reduce((max, el) => Math.max(max, el.layer || 0), 0)
      : 0;

    switch (asset.type) {
      case 'image':
        newElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          name: asset.name,
          src: asset.src,
          x: position.x,
          y: position.y,
          width: 300,
          height: 200,
          startTime: 0,
          duration: 1,
          layer: highestLayer + 1
        };
        break;
      case 'video':
        newElement = {
          id: `video-${Date.now()}`,
          type: 'video',
          name: asset.name,
          src: asset.src,
          x: position.x,
          y: position.y,
          width: 400,
          height: 225,
          startTime: 0,
          duration: 1,
          poster: asset.src, // Add poster for video preview
          layer: highestLayer + 1
        };
        break;
      case 'audio':
        newElement = {
          id: `audio-${Date.now()}`,
          type: 'audio',
          name: asset.name,
          src: asset.src,
          x: position.x,
          y: position.y,
          width: 300,
          height: 100,
          startTime: 0,
          duration: 1,
          layer: highestLayer + 1
        };
        break;
      case 'text':
        newElement = {
          id: `text-${Date.now()}`,
          type: 'text',
          text: 'Add your text here',
          x: position.x,
          y: position.y,
          width: 300,
          height: 100,
          startTime: 0,
          duration: 1,
          fontFamily: asset.style?.fontFamily || 'sans-serif',
          fontSize: asset.style?.fontSize || 24,
          fontWeight: asset.style?.fontWeight || 'normal',
          color: asset.style?.color || '#ffffff',
          textAlign: asset.style?.textAlign || 'center',
          layer: highestLayer + 1
        };
        break;
      case 'element':
        newElement = {
          id: `element-${Date.now()}`,
          type: 'element',
          name: asset.name,
          src: asset.src,
          x: position.x,
          y: position.y,
          width: 100,
          height: 100,
          startTime: 0,
          duration: 1,
          layer: highestLayer + 1
        };
        break;
      default:
        return;
    }

    setProject(prev => {
      if (!prev) {
        throw new Error("Project data is not initialized. Cannot add new element.");
      }

      const newProject: CineFlowProject = {
        ...prev,
        elements: [...prev.elements, newElement],
        updatedAt: new Date().toISOString()
      };

      const newEndTime = newElement.startTime + newElement.duration;
      if (newEndTime > prev.duration) {
        newProject.duration = Math.ceil(newEndTime);
      }

      addToHistory(newProject);
      return newProject;
    });


    setSelectedElementId(newElement.id);

    // Add fade-in animation
    toast.success(`Added ${asset.name || asset.type}`, {
      duration: 2000
    });
  }, [project?.elements, addToHistory]);

  // Handle adding text
  const handleAddText = useCallback((textStyle: any) => {
    // Find the highest layer to place the new element on top
    const highestLayer = (project?.elements ?? []).reduce((max, el) => Math.max(max, el.layer || 0), 0);

    // Calculate center position of canvas
    const canvasElement = document.querySelector('.relative.bg-black.shadow-2xl');
    let centerX = 100;
    let centerY = 100;

    if (canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      centerX = rect.width / 2 - 150;
      centerY = rect.height / 2 - 50;
    }

    const newElement: CanvasElementType = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'Add your text here',
      x: centerX,
      y: centerY,
      width: 300,
      height: 100,
      startTime: 0,
      duration: 1,
      fontFamily: textStyle.style?.fontFamily || 'sans-serif',
      fontSize: textStyle.style?.fontSize || 24,
      fontWeight: textStyle.style?.fontWeight || 'normal',
      color: textStyle.style?.color || '#ffffff',
      textAlign: textStyle.style?.textAlign || 'center',
      layer: highestLayer + 1
    };

    setProject(prev => {
      if (!prev) {
        throw new Error("Project is not initialized when trying to add an text");
      }

      const newProject: CineFlowProject = {
        ...prev,
        elements: [...prev.elements, newElement],
        updatedAt: new Date().toISOString(),
      };

      addToHistory(newProject);
      return newProject;
    });


    setSelectedElementId(newElement.id);
  }, [project?.elements, addToHistory]);

  // Handle adding element
  const handleAddElement = useCallback((element: any) => {
    const base = project ?? projectRef.current;

    if (!base) {
      toast.error("Project is not loaded. Please wait to add element.");
      return;
    }

    // Compute highest layer safely
    const highestLayer = base.elements.reduce(
      (max, el) => Math.max(max, el.layer || 0),
      0
    );

    // Calculate center position of canvas
    const canvasElement = document.querySelector('.relative.bg-black.shadow-2xl');
    let centerX = 100;
    let centerY = 100;

    if (canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      centerX = rect.width / 2 - 50;
      centerY = rect.height / 2 - 50;
    }

    const newElement: CanvasElementType = {
      id: `element-${Date.now()}`,
      type: 'element',
      name: element.name,
      src: element.src,
      x: centerX,
      y: centerY,
      width: 100,
      height: 100,
      startTime: 0,
      duration: 1,
      layer: highestLayer + 1
    };

    setProject(prev => {
      const current = prev ?? projectRef.current;
      if (!current) return prev;

      const newProject: CineFlowProject = {
        ...current,
        elements: [...current.elements, newElement],
        updatedAt: new Date().toISOString()
      };

      addToHistory(newProject);
      return newProject;
    });

    setSelectedElementId(newElement.id);

  }, [project, addToHistory]);


  // Handle applying template
  const handleApplyTemplate = useCallback((template: Template) => {
    // Ask for confirmation if project already has elements
    if (project && project.elements.length > 0) {
      if (!window.confirm('Applying a template will replace your current project. Continue?')) {
        return;
      }
    }

    // Generate new IDs for template elements to avoid conflicts
    const elementsWithNewIds = template.elements.map((el, index) => ({
      ...el,
      id: `${el.id}-${Date.now()}`,
      layer: el.layer !== undefined ? el.layer : index
    }));

    setProject(prev => {
      const base = prev ?? projectRef.current;
      if (!base) {
        toast.error('Project not loaded. Cannot apply template.');
        return prev;
      }

      const newProject: CineFlowProject = {
        ...base,
        aspectRatio: template.aspectRatio,
        duration: template.duration,
        elements: elementsWithNewIds,
        updatedAt: new Date().toISOString()
      };

      addToHistory(newProject);
      return newProject;
    });


    toast.success('Template applied successfully');
  }, [project?.elements?.length, addToHistory]);

  // Save project
  const handleSave = useCallback(() => {
    localStorage.setItem(`cineflow-project-${id}`, JSON.stringify(project));
    toast.success('Project saved successfully');
  }, [id, project]);

  // Export project
  const handleExport = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleAspectRatioChange = useCallback((newRatio: AspectRatio) => {
    setProject(prev => {
      const base = prev ?? projectRef.current;
      if (!base) return prev;

      const newProject: CineFlowProject = {
        ...base,
        aspectRatio: newRatio,
        updatedAt: new Date().toISOString()
      };

      addToHistory(newProject);
      return newProject;
    });

    toast.info(`Aspect ratio changed to ${newRatio}`);
  }, [addToHistory]);


  // Get selected element
  const selectedElement = selectedElementId && project
    ? project.elements.find(el => el.id === selectedElementId) || null
    : null;

  // Handle project metadata changes
  const handleProjectDetailsChange = (name: string, description: string, tags: string[]) => {
    setProject(prev => {
      if (!prev) {
        console.error('Cannot update project metadata: project is null');
        return prev;
      }

      return {
        ...prev,
        name,
        description,
        tags, // Add tags to the project object
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleDurationChange = useCallback((newDuration: number) => {
    setProject(prev => {
      const base = prev ?? projectRef.current;
      if (!base) return prev;

      const newProject: CineFlowProject = {
        ...base,
        duration: newDuration,
        updatedAt: new Date().toISOString()
      };

      addToHistory(newProject);
      return newProject;
    });

    toast.info(`Duration changed to ${newDuration}s`);
  }, [addToHistory]);




  // Add these handler functions
  interface ResizeMouseDownEvent extends React.MouseEvent<HTMLDivElement, MouseEvent> { }
  interface ResizeMouseMoveEvent extends MouseEvent { }

  const handleResizeMouseDown = (e: ResizeMouseDownEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = timelineHeight;

    const handleMouseMove = (moveEvent: ResizeMouseMoveEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(150, Math.min(500, startHeight + deltaY)); // Min 150px, max 500px
      setTimelineHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const startY = e.touches[0].clientY;
    const startHeight = timelineHeight;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      const deltaY = startY - moveEvent.touches[0].clientY;
      const newHeight = Math.max(150, Math.min(500, startHeight + deltaY));
      setTimelineHeight(newHeight);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (isLoading) {
    return <div className="text-white p-8">Loading editor...</div>;
  }

  // Now we can safely assume project is loaded
  if (!project) {
    return <div className="text-white p-8">Failed to load project</div>;
  }

  return (
    <ErrorBoundary>
      <div
        className="flex flex-col bg-black"
        style={{
          height: 'calc(100vh - 64px)'
        }}
        ref={editorContainerRef}
      >
        {/* Top toolbar */}
        <TopToolbar
          projectName={project.name}
          isPlaying={isPlaying}
          canUndo={canUndo}
          canRedo={canRedo}
          aspectRatio={project.aspectRatio}
          onAspectRatioChange={handleAspectRatioChange}
          onPlayPause={togglePlayPause}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onExport={handleExport}
          projectDescription={project.description}
          tags={project.tags || []} // Pass the project tags
          onProjectDetailsChange={handleProjectDetailsChange}
        />


        {/* Mobile toggle bar */}
        {isMobile && (
          <div className="sticky top-10   flex items-center justify-between p-2 bg-gray-900/90 border-b border-white/10">
            <button
              onClick={toggleLeftPanel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              {showLeftPanel ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Assets</span>
            </button>

            <button
              onClick={toggleRightPanel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              <span>Properties</span>
              {showRightPanel ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Desktop */}
          {!isMobile && (
            <div
              className="h-full flex-shrink-0 overflow-y-auto bg-gray-900"
              style={{
                width: showLeftPanel ? `${leftPanelWidth}px` : '0px',
                transition: 'width 0.3s ease-in-out',
                position: 'sticky',
                left: 0,
                top: 0,
                alignSelf: 'flex-start'
              }}
            >
              {showLeftPanel && (
                <LeftPanel
                  onAssetDragStart={handleAssetDragStart}
                  onAddText={handleAddText}
                  onAddElement={handleAddElement}
                  onApplyTemplate={handleApplyTemplate}
                  isCollapsed={leftPanelCollapsed}
                  onToggleCollapse={toggleLeftPanel}
                />
              )}
            </div>
          )}


          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Canvas container - flexible space above timeline */}
            <div
              className="flex-1 min-h-0 overflow-y-auto bg-gray-800"

            >
              <Canvas
                elements={project.elements}
                selectedElementId={selectedElementId}
                aspectRatio={project.aspectRatio}
                isPlaying={isPlaying}
                currentTime={currentTime}
                onSelectElement={setSelectedElementId}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDropAsset={handleAssetDrop}
              />
            </div>

            {/* Timeline container - fixed height with vertical scroll when needed */}
            <div
              className="relative bg-gray-900 border-t border-white/10"
              style={{
                height: `${timelineHeight}px`,
                minHeight: '150px' // Minimum timeline height
              }}

            >
              {/* Resize handle */}
              <div
                className="absolute -top-[8px] left-0 right-0   flex items-center justify-center group cursor-row-resize z-10"
                onMouseDown={handleResizeMouseDown}
                onTouchStart={handleResizeTouchStart}
              >
                <GripHorizontal className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </div>


              {/* Scrollable timeline content */}
              <div className="h-full overflow-y-auto">
                <Timeline
                  elements={project.elements}
                  currentTime={currentTime}
                  duration={project.duration}
                  isPlaying={isPlaying}
                  selectedElementId={selectedElementId}
                  onTimeUpdate={setCurrentTime}
                  onPlayPause={togglePlayPause}
                  onSelectElement={setSelectedElementId}
                  onUpdateElement={updateElement}
                  onDurationChange={handleDurationChange}
                />
              </div>
            </div>
          </div>



          {/* Right Panel - Desktop */}
          {!isMobile && (
            <div
              className="h-full flex-shrink-0 bg-gray-900"
              style={{
                width: showRightPanel ? (rightPanelCollapsed ? '32px' : `${rightPanelWidth}px`) : '0px',
                transition: 'width 0.3s ease-in-out',
                position: 'sticky',
                right: 0,
                top: 0,
                alignSelf: 'flex-start',
                borderLeft: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {showRightPanel ? (
                rightPanelCollapsed ? (
                  <div className="h-full w-8 flex flex-col items-center justify-between py-4">
                    <button
                      onClick={toggleRightPanel}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Expand properties"
                    >
                      <ChevronLeft className="w-4 h-4   " />
                    </button>

                    <div className="flex flex-col items-center space-y-1">
                      {'PROPERTIES'.split('').map((letter, i) => (
                        <span
                          key={i}
                          className="   text-white/50 font-mono leading-none"
                        >
                          {letter}
                        </span>
                      ))}
                    </div>

                    <div className="w-4"></div>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto">
                    <PropertiesPanel
                      selectedElement={selectedElement}
                      onUpdateElement={updateElement}
                      onDeleteElement={deleteElement}
                      isCollapsed={rightPanelCollapsed}
                      onToggleCollapse={toggleRightPanel}
                    />
                  </div>
                )
              ) : null}
            </div>
          )}
        </div>

        {/* Mobile Panels */}
        {isMobile && (
          <>
            {/* Left Panel - Mobile */}
            <div
              className={`fixed bottom-0 left-0  z-30 w-full transform transition-transform duration-300 ${showLeftPanel ? 'translate-y-0' : 'translate-y-full'
                }`}
              style={{
                height: 'calc(90vh - 48px)',
                maxHeight: 'calc(100vh - 200px)'
              }}
            >
              <div className="h-full bg-gray-900/95 border-t border-white/20 rounded-t-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-2 border-b border-white/10">
                  <h3 className="text-white font-bold text-sm">Assets</h3>
                  <button
                    onClick={toggleLeftPanel}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[calc(100%-40px)] overflow-y-auto">
                  <LeftPanel
                    onAssetDragStart={handleAssetDragStart}
                    onAddText={handleAddText}
                    onAddElement={handleAddElement}
                    onApplyTemplate={handleApplyTemplate}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Mobile */}
            <div
              className={`fixed bottom-0 right-0 z-30  w-full transform transition-transform duration-300 ${showRightPanel ? 'translate-y-0' : 'translate-y-full'
                }`}
              style={{
                height: 'calc(90vh - 48px)',
                maxHeight: 'calc(100vh - 200px)'
              }}
            >
              <div className="h-full bg-gray-900/95 border-t border-white/20 rounded-t-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-2 border-b border-white/10">
                  <h3 className="text-white font-bold text-sm">Properties</h3>
                  <button
                    onClick={toggleRightPanel}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[calc(100%-40px)] overflow-y-auto">
                  <PropertiesPanel
                    selectedElement={selectedElement}
                    onUpdateElement={updateElement}
                    onDeleteElement={deleteElement}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            project={project}
          />
        )}
      </div>
    </ErrorBoundary>
  );

}
