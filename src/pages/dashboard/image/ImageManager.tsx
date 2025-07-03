import React, { useState, useEffect } from 'react';
import { Image, Upload, Search, Filter, Grid, List, Download, Trash2, Edit, Plus, X, Check } from 'lucide-react';
import { Asset } from '../../../types/dashboard';
import { mockApi } from '../../../services/api';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../../components/global/LoadingSpinner';
import AssetCard from '../../../components/dashboard/AssetCard';
import FileUploader from '../../../components/dashboard/FileUploader';
import { toast } from '../../../contexts/ToastContext';

export default function ImageManager() {
  // State for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'processing' | 'failed'>('all');
  
  // State for view options
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  
  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockAssets = mockApi.getAssets().filter(asset => asset.type === 'image');
        setAssets(mockAssets);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);
  
  // Handle file upload
  const handleFilesAccepted = (files: File[]) => {
    // For demo purposes, just show a toast
    toast.success(`${files.length} files uploaded successfully`, {
      subtext: 'Your images are being processed',
      duration: 5000
    });
    
    setShowUploader(false);
  };
  
  // Toggle asset selection
  const toggleAssetSelection = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(prev => prev.filter(assetId => assetId !== id));
    } else {
      setSelectedAssets(prev => [...prev, id]);
    }
  };
  
  // Select all assets
  const selectAllAssets = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };
  
  // Delete selected assets
  const deleteSelectedAssets = () => {
    if (selectedAssets.length === 0) return;
    
    // For demo purposes, just show a toast and update the state
    setAssets(prev => prev.filter(asset => !selectedAssets.includes(asset.id)));
    
    toast.success(`${selectedAssets.length} assets deleted`, {
      subtext: 'The selected assets have been removed',
      duration: 5000
    });
    
    setSelectedAssets([]);
    setIsSelectionMode(false);
  };
  
  // Download selected assets
  const downloadSelectedAssets = () => {
    if (selectedAssets.length === 0) return;
    
    // For demo purposes, just show a toast
    toast.success(`${selectedAssets.length} assets prepared for download`, {
      subtext: 'Your download will start shortly',
      duration: 5000
    });
  };
  
  // Filter assets based on search and filter
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || asset.status === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Image className="w-8 h-8 mr-3 text-purple-400" />
              Image Manager
            </h1>
            <p className="text-lg text-white/70">
              Organize and manage your image assets
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>
            
            <button 
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-colors text-base ${
                isSelectionMode 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>{isSelectionMode ? 'Cancel Selection' : 'Select'}</span>
            </button>
          </div>
        </div>

        {/* Search and View Options */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              {isSelectionMode && (
                <button
                  onClick={selectAllAssets}
                  className="flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <span>{selectedAssets.length === filteredAssets.length ? 'Deselect All' : 'Select All'}</span>
                </button>
              )}
              
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  } transition-colors`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  } transition-colors`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Selection Actions */}
          {isSelectionMode && selectedAssets.length > 0 && (
            <div className="mt-4 p-3 bg-white/5 rounded-xl flex flex-wrap gap-3 items-center">
              <span className="text-white/70 text-sm">
                {selectedAssets.length} items selected
              </span>
              <div className="flex-1"></div>
              <button 
                onClick={downloadSelectedAssets}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button 
                onClick={deleteSelectedAssets}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Filter Options */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-wrap gap-3">
            <span className="text-white/70 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter:
            </span>
            {['all', 'ready', 'processing', 'failed'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner text="Loading images..." />
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-red-300 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-500/30 hover:bg-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full inline-block mb-4">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No images found
              </h3>
              <p className="text-white/70 mb-6 text-base">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by uploading images'}
              </p>
              <button 
                onClick={() => setShowUploader(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Images</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="relative">
                  {isSelectionMode && (
                    <div 
                      className="absolute top-3 left-3 z-10 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedAssets.includes(asset.id) 
                          ? 'bg-purple-500 border-purple-500' 
                          : 'border-white'
                      } transition-colors`}>
                        {selectedAssets.includes(asset.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {viewMode === 'grid' ? (
                    <AssetCard {...asset} />
                  ) : (
                    <div className="flex items-center bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:border-white/30 transition-all duration-300">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-bold text-sm truncate">{asset.name}</h3>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                            asset.status === 'ready' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : asset.status === 'processing'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs mb-1">{asset.dimensions} • {asset.size} • {asset.createdAt}</p>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                          {asset.tags.length > 3 && (
                            <span className="bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full text-xs">
                              +{asset.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUploader(false)}
          />
          
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">
                Upload Images
              </h2>
              <button
                onClick={() => setShowUploader(false)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <FileUploader
              onFilesAccepted={handleFilesAccepted}
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']}
              maxFiles={10}
              maxSize={10 * 1024 * 1024} // 10MB
              title="Drag & drop images here"
              description="JPG, PNG, WebP, SVG (max 10MB each)"
            />
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowUploader(false)}
                className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
              >
                Cancel
              </button>
              
              <button
                onClick={() => setShowUploader(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
              >
                <Check className="w-5 h-5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}