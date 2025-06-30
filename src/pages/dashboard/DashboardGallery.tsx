import React, { useState, useEffect } from 'react';
import { FolderOpen, Search, Filter, Grid, List, Download, Trash2, Edit, Tag, Plus, X, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Asset, Filter as FilterType } from '../../types/dashboard';
import { mockApi } from '../../services/api';
import ErrorBoundary from '../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../components/dashboard/LoadingSpinner';
import AssetCard from '../../components/dashboard/AssetCard';
import { toast } from '../../contexts/ToastContext';

export default function DashboardGallery() {
  // State for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    type: 'all',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'desc',
    tags: []
  });
  
  // State for view options
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockAssets = mockApi.getAssets();
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
  
  // Apply filters
  const applyFilters = (newFilters: Partial<FilterType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // For demo purposes, just close the filter panel
    setShowFilters(false);
  };
  
  // Filter assets based on search and filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filters.type === 'all' || asset.type === filters.type;
    const matchesStatus = filters.status === 'all' || asset.status === filters.status;
    const matchesTags = filters.tags?.length === 0 || 
      (filters.tags && filters.tags.some(tag => asset.tags.includes(tag)));
    
    return matchesSearch && matchesType && matchesStatus && matchesTags;
  }).sort((a, b) => {
    // Sort by the selected sort option
    switch (filters.sortBy) {
      case 'name':
        return filters.sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'size':
        // This is a simplification - in a real app we would parse the size properly
        return filters.sortDirection === 'asc'
          ? a.size.localeCompare(b.size)
          : b.size.localeCompare(a.size);
      case 'popularity':
        return filters.sortDirection === 'asc'
          ? a.views - b.views
          : b.views - a.views;
      case 'date':
      default:
        // This is a simplification - in a real app we would parse the date properly
        return filters.sortDirection === 'asc'
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt);
    }
  });

  // Get all unique tags from assets
  const allTags = Array.from(new Set(assets.flatMap(asset => asset.tags)));

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <FolderOpen className="w-8 h-8 mr-3 text-purple-400" />
              Asset Gallery
            </h1>
            <p className="text-lg text-white/70">
              Manage all your images, videos, and audio files
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            {isSelectionMode ? (
              <>
                <button 
                  onClick={downloadSelectedAssets}
                  disabled={selectedAssets.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ({selectedAssets.length})</span>
                </button>
                
                <button 
                  onClick={deleteSelectedAssets}
                  disabled={selectedAssets.length === 0}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({selectedAssets.length})</span>
                </button>
                
                <button 
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedAssets([]);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsSelectionMode(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Select</span>
                </button>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold ${
                    showFilters 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  } transition-colors`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </>
            )}
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
                placeholder="Search assets..."
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
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-400" />
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type Filter */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Asset Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                >
                  <option value="all" className="bg-gray-900">All Types</option>
                  <option value="image" className="bg-gray-900">Images</option>
                  <option value="video" className="bg-gray-900">Videos</option>
                  <option value="audio" className="bg-gray-900">Audio</option>
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                >
                  <option value="all" className="bg-gray-900">All Statuses</option>
                  <option value="ready" className="bg-gray-900">Ready</option>
                  <option value="processing" className="bg-gray-900">Processing</option>
                  <option value="failed" className="bg-gray-900">Failed</option>
                </select>
              </div>
              
              {/* Sort Options */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  >
                    <option value="date" className="bg-gray-900">Date</option>
                    <option value="name" className="bg-gray-900">Name</option>
                    <option value="size" className="bg-gray-900">Size</option>
                    <option value="popularity" className="bg-gray-900">Popularity</option>
                  </select>
                  
                  <button
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc' 
                    }))}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label={filters.sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
                  >
                    {filters.sortDirection === 'asc' ? (
                      <ArrowUp className="w-5 h-5" />
                    ) : (
                      <ArrowDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="mt-6">
              <label className="block text-white font-semibold mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-purple-400" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilters(prev => {
                        const currentTags = prev.tags || [];
                        return {
                          ...prev,
                          tags: currentTags.includes(tag)
                            ? currentTags.filter(t => t !== tag)
                            : [...currentTags, tag]
                        };
                      });
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      (filters.tags || []).includes(tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Apply Filters */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  setFilters({
                    type: 'all',
                    status: 'all',
                    sortBy: 'date',
                    sortDirection: 'desc',
                    tags: []
                  });
                }}
                className="px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Reset
              </button>
              
              <button
                onClick={() => setShowFilters(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner text="Loading assets..." />
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
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No assets found
              </h3>
              <p className="text-white/70 mb-6">
                {searchQuery || filters.type !== 'all' || filters.status !== 'all' || (filters.tags && filters.tags.length > 0)
                  ? 'Try adjusting your search or filters'
                  : 'Get started by generating or uploading assets'}
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    type: 'all',
                    status: 'all',
                    sortBy: 'date',
                    sortDirection: 'desc',
                    tags: []
                  });
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Clear Filters
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
                        <p className="text-white/60 text-xs mb-1">{asset.type} • {asset.size} • {asset.createdAt}</p>
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
    </ErrorBoundary>
  );
}