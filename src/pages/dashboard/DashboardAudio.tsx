import React, { useState, useEffect } from 'react';
import { Music, Upload, Filter, Search, Zap, Download, Trash2, Plus, X, Check, Play, Pause, Volume2, Settings, Info } from 'lucide-react';
import { Asset, Model } from '../../types/dashboard';
import { mockApi } from '../../services/api';
import ErrorBoundary from '../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../components/dashboard/LoadingSpinner';
import FileUploader from '../../components/dashboard/FileUploader';
import ModelSelector from '../../components/dashboard/ModelSelector';
import ParameterControl from '../../components/dashboard/ParameterControl';
import AssetCard from '../../components/dashboard/AssetCard';
import { toast } from '../../contexts/ToastContext';

// Parameter help text definitions
const parameterHelpText = {
  prompt: "Describe the audio you want to generate. For music, describe the genre, mood, instruments, tempo, etc. For speech, provide the text to be spoken.",
  duration: "Length of the generated audio in seconds. Longer audio requires more processing time and resources.",
  temperature: "Controls randomness. Higher values (e.g., 1.0) make output more random; lower values (e.g., 0.2) make it more deterministic and focused.",
  top_k: "Limits token selection to the top k most likely tokens. Lower values create more predictable output.",
  top_p: "Nucleus sampling - considers the smallest set of tokens whose cumulative probability exceeds p. Helps maintain diversity while being coherent.",
  voice_preset: "For text-to-speech models, selects the voice character and style to use for generation.",
  genre: "For music generation, specifies the musical genre to influence the style of the generated audio.",
  tempo: "For music generation, controls the speed/pace of the music in beats per minute (BPM).",
  instrument: "For music generation, specifies the primary instrument to be featured in the composition.",
  mood: "For music generation, sets the emotional tone of the music (e.g., happy, sad, energetic)."
};

export default function DashboardAudio() {
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
  
  // Fetch models and set initial parameters
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // For demo purposes, use mock data
        const mockModels = mockApi.getModels().filter(model => model.type === 'audio');
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
      subtext: 'Your audio files are being processed',
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
  
  // Handle audio generation
  const handleGenerate = async () => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      toast.success('Audio generated successfully', {
        subtext: 'Your audio is now available in your gallery',
        duration: 5000
      });
      
      // Add a mock asset to the list
      const newAsset: Asset = {
        id: `gen-${Date.now()}`,
        name: `Generated_Audio_${new Date().toISOString().slice(0, 10)}.mp3`,
        type: 'audio',
        thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://example.com/audio.mp3',
        size: '8.7 MB',
        duration: '00:03:45',
        createdAt: 'Just now',
        updatedAt: 'Just now',
        status: 'ready',
        likes: 0,
        views: 0,
        tags: ['generated', 'ai', parameters.genre || 'ambient'],
        styleId: undefined,
        modelId: selectedModel.id
      };
      
      setAssets(prev => [newAsset, ...prev]);
    } catch (err) {
      toast.error('Failed to generate audio');
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
              <Music className="w-8 h-8 mr-3 text-blue-400" />
              Audio Generation
            </h1>
            <p className="text-lg text-white/70">
              Create music, voice, and sound effects with AI
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
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
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
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Select Model
              </h2>
              
              <ModelSelector 
                type="audio" 
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
                <Upload className="w-5 h-5 mr-2 text-blue-400" />
                Upload Audio
              </h2>
              
              <div 
                onClick={() => setShowUploader(true)}
                className="border-2 border-dashed border-white/30 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all h-[calc(100%-40px)] flex flex-col items-center justify-center"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Drag & drop audio files here</h3>
                <p className="text-white/70 text-base mb-2">MP3, WAV, OGG (max 50MB each)</p>
                <p className="text-white/50 text-sm">Or click to browse</p>
              </div>
            </div>

            {/* Quick Parameters */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Audio generation parameters control the output quality, style, and characteristics. Hover over each parameter for specific help.
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
                  className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-black font-black py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Generate Audio</span>
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
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Advanced Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Fine-tune your audio generation with these advanced settings. For experienced users who want more control.
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
                placeholder="Search audio..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-base"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'ready', 'processing', 'failed'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
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
        </div>
        
        {/* Gallery */}
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
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full inline-block mb-4">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No audio files found
              </h3>
              <p className="text-white/70 mb-6 text-base">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by generating or uploading audio files'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setShowUploader(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Audio</span>
                </button>
                
                <button 
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
                >
                  <Zap className="w-5 h-5" />
                  <span>Generate Audio</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="group relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base truncate">{asset.name}</h3>
                        <p className="text-white/60 text-sm">{asset.duration} • {asset.size}</p>
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
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <button className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                            <Play className="w-4 h-4 text-white" />
                          </button>
                          <div className="text-white/60 text-sm">00:00 / {asset.duration}</div>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                          <Volume2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="w-full h-10 bg-white/5 rounded-lg relative">
                        {/* Waveform visualization */}
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
                        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30 rounded-l-lg"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1 text-white/60 text-sm">
                        <span>{asset.views} plays</span>
                      </div>
                    </div>
                  </div>
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
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
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