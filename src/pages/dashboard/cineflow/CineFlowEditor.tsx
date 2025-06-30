import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Save, Zap, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import { toast } from '../../../contexts/ToastContext';
import { CanvasElementType, CineFlowProject, Template } from '../../../types/cineflow';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// Import components
import LeftPanel from '../../../components/cineflow/LeftPanel';
import Canvas from '../../../components/cineflow/Canvas';
import Timeline from '../../../components/cineflow/Timeline';
import PropertiesPanel from '../../../components/cineflow/PropertiesPanel';
import TopToolbar from '../../../components/cineflow/TopToolbar';
import ExportModal from '../../../components/cineflow/ExportModal';

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

// Helper function to format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function CineFlowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Project state
  const [project, setProject] = useState<CineFlowProject>({
    id: id || 'new',
    name: 'Untitled Project',
    type: 'Reel',
    aspectRatio: '16:9',
    duration: 30,
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  });
  
  // Editor state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(0);
  const [rightPanelWidth, setRightPanelWidth] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [projectMetadata, setProjectMetadata] = useState({
    title: 'Untitled Project',
    description: '',
  });
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [showExportModal, setShowExportModal] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<CineFlowProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Refs
  const playIntervalRef = useRef<number | null>(null);
  const projectRef = useRef(project);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        // In a real app, we would fetch the project from an API
        // For now, we'll use mock data
        
        // Check if we have a saved project in localStorage
        const savedProject = localStorage.getItem(`cineflow-project-${id}`);
        if (savedProject) {
          const parsedProject = JSON.parse(savedProject);
          
          // Ensure all elements have a layer property
          const elementsWithLayers = parsedProject.elements.map((el: CanvasElementType, index: number) => ({
            ...el,
            layer: el.layer !== undefined ? el.layer : index
          }));
          
          parsedProject.elements = elementsWithLayers;
          setProject(parsedProject);

          // Set project metadata
          setProjectMetadata({
            title: parsedProject.name || 'Untitled Project',
            description: parsedProject.description || '',
          });
          
          // Initialize history
          setHistory([parsedProject]);
          setHistoryIndex(0);
        } else {
          // Initialize history with current project
          setHistory([project]);
          setHistoryIndex(0);
        }
        
        // Try to load FFmpeg in the background
        loadFFmpeg().catch(console.error);
        
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Error loading project');
      }
    };
    
    loadProject();
  }, [id]);
  
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
    if (isPlaying) {
      playIntervalRef.current = window.setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 0.1;
          
          // Find the maximum end time of any element
          const maxEndTime = project.elements.reduce((max, el) => {
            const endTime = el.startTime + el.duration;
            return endTime > max ? endTime : max;
          }, 0);
          
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
  }, [isPlaying, project.duration, project.elements]);
  
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
  
  // Update project with history tracking
  const updateProject = useCallback((updates: Partial<CineFlowProject>) => {
    setProject(prev => {
      const newProject = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      addToHistory(newProject);
      return newProject;
    });
  }, [addToHistory]);
  
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
      const elementIndex = prev.elements.findIndex(el => el.id === id);
      if (elementIndex === -1) return prev;
      
      const updatedElements = [...prev.elements];
      updatedElements[elementIndex] = { ...updatedElements[elementIndex], ...updates };
      
      const newProject = { 
        ...prev, 
        elements: updatedElements,
        updatedAt: new Date().toISOString()
      };
      
      return newProject;
    });
  }, []);
  
  // Delete element
  const deleteElement = useCallback((id: string) => {
    setProject(prev => {
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
    const highestLayer = project.elements.reduce((max, el) => Math.max(max, el.layer || 0), 0);
    
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
          duration: 5,
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
          duration: 10,
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
          duration: 15,
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
          duration: 5,
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
          duration: 5,
          layer: highestLayer + 1
        };
        break;
      default:
        return;
    }
    
    setProject(prev => {
      const newProject = { 
        ...prev, 
        elements: [...prev.elements, newElement],
        updatedAt: new Date().toISOString()
      };
      
      // Update project duration if needed
      if (newElement.startTime + newElement.duration > prev.duration) {
        newProject.duration = Math.ceil(newElement.startTime + newElement.duration);
      }
      
      addToHistory(newProject);
      return newProject;
    });
    
    setSelectedElementId(newElement.id);
    
    // Add fade-in animation
    toast.success(`Added ${asset.name || asset.type}`, {
      duration: 2000
    });
  }, [project.elements, addToHistory]);
  
  // Handle adding text
  const handleAddText = useCallback((textStyle: any) => {
    // Find the highest layer to place the new element on top
    const highestLayer = project.elements.reduce((max, el) => Math.max(max, el.layer || 0), 0);
    
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
      duration: 5,
      fontFamily: textStyle.style?.fontFamily || 'sans-serif',
      fontSize: textStyle.style?.fontSize || 24,
      fontWeight: textStyle.style?.fontWeight || 'normal',
      color: textStyle.style?.color || '#ffffff',
      textAlign: textStyle.style?.textAlign || 'center',
      layer: highestLayer + 1
    };
    
    setProject(prev => {
      const newProject = { 
        ...prev, 
        elements: [...prev.elements, newElement],
        updatedAt: new Date().toISOString()
      };
      
      addToHistory(newProject);
      return newProject;
    });
    
    setSelectedElementId(newElement.id);
  }, [project.elements, addToHistory]);
  
  // Handle adding element
  const handleAddElement = useCallback((element: any) => {
    // Find the highest layer to place the new element on top
    const highestLayer = project.elements.reduce((max, el) => Math.max(max, el.layer || 0), 0);
    
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
      duration: 5,
      layer: highestLayer + 1
    };
    
    setProject(prev => {
      const newProject = { 
        ...prev, 
        elements: [...prev.elements, newElement],
        updatedAt: new Date().toISOString()
      };
      
      addToHistory(newProject);
      return newProject;
    });
    
    setSelectedElementId(newElement.id);
  }, [project.elements, addToHistory]);
  
  // Handle applying template
  const handleApplyTemplate = useCallback((template: Template) => {
    // Ask for confirmation if project already has elements
    if (project.elements.length > 0) {
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
      const newProject = { 
        ...prev, 
        aspectRatio: template.aspectRatio,
        duration: template.duration,
        elements: elementsWithNewIds,
        updatedAt: new Date().toISOString()
      };
      
      addToHistory(newProject);
      return newProject;
    });
    
    toast.success('Template applied successfully');
  }, [project.elements.length, addToHistory]);
  
  // Save project
  const handleSave = useCallback(() => {
    localStorage.setItem(`cineflow-project-${id}`, JSON.stringify(project));
    toast.success('Project saved successfully');
  }, [id, project]);
  
  // Export project
  const handleExport = useCallback(() => {
    setShowExportModal(true);
  }, []);
  
  // Handle aspect ratio change
  const handleAspectRatioChange = useCallback((newRatio: string) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        aspectRatio: newRatio,
        updatedAt: new Date().toISOString()
      };
      
      addToHistory(newProject);
      return newProject;
    });
    
    toast.info(`Aspect ratio changed to ${newRatio}`);
  }, [addToHistory]);
  
  // Get selected element
  const selectedElement = selectedElementId 
    ? project.elements.find(el => el.id === selectedElementId) || null
    : null;

  // Handle project metadata changes
  const handleProjectDetailsChange = (name: string, description: string) => {
    setProjectMetadata({
      title: name,
      description: description,
    });
    
    setProject(prev => ({
      ...prev,
      name: name,
      description: description
    }));
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-black" ref={editorContainerRef}>
        {/* Top toolbar */}
        <TopToolbar
          projectName={projectMetadata.title}
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
          projectDescription={projectMetadata.description}
          onProjectDetailsChange={handleProjectDetailsChange}
        />
        
        {/* Mobile toolbar */}
        {isMobile && (
          <div className="flex items-center justify-between p-2 bg-gray-900/90 border-b border-white/10">
            <button
              onClick={toggleLeftPanel}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {showLeftPanel ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            <div className="text-white/70 text-xs">
              {project.aspectRatio} • {formatTime(currentTime)}
            </div>
            
            <button
              onClick={toggleRightPanel}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {showRightPanel ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel - Assets */}
          {isMobile ? (
            <div 
              className={`fixed bottom-0 left-0 z-40 w-full transform transition-transform duration-300 ${
                showLeftPanel ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{
                height: 'calc(50vh - 48px)', // Half viewport minus timeline height
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
          ) : (
            <div 
              style={{ 
                width: showLeftPanel ? `${leftPanelWidth}px` : '0px',
                transition: 'width 0.3s ease-in-out'
              }} 
              className="flex-shrink-0 overflow-hidden sticky top-0 h-full"
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
          
          {/* Center canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Canvas area */}
            <div className="flex-1 overflow-hidden bg-gray-800">
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
            
            {/* Timeline */}
            <div className="h-48 flex-shrink-0">
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
              />
            </div>
          </div>
          
          {/* Right panel - Properties */}
          {isMobile ? (
            <div 
              className={`fixed bottom-0 right-0 z-40 w-full transform transition-transform duration-300 ${
                showRightPanel ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{
                height: 'calc(50vh - 48px)', // Half viewport minus timeline height
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
          ) : (
            <div 
              style={{ 
                width: showRightPanel ? `${rightPanelWidth}px` : '0px',
                transition: 'width 0.3s ease-in-out'
              }} 
              className="flex-shrink-0 overflow-hidden sticky top-0 h-full"
            >
              {showRightPanel && (
                <PropertiesPanel
                  selectedElement={selectedElement}
                  onUpdateElement={updateElement}
                  onDeleteElement={deleteElement}
                  isCollapsed={rightPanelCollapsed}
                  onToggleCollapse={toggleRightPanel}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Export Modal */}
        {showExportModal && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            project={project}
          />
        )}
        
        {/* Mobile bottom panel buttons */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-white/20 bg-gray-900/90">
            <button
              onClick={toggleLeftPanel}
              className="flex-1 py-3 text-center text-white/80 hover:text-white bg-gray-900/80 hover:bg-gray-800/80 transition-colors"
            >
              <span className="text-xs font-medium">Assets</span>
            </button>
            <button
              onClick={toggleRightPanel}
              className="flex-1 py-3 text-center text-white/80 hover:text-white bg-gray-900/80 hover:bg-gray-800/80 transition-colors"
            >
              <span className="text-xs font-medium">Properties</span>
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}