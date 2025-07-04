import React, { useState, useEffect } from 'react';
import { Image, Upload, Search, Zap, Download, Trash2, X, Check, Settings, Info } from 'lucide-react';

import {   Model } from '@/DashboardModule/Types/dashboard';
import { Asset } from '@/AssetsModule/Types/assets';
import { mockApi } from '@/CommonModule/APIs/api';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
import LoadingSpinner from '@/CommonModule/Components/LoadingSpinner';
import ModelSelector from '@/CommonModule/Components/ModelSelector';
import ParameterControl from '@/CommonModule/Components/ParameterControl';
import AssetCard from '@/CommonModule/Components/AssetCard';
import MediaUploader from '@/CommonModule/Components/MediaUploader';
import { toast } from '@/CommonModule/Contexts/ToastContext';

// Parameter help text definitions
const parameterHelpText = {
  prompt: "Describe what you want to generate in detail. Be specific about style, subject, lighting, composition, etc. The more detailed, the better the results.",
  negative_prompt: "Describe what you want to avoid in the generated image. This helps the AI understand what not to include.",
  guidance: "Controls how closely the AI follows your prompt. Higher values = more faithful to prompt but potentially less creative.",
  steps: "Number of denoising steps. More steps = higher quality but slower generation. Diminishing returns after ~30-50 steps.",
  seed: "Random seed for reproducibility. Using the same seed with the same parameters will produce similar results.",
  width: "Width of the generated image in pixels. Higher resolution requires more processing power and may be slower.",
  height: "Height of the generated image in pixels. Higher resolution requires more processing power and may be slower.",
  sampler: "Different sampling methods produce different visual results. Experiment to find what works best for your style.",
  cfg_scale: "Classifier-Free Guidance scale. Controls how much the image adheres to your prompt. Higher values = more prompt adherence.",
  style_preset: "Pre-defined styles that influence the overall aesthetic of the generated image."
};

export default function ImageGenerator() {
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
  
  // Fetch models and set initial parameters
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // For demo purposes, use mock data
        const mockModels = mockApi.getModels().filter(model => model.type === 'image');
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
      subtext: 'Your images are being processed',
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
  
  // Handle image generation
  const handleGenerate = async () => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Image generated successfully', {
        subtext: 'Your image is now available in your gallery',
        duration: 5000
      });
      
      // Add a mock asset to the list
      const newAsset: Asset = {
        id: `gen-${Date.now()}`,
        name: `Generated_Image_${new Date().toISOString().slice(0, 10)}.jpg`,
        type: 'image',
        thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        size: '2.4 MB',
        dimensions: '1024x1024',
        createdAt: 'Just now',
        updatedAt: 'Just now',
        status: 'ready',
        likes: 0,
        views: 0,
        tags: ['generated', 'ai'],
        styleId: undefined,
        modelId: selectedModel.id
      };
      
      setAssets(prev => [newAsset, ...prev]);
    } catch (err) {
      toast.error('Failed to generate image');
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
              <Image className="w-8 h-8 mr-3 text-purple-400" />
              Image Generator
            </h1>
            <p className="text-lg text-white/70">
              Create stunning images with AI models
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
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
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
                <Zap className="w-5 h-5 mr-2 text-purple-400" />
                Select Model
              </h2>
              
              <ModelSelector 
                type="image" 
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
                <Upload className="w-5 h-5 mr-2 text-purple-400" />
                Upload Images
              </h2>
              
              <div 
                onClick={() => setShowUploader(true)}
                className="border-2 border-dashed border-white/30 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all h-[calc(100%-40px)] flex flex-col items-center justify-center"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Drag & drop images here</h3>
                <p className="text-white/70 text-base mb-2">JPG, PNG, WebP, SVG (max 10MB each)</p>
                <p className="text-white/50 text-sm">Or click to browse</p>
              </div>
            </div>

            {/* Quick Parameters */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Parameters control how the AI generates your image. Hover over each parameter for specific help.
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
                
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Generate Image</span>
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
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Advanced Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Fine-tune your generation with these advanced settings. For experienced users who want more control.
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
                placeholder="Search images..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-base"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'ready', 'processing', 'failed'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
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
                  : 'Get started by generating or uploading images'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setShowUploader(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Images</span>
                </button>
                
                <button 
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
                >
                  <Zap className="w-5 h-5" />
                  <span>Generate Image</span>
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
                Upload Images
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
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']}
              maxFiles={10}
              maxSize={10 * 1024 * 1024} // 10MB
              mediaType="image"
              onClose={() => setShowUploader(false)}
            />
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}