import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import AssetItem from './AssetItem';
import { Image, Video, Music, FileText, Sticker, Upload, Search, Folder, Plus } from 'lucide-react';
import { mockAssets, mockTemplates, mockElements, mockTextStyles } from '../../data/cineflowMockData';

interface LeftPanelProps {
  onAssetDragStart: (e: React.DragEvent, asset: any) => void;
  onAddText: (textStyle: any) => void;
  onAddElement: (element: any) => void;
  onApplyTemplate: (template: any) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ 
  onAssetDragStart, 
  onAddText, 
  onAddElement,
  onApplyTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('uploads');
  const [filteredAssets, setFilteredAssets] = useState(mockAssets);
  const [filteredTemplates, setFilteredTemplates] = useState(mockTemplates);
  const [filteredElements, setFilteredElements] = useState(mockElements);
  const [filteredTextStyles, setFilteredTextStyles] = useState(mockTextStyles);

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

  return (
    <div className="flex flex-col h-full bg-gray-900/80 border-r border-white/10">
      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="uploads" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-2 pt-2 border-b border-white/10">
          <TabsTrigger value="uploads" onClick={() => setActiveTab('uploads')}>
            <Folder className="w-4 h-4 mr-1" />
            <span>Uploads</span>
          </TabsTrigger>
          <TabsTrigger value="templates" onClick={() => setActiveTab('templates')}>
            <Image className="w-4 h-4 mr-1" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="elements" onClick={() => setActiveTab('elements')}>
            <Sticker className="w-4 h-4 mr-1" />
            <span>Elements</span>
          </TabsTrigger>
          <TabsTrigger value="text" onClick={() => setActiveTab('text')}>
            <FileText className="w-4 h-4 mr-1" />
            <span>Text</span>
          </TabsTrigger>
        </TabsList>

        {/* Uploads Tab */}
        <TabsContent value="uploads" className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <label className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 text-white py-2 px-3 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Media</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,video/*,audio/*" 
                multiple 
                onChange={handleFileUpload}
              />
            </label>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
            
            <div className="text-white/60 text-xs font-medium mb-1 mt-4">Videos</div>
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
            
            <div className="text-white/60 text-xs font-medium mb-1 mt-4">Audio</div>
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
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-3 space-y-2">
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
        <TabsContent value="elements" className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {filteredElements.map(element => (
              <div 
                key={element.id}
                className="aspect-square bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center"
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
        <TabsContent value="text" className="flex-1 overflow-y-auto p-3 space-y-2">
          <button
            className="w-full bg-white/10 hover:bg-white/15 text-white py-2 px-3 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-2 mb-4"
            onClick={() => onAddText({ id: 'text-default', name: 'Default Text', style: {} })}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Text</span>
          </button>
          
          <div className="grid grid-cols-1 gap-2">
            {filteredTextStyles.map(textStyle => (
              <div 
                key={textStyle.id}
                className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
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