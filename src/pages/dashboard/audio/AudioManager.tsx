import React, { useState, useEffect } from 'react';
import { Music, Upload, Search, Filter, Grid, List, Download, Trash2, Play, Pause, Volume2, Plus, X, Check } from 'lucide-react';
import { Asset } from '../../../types/dashboard';
import { mockApi } from '../../../services/api';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../../components/global/LoadingSpinner';
import FileUploader from '../../../components/dashboard/FileUploader';
import { toast } from '../../../contexts/ToastContext';

export default function AudioManager() {
  // State for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'processing' | 'failed'>('all');
  
  // State for view options
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  
  // State for audio playback
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockAssets = mockApi.getAssets().filter(asset => asset.type === 'audio');
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
      subtext: 'Your audio files are being processed',
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
  
  // Toggle play/pause for a track
  const togglePlayback = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
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
              <Music className="w-8 h-8 mr-3 text-blue-400" />
              Audio Manager
            </h1>
            <p className="text-lg text-white/70">
              Organize and manage your audio files
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
                  ? 'bg-blue-500 text-white' 
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
                placeholder="Search audio..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
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
                      ? 'bg-blue-500 text-white' 
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
                      ? 'bg-blue-500 text-white' 
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
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Audio List */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner text="Loading audio files..." />
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full inline-block mb-4">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No audio files found
              </h3>
              <p className="text-white/70 mb-6 text-base">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by uploading audio files'}
              </p>
              <button 
                onClick={() => setShowUploader(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Audio</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="relative group bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  {isSelectionMode && (
                    <div 
                      className="absolute top-4 left-4 z-10 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedAssets.includes(asset.id) 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-white'
                      } transition-colors`}>
                        {selectedAssets.includes(asset.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex items-center space-x-3 ${isSelectionMode ? 'pl-8' : ''}`}>
                    <button 
                      onClick={() => togglePlayback(asset.id)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg"
                    >
                      {playingId === asset.id ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base truncate">{asset.name}</h3>
                      <div className="flex items-center text-white/60 text-xs">
                        <span>{asset.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{asset.size}</span>
                        <span className="mx-2">•</span>
                        <span>{asset.createdAt}</span>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      asset.status === 'ready' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : asset.status === 'processing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}>
                      {asset.status}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Waveform */}
                  {playingId === asset.id && (
                    <div className="mt-3 w-full h-10 bg-white/5 rounded-lg relative">
                      <div className="absolute inset-0 flex items-center justify-around px-1">
                        {[...Array(40)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-blue-400/50 rounded-full"
                            style={{ 
                              height: `${10 + Math.sin(i * 0.5) * 20}px`,
                              opacity: i < 15 ? 1 : 0.5
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 rounded-l-lg"></div>
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
                Upload Audio
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
              acceptedFileTypes={['audio/mpeg', 'audio/wav', 'audio/ogg']}
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB
              title="Drag & drop audio files here"
              description="MP3, WAV, OGG (max 50MB each)"
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
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
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