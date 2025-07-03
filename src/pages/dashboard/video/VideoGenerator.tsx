import React, { useState, useEffect } from 'react';
import { Video, Upload, Search, Zap, Download, Trash2, X, Check, Play, Settings, Info } from 'lucide-react';
import { Asset, Model } from '../../../types/dashboard';
import { mockApi } from '../../../services/api';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../../components/global/LoadingSpinner';
import FileUploader from '../../../components/dashboard/FileUploader';
import ModelSelector from '../../../components/dashboard/ModelSelector';
import ParameterControl from '../../../components/dashboard/ParameterControl';
import AssetCard from '../../../components/dashboard/AssetCard';
import MediaUploader from '../../../components/dashboard/MediaUploader';
import { toast } from '../../../contexts/ToastContext';

// Parameter help text definitions
const parameterHelpText = {
  prompt: "Describe the video you want to generate in detail. Include information about scenes, actions, camera movements, and style.",
  negative_prompt: "Describe elements you want to avoid in the generated video. This helps prevent unwanted content.",
  duration: "Length of the generated video in seconds. Longer videos require more processing time and resources.",
  fps: "Frames per second. Higher FPS results in smoother motion but requires more processing power.",
  width: "Width of the generated video in pixels. Higher resolution requires more processing power and may be slower.",
  height: "Height of the generated video in pixels. Higher resolution requires more processing power and may be slower.",
  motion_scale: "Controls the amount of motion in the video. Higher values create more dynamic movement.",
  guidance_scale: "Controls how closely the AI follows your prompt. Higher values = more faithful to prompt but potentially less creative.",
  seed: "Random seed for reproducibility. Using the same seed with the same parameters will produce similar results.",
  style_preset: "Pre-defined styles that influence the overall aesthetic of the generated video."
};

