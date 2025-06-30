import React, { useState, useEffect } from 'react';
import { Palette, Upload, Search, Zap, Download, Trash2, Plus, X, Check, Clock, Eye, Heart, Star, ArrowRight, History } from 'lucide-react';
import { Style } from '../../types/dashboard';
import { mockApi } from '../../services/api';
import ErrorBoundary from '../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../components/dashboard/LoadingSpinner';
import TrainNewStyle from '../../components/dashboard/TrainNewStyle';
import { toast } from '../../contexts/ToastContext';

export default function DashboardStyles() {
  // State for styles
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  
  // State for style creation
  const [showTrainModal, setShowTrainModal] = useState(false);
  
  // Fetch styles on component mount
  useEffect(() => {
    const fetchStyles = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockStyles = mockApi.getStyles();
        setStyles(mockStyles);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);
  
  // Handle style creation
  const handleStyleCreated = (styleId: string) => {
    // In a real app, we would fetch the new style from the API
    // For demo purposes, just show a toast
    toast.success('Style training completed', {
      subtext: 'Your new style is now ready to use',
      duration: 5000
    });
    
    // Simulate adding a new style to the list
    const newStyle: Style = {
      id: styleId,
      name: 'New Trained Style',
      description: 'Custom style created with the training wizard',
      thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      type: 'image',
      status: 'ready',
      progress: 100,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      version: 1,
      isPublic: false,
      usageCount: 0,
      tags: ['custom', 'trained']
    };
    
    setStyles(prev => [newStyle, ...prev]);
  };
  
  // Filter styles based on search and filter
  const filteredStyles = styles.filter(style => {
    const matchesSearch = searchQuery === '' || 
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || style.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Palette className="w-8 h-8 mr-3 text-purple-400" />
              Style Management
            </h1>
            <p className="text-lg text-white/70">
              Train and manage your custom AI styles
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowTrainModal(true)}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Train New Style</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'image', 'video', 'audio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
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
        </div>

        {/* Styles Grid */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner text="Loading styles..." />
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
          ) : filteredStyles.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full inline-block mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No styles found
              </h3>
              <p className="text-white/70 mb-6">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by training your first custom style'}
              </p>
              <button 
                onClick={() => setShowTrainModal(true)}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Train New Style</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStyles.map((style) => (
                <div 
                  key={style.id}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={style.thumbnail}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors">
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                          <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors">
                            <Download className="w-4 h-4 text-white" />
                          </button>
                          <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors">
                            <History className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border backdrop-blur-xl ${
                        style.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : style.status === 'training'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {style.status}
                      </span>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border backdrop-blur-xl ${
                        style.type === 'image'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : style.type === 'video'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {style.type}
                      </span>
                    </div>

                    {/* Progress Bar (if training) */}
                    {style.status === 'training' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-xs">Training Progress</span>
                          <span className="text-white text-xs">{style.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full">
                          <div 
                            className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${style.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm truncate mb-1">
                          {style.name}
                        </h3>
                        <p className="text-white/60 text-xs line-clamp-2">
                          {style.description}
                        </p>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        style.isPublic 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {style.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-white/60 text-xs">
                            v{style.version}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span className="text-white/60 text-xs">
                            {style.usageCount}
                          </span>
                        </div>
                      </div>
                      
                      <button className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center space-x-1 transition-colors">
                        <span>Use</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Train New Style Modal */}
      {showTrainModal && (
        <TrainNewStyle 
          onClose={() => setShowTrainModal(false)}
          onStyleCreated={handleStyleCreated}
        />
      )}
    </ErrorBoundary>
  );
}