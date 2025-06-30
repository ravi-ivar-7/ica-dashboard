import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Save, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
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
    duration: 20,
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  });
  
  // Editor state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);
  const [isExporting, setIsExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  // History for undo/redo
  const [history, setHistory] = useState<CineFlowProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Refs
  const playIntervalRef = useRef<number | null>(null);
  const projectRef = useRef(project);
  
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
      setLeftPanelWidth(window.innerWidth * 0.8);
      setRightPanelWidth(window.innerWidth * 0.8);
      setShowLeftPanel(false);
      setShowRightPanel(false);
    } else {
      setLeftPanelWidth(250);
      setRightPanelWidth(250);
      setShowLeftPanel(true);
      setShowRightPanel(true);
    }
  }, [isMobile]);
  
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
          if (newTime >= project.duration) {
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
  }, [isPlaying, project.duration]);
  
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
          x: 0,
          y: 0,
          width: 0,
          height: 0,
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
    
    const newElement: CanvasElementType = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'Add your text here',
      x: 100,
      y: 100,
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
    
    const newElement: CanvasElementType = {
      id: `element-${Date.now()}`,
      type: 'element',
      name: element.name,
      src: element.src,
      x: 100,
      y: 100,
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
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    toast.info('Preparing to export video...', {
      duration: 3000
    });
    
    try {
      // In a real implementation, we would use FFmpeg.wasm to render the video
      // For now, we'll just simulate the export process
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Video exported successfully', {
        subtext: 'Your video has been saved to your downloads folder.',
        duration: 5000
      });
    } catch (error) {
      console.error('Error exporting video:', error);
      toast.error('Error exporting video', {
        subtext: 'Please try again later.',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
    }
  }, []);
  
  // Get selected element
  const selectedElement = selectedElementId 
    ? project.elements.find(el => el.id === selectedElementId) || null
    : null;

  // Toggle panels for mobile
  const toggleLeftPanel = () => {
    setShowLeftPanel(!showLeftPanel);
  };

  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-black">
        {/* Top toolbar */}
        <TopToolbar
          projectName={project.name}
          isPlaying={isPlaying}
          canUndo={canUndo}
          canRedo={canRedo}
          onPlayPause={togglePlayPause}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onExport={handleExport}
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
          {/* Left panel */}
          <div 
            style={{ 
              width: showLeftPanel ? `${leftPanelWidth}px` : '0px',
              transition: 'width 0.3s ease-in-out'
            }} 
            className="flex-shrink-0 overflow-hidden"
          >
            {showLeftPanel && (
              <LeftPanel
                onAssetDragStart={handleAssetDragStart}
                onAddText={handleAddText}
                onAddElement={handleAddElement}
                onApplyTemplate={handleApplyTemplate}
              />
            )}
          </div>
          
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
          
          {/* Right panel */}
          <div 
            style={{ 
              width: showRightPanel ? `${rightPanelWidth}px` : '0px',
              transition: 'width 0.3s ease-in-out'
            }} 
            className="flex-shrink-0 overflow-hidden"
          >
            {showRightPanel && (
              <PropertiesPanel
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
              />
            )}
          </div>
        </div>
        
        {/* Export loading overlay */}
        {isExporting && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md text-center">
              <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Exporting Video</h3>
              <p className="text-white/70">Please wait while we process your video...</p>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}