export default function VideoGenerator() {
  // State for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'processing' | 'failed'>('all');
  
  // State for generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  
  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockAssets = mockApi.getAssets().filter(asset => asset.type === 'video');
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
  
  // Fetch models and set initial parameters
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // For demo purposes, use mock data
        const mockModels = mockApi.getModels().filter(model => model.type === 'video');
        if (mockModels.length > 0) {
          setSelectedModel(mockModels[0]);
          
          // Initialize parameters with default values
          const initialParams: Record<string, any> = {};
          if (mockModels[0].parameters) {
            Object.entries(mockModels[0].parameters).forEach(([key, param]) => {
              initialParams[key] = param.default;
            });
          }
          setParameters(initialParams);
        }
      } catch (err) {
        console.error('Failed to load models:', err);
      }
    };

    fetchModels();
  }, []);
  
  // Handle file upload
  const handleFilesAccepted = (files: File[]) => {
    // For demo purposes, just show a toast
    toast.success(`${files.length} files uploaded successfully`, {
      subtext: 'Your videos are being processed',
      duration: 5000
    });
    
    setShowUploader(false);
  };
  
  // Handle parameter change
  const handleParameterChange = (id: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle video generation
  const handleGenerate = async () => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast.success('Video generation started', {
        subtext: 'This may take a few minutes to complete',
        duration: 5000
      });
      
      // Add a mock asset to the list
      const newAsset: Asset = {
        id: `gen-${Date.now()}`,
        name: `Generated_Video_${new Date().toISOString().slice(0, 10)}.mp4`,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://example.com/video.mp4',
        size: '45.2 MB',
        duration: '00:00:15',
        createdAt: 'Just now',
        updatedAt: 'Just now',
        status: 'processing',
        likes: 0,
        views: 0,
        tags: ['generated', 'ai'],
        styleId: undefined,
        modelId: selectedModel.id
      };
      
      setAssets(prev => [newAsset, ...prev]);
      
      // Simulate the video becoming ready after some time
      setTimeout(() => {
        setAssets(prev => prev.map(asset => 
          asset.id === newAsset.id 
            ? { ...asset, status: 'ready' as const } 
            : asset
        ));
        
        toast.success('Video generation completed', {
          subtext: 'Your video is now ready to view',
          duration: 5000
        });
      }, 10000);
    } catch (err) {
      toast.error('Failed to generate video');
      console.error(err);
    } finally {
      setIsGenerating(false);
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
              <Video className="w-8 h-8 mr-3 text-red-400" />
              Video Generator
            </h1>
            <p className="text-lg text-white/70">
              Create cinematic videos with AI models
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
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Controls - Always Visible */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Model Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-red-400" />
                Select Model
              </h2>
              
              <ModelSelector 
                type="video" 
                onModelSelect={(model) => {
                  setSelectedModel(model);
                  
                  // Reset parameters to default values for the new model
                  const initialParams: Record<string, any> = {};
                  if (model.parameters) {
                    Object.entries(model.parameters).forEach(([key, param]) => {
                      initialParams[key] = param.default;
                    });
                  }
                  setParameters(initialParams);
                }}
                selectedModelId={selectedModel?.id}
              />
            </div>

            {/* Upload Zone */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Upload className="w-5 h-5 mr-2 text-red-400" />
                Upload Videos
              </h2>
              
              <div 
                onClick={() => setShowUploader(true)}
                className="border-2 border-dashed border-white/30 rounded-2xl p-6 text-center cursor-pointer hover:border-red-500/50 hover:bg-white/5 transition-all h-[calc(100%-40px)] flex flex-col items-center justify-center"
              >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Drag & drop videos here</h3>
                <p className="text-white/70 text-base mb-2">MP4, MOV, AVI (max 100MB each)</p>
                <p className="text-white/50 text-sm">Or click to browse</p>
              </div>
            </div>

            {/* Quick Parameters */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-red-400" />
                Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Video generation parameters control the output quality, style, and characteristics. Hover over each parameter for specific help.
                  </div>
                </div>
              </h2>
              
              <div className="space-y-4 bg-white/5 rounded-xl p-4 h-[calc(100%-40px)] overflow-y-auto">
                {selectedModel && selectedModel.parameters ? (
                  Object.entries(selectedModel.parameters).slice(0, 3).map(([key, param]) => (
                    <ParameterControl
                      key={key}
                      parameter={{
                        id: key,
                        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                        description: `Adjust the ${key.replace(/_/g, ' ')} value`,
                        type: typeof param.default === 'boolean' ? 'checkbox' : 
                              param.options ? 'select' : 
                              typeof param.default === 'string' && param.default.startsWith('#') ? 'color' : 
                              typeof param.min === 'number' && typeof param.max === 'number' ? 'slider' : 'text',
                        min: param.min,
                        max: param.max,
                        step: param.step || 1,
                        options: param.options,
                        defaultValue: param.default,
                        helpText: parameterHelpText[key as keyof typeof parameterHelpText]
                      }}
                      value={parameters[key] || param.default}
                      onChange={handleParameterChange}
                    />
                  ))
                ) : (
                  <div className="text-white/60 text-center py-4 text-base">
                    Select a model to see parameters
                  </div>
                )}
                
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 text-yellow-300 text-sm">
                  <p className="flex items-start">
                    <span className="mr-2">⚠️</span>
                    <span>Video generation may take several minutes to complete.</span>
                  </p>
                </div>
                
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-black font-black py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Generate Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Parameters (Collapsible) */}
        {selectedModel && selectedModel.parameters && Object.keys(selectedModel.parameters).length > 3 && (
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-red-400" />
                Advanced Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Fine-tune your video generation with these advanced settings. For experienced users who want more control.
                  </div>
                </div>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(selectedModel.parameters).slice(3).map(([key, param]) => (
                <ParameterControl
                  key={key}
                  parameter={{
                    id: key,
                    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                    description: `Adjust the ${key.replace(/_/g, ' ')} value`,
                    type: typeof param.default === 'boolean' ? 'checkbox' : 
                          param.options ? 'select' : 
                          typeof param.default === 'string' && param.default.startsWith('#') ? 'color' : 
                          typeof param.min === 'number' && typeof param.max === 'number' ? 'slider' : 'text',
                    min: param.min,
                    max: param.max,
                    step: param.step || 1,
                    options: param.options,
                    defaultValue: param.default,
                    helpText: parameterHelpText[key as keyof typeof parameterHelpText]
                  }}
                  value={parameters[key] || param.default}
                  onChange={handleParameterChange}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all text-base"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'ready', 'processing', 'failed'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                    filterType === type 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Gallery */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner text="Loading videos..." />
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
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full inline-block mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No videos found
              </h3>
              <p className="text-white/70 mb-6 text-base">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by generating or uploading videos'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setShowUploader(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Videos</span>
                </button>
                
                <button 
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
                >
                  <Zap className="w-5 h-5" />
                  <span>Generate Video</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} {...asset} />
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
          
          <div className="relative w-full max-w-3xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">
                Upload Videos
              </h2>
              <button
                onClick={() => setShowUploader(false)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <MediaUploader
              onFilesAccepted={handleFilesAccepted}
              acceptedFileTypes={['video/mp4', 'video/quicktime', 'video/x-msvideo']}
              maxFiles={5}
              maxSize={100 * 1024 * 1024} // 100MB
              mediaType="video"
              onClose={() => setShowUploader(false)}
            />
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}