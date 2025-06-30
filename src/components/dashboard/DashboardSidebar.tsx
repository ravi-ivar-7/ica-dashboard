import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Video, 
  Music, 
  FolderOpen, 
  Palette, 
  Settings, 
  Menu, 
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Pencil,
  Wand2,
  Scissors,
  Mic,
  Radio,
  AudioWaveform,
  Camera,
  Film
} from 'lucide-react';

// Define the navigation structure with nested items
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
    gradient: "from-purple-600 to-indigo-600"
  },
    {
    id: 'cineflow',
    label: 'CineFlow',
    icon: <Film className="w-5 h-5" />,
    path: '/dashboard/cineflow',
    gradient: "from-amber-600 to-orange-600"
  },
  {
    id: 'images',
    label: 'Images',
    icon: <Image className="w-5 h-5" />,
    path: '/dashboard/images',
    gradient: "from-pink-600 to-purple-600",
    children: [
      {
        id: 'images-manager',
        label: 'Manager',
        icon: <FolderOpen className="w-4 h-4" />,
        path: '/dashboard/images/manager'
      },
      {
        id: 'images-generator',
        label: 'Generator',
        icon: <Wand2 className="w-4 h-4" />,
        path: '/dashboard/images/generator'
      },
      {
        id: 'images-canvas',
        label: 'Canvas',
        icon: <Pencil className="w-4 h-4" />,
        path: '/dashboard/images/canvas'
      }
    ]
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: <Video className="w-5 h-5" />,
    path: '/dashboard/videos',
    gradient: "from-red-600 to-pink-600",
    children: [
      {
        id: 'videos-manager',
        label: 'Manager',
        icon: <FolderOpen className="w-4 h-4" />,
        path: '/dashboard/videos/manager'
      },
      {
        id: 'videos-generator',
        label: 'Generator',
        icon: <Wand2 className="w-4 h-4" />,
        path: '/dashboard/videos/generator'
      },
      {
        id: 'videos-editor',
        label: 'Clip Editor',
        icon: <Scissors className="w-4 h-4" />,
        path: '/dashboard/videos/editor'
      },
      {
        id: 'videos-thumbnail',
        label: 'Thumbnail Tool',
        icon: <Camera className="w-4 h-4" />,
        path: '/dashboard/videos/thumbnail'
      }
    ]
  },

  {
    id: 'audio',
    label: 'Audio',
    icon: <Music className="w-5 h-5" />,
    path: '/dashboard/audio',
    gradient: "from-cyan-600 to-blue-600",
    children: [
      {
        id: 'audio-manager',
        label: 'Manager',
        icon: <FolderOpen className="w-4 h-4" />,
        path: '/dashboard/audio/manager'
      },
      {
        id: 'audio-voice',
        label: 'Voice Generator',
        icon: <Mic className="w-4 h-4" />,
        path: '/dashboard/audio/voice'
      },
      {
        id: 'audio-music',
        label: 'Music Generator',
        icon: <Radio className="w-4 h-4" />,
        path: '/dashboard/audio/music'
      },
      {
        id: 'audio-editor',
        label: 'Editor',
        icon: <Scissors className="w-4 h-4" />,
        path: '/dashboard/audio/editor'
      },
      {
        id: 'audio-visualizer',
        label: 'Waveform',
        icon: <AudioWaveform className="w-4 h-4" />,
        path: '/dashboard/audio/visualizer'
      }
    ]
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: <FolderOpen className="w-5 h-5" />,
    path: '/dashboard/gallery',
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    id: 'styles',
    label: 'Styles',
    icon: <Palette className="w-5 h-5" />,
    path: '/dashboard/styles',
    gradient: "from-orange-600 to-red-600"
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/dashboard/settings',
    gradient: "from-gray-600 to-slate-600"
  }
];

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function DashboardSidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: DashboardSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, [setIsCollapsed]);

  // Auto-expand the parent of the active route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find which parent item should be expanded based on the current path
    navigationItems.forEach(item => {
      if (item.children && item.children.some(child => currentPath.startsWith(child.path))) {
        if (!expandedItems.includes(item.id)) {
          setExpandedItems(prev => [...prev, item.id]);
        }
      }
    });
  }, [location.pathname, expandedItems]);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  // Toggle expanded state for an item
  const toggleExpand = (itemId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  // Check if a path is active (exact match or starts with path)
  const isPathActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Check if a child path is active
  const isChildPathActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-all duration-300 ease-in-out
          bg-gradient-to-b from-gray-900/95 to-black/95
          backdrop-blur-xl border-r border-white/20 shadow-xl
        `}
        aria-expanded={!isCollapsed}
        aria-controls="sidebar-content"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-4 w-16 h-16 bg-purple-600/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-4 w-20 h-20 bg-pink-600/8 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            {!isCollapsed && (
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-2 rounded-lg shadow-lg">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <h1 className="text-base font-black text-white tracking-tight">OpenModel</h1>
                  <p className="text-xs text-white/60 font-medium">Studio</p>
                </div>
              </Link>
            )}
            
            {isCollapsed && (
              <div className="mx-auto">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-2 rounded-lg shadow-lg">
                  <Zap className="w-5 h-5 text-black" />
                </div>
              </div>
            )}

            {/* Desktop Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent" id="sidebar-content">
            {navigationItems.map((item) => {
              const isActive = isPathActive(item.path);
              const isExpanded = expandedItems.includes(item.id);
              const hasChildren = item.children && item.children.length > 0;
              
              return (
                <div key={item.id} className="flex flex-col">
                  <Link
                    to={item.path}
                    onClick={(e) => {
                      if (hasChildren) {
                        toggleExpand(item.id, e);
                      } else {
                        handleNavClick();
                      }
                    }}
                    className={`
                      group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-r ${item.gradient} shadow-md scale-105 text-white` 
                        : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`
                      ${isActive ? 'scale-110' : 'group-hover:scale-110'} 
                      transition-transform duration-300
                    `}>
                      {item.icon}
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span className="font-medium text-sm tracking-tight flex-1">
                          {item.label}
                        </span>
                        
                        {hasChildren && (
                          <button 
                            onClick={(e) => toggleExpand(item.id, e)}
                            className="text-white/60 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                        
                        {isActive && !hasChildren && (
                          <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        )}
                      </>
                    )}
                  </Link>
                  
                  {/* Nested Children */}
                  {!isCollapsed && hasChildren && isExpanded && (
                    <div className="ml-7 mt-1 space-y-1 border-l border-white/10 pl-2">
                      {item.children?.map((child) => {
                        const isChildActive = isChildPathActive(child.path);
                        
                        return (
                          <Link
                            key={child.id}
                            to={child.path}
                            onClick={handleNavClick}
                            className={`
                              group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
                              ${isChildActive 
                                ? `bg-white/10 text-white` 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            <div className={`
                              ${isChildActive ? 'text-white' : 'text-white/60 group-hover:text-white'} 
                              transition-colors duration-300
                            `}>
                              {child.icon}
                            </div>
                            
                            <span className="font-medium text-xs tracking-tight">
                              {child.label}
                            </span>
                            
                            {isChildActive && (
                              <div className="ml-auto w-1 h-1 bg-white rounded-full animate-pulse"></div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/10">
            {!isCollapsed ? (
              <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-white/20 rounded-lg p-2.5 text-center">
                <div className="text-center">
                  <p className="text-white font-bold text-sm mb-1">Pro Plan</p>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mb-1">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-white/50 text-xs">750/1000 credits</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">75%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}