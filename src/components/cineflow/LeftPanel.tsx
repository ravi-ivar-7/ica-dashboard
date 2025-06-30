import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import AssetItem from './AssetItem';
import { Image, Video, Music, FileText, Sticker, Upload, Search, Folder, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockAssets, mockTemplates, mockElements, mockTextStyles } from '../../data/cineflowMockData';

interface LeftPanelProps {
  onAssetDragStart: (e: React.DragEvent, asset: any) => void;
  onAddText: (textStyle: any) => void;
  onAddElement: (element: any) => void;
  onApplyTemplate: (template: any) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ 
  onAssetDragStart, 
  onAddText, 
  onAddElement,
  onApplyTemplate,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('uploads');
  const [filteredAssets, setFilteredAssets] = useState(mockAssets);
  const [filteredTemplates, setFilteredTemplates] = useState(mockTemplates);
  const [filteredElements, setFilteredElements] = useState(mockElements);
  const [filteredTextStyles, setFilteredTextStyles] = useState(mockTextStyles);

  // Add sample audio assets if they don't exist
  useEffect(() => {
    const hasAudioAssets = mockAssets.some(asset => asset.type === 'audio');
    
    if (!hasAudioAssets) {
      const audioAssets = [
        {
          id: 'aud1',
          type: 'audio' as const,
          name: 'Upbeat Music.mp3',
          src: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
          duration: '00:01:30'
        },
        {
          id: 'aud2',
          type: 'audio' as const,
          name: 'Ambient Sounds.mp3',
          src: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
          duration: '00:02:15'
        },
        {
          id: 'aud3',
          type: 'audio' as const,
          name: 'Cinematic Score.mp3',
          src: 'https://assets.mixkit.co/music/preview/mixkit-epical-drums-01-676.mp3',
          duration: '00:01:45'
        }
      ];
      
      mockAssets.push(...audioAssets);
      setFilteredAssets([...mockAssets]);
    }
  }, []);

  // Filter assets based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredAssets(mockAssets.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setFilteredTemplates(mockTemplates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setFilteredElements(mockElements.filter(element => 
        element.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setFilteredTextStyles(mockTextStyles.filter(style => 
        style.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredAssets(mockAssets);
      setFilteredTemplates(mockTemplates);
      setFilteredElements(mockElements);
      setFilteredTextStyles(mockTextStyles);
    }
  }, [searchQuery]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      // Determine file type
      let type: 'image' | 'video' | 'audio' = 'image';
      if (file.type.startsWith('video/')) {
        type = 'video';
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      }
      
      // Create new asset
      const newAsset = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        name: file.name,
        src: url,
        duration: type === 'image' ? undefined : '00:00:30'
      };
      
      // Add to assets
      setFilteredAssets(prev => [newAsset, ...prev]);
    });
    
    // Reset input
    e.target.value = '';
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full bg-gray-900/80 border-r border-white/10 w-10">
        <div className="p-1 border-b border-white/10 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Expand panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center py-2 space-y-3">
          <button
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse();
              setActiveTab('uploads');
            }}
            className={`p-1.5 rounded-lg ${activeTab === 'uploads' ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Uploads"
          >
            <Folder className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse();
              setActiveTab('templates');
            }}
            className={`p-1.5 rounded-lg ${activeTab === 'templates' ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Templates"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse();
              setActiveTab('elements');
            }}
            className={`p-1.5 rounded-lg ${activeTab === 'elements' ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Elements"
          >
            <Sticker className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse();
              setActiveTab('text');
            }}
            className={`p-1.5 rounded-lg ${activeTab === 'text' ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Text"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900/80 border-r border-white/10">
      {/* Header with collapse button */}
      <div className="p-2 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-bold text-sm">Assets</h3>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Collapse panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Search */}
      <div className="p-2 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="uploads" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 pt-2 border-b border-white/10">
          <TabsTrigger value="uploads" onClick={() => setActiveTab('uploads')}>
            <Folder className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Uploads</span>
          </TabsTrigger>
          <TabsTrigger value="templates" onClick={() => setActiveTab('templates')}>
            <Image className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="elements" onClick={() => setActiveTab('elements')}>
            <Sticker className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Elements</span>
          </TabsTrigger>
          <TabsTrigger value="text" onClick={() => setActiveTab('text')}>
            <FileText className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Text</span>
          </TabsTrigger>
        </TabsList>

        {/* Uploads Tab */}
        <TabsContent value="uploads" className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <label className="w-full flex items-center justify-center space-x-1 bg-white/10 hover:bg-white/15 text-white py-1.5 px-2 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Upload Media</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,video/*,audio/*" 
                multiple 
                onChange={handleFileUpload}
              />
            </label>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            <div className="text-white/60 text-xs font-medium mb-1">Images</div>
            {filteredAssets.filter(asset => asset.type === 'image').map(asset => (
              <AssetItem
                key={asset.id}
                id={asset.id}
                type={asset.type}
                name={asset.name}
                src={asset.src}
                onDragStart={onAssetDragStart}
              />
            ))}
            
            <div className="text-white/60 text-xs font-medium mb-1 mt-3">Videos</div>
            {filteredAssets.filter(asset => asset.type === 'video').map(asset => (
              <AssetItem
                key={asset.id}
                id={asset.id}
                type={asset.type}
                name={asset.name}
                src={asset.src}
                duration={asset.duration}
                onDragStart={onAssetDragStart}
              />
            ))}
            
            <div className="text-white/60 text-xs font-medium mb-1 mt-3">Audio</div>
            {filteredAssets.filter(asset => asset.type === 'audio').map(asset => (
              <AssetItem
                key={asset.id}
                id={asset.id}
                type={asset.type}
                name={asset.name}
                src={asset.src}
                duration={asset.duration}
                onDragStart={onAssetDragStart}
              />
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-2 space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                className="group bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-all duration-200"
                onClick={() => onApplyTemplate(template)}
              >
                <div className="aspect-video relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-2">
                    <span className="text-white text-xs font-medium">{template.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Elements Tab */}
        <TabsContent value="elements" className="flex-1 overflow-y-auto p-2 space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            {filteredElements.map(element => (
              <div 
                key={element.id}
                className="aspect-square bg-white/5 rounded-lg p-1.5 hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center"
                onClick={() => onAddElement(element)}
              >
                <img 
                  src={element.src} 
                  alt={element.name} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Text Tab */}
        <TabsContent value="text" className="flex-1 overflow-y-auto p-2 space-y-1.5">
          <button
            className="w-full bg-white/10 hover:bg-white/15 text-white py-1.5 px-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-1 mb-3"
            onClick={() => onAddText({ id: 'text-default', name: 'Default Text', style: {} })}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Add Text</span>
          </button>
          
          <div className="grid grid-cols-1 gap-2">
            {filteredTextStyles.map(textStyle => (
              <div 
                key={textStyle.id}
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                onClick={() => onAddText(textStyle)}
              >
                <p 
                  className="text-center truncate"
                  style={{
                    fontFamily: textStyle.style.fontFamily || 'sans-serif',
                    fontSize: `${textStyle.style.fontSize || 16}px`,
                    fontWeight: textStyle.style.fontWeight || 'normal',
                    color: textStyle.style.color || 'white',
                  }}
                >
                  {textStyle.name}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftPanel;