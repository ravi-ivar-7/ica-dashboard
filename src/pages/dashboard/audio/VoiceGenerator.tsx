import React, { useState, useEffect } from 'react';
import { Mic, Upload, Search, Zap, Download, Trash2, Play, Pause, Volume2, Settings, Info, User } from 'lucide-react';
import { Asset, Model } from '../../../types/dashboard';
import { mockApi } from '../../../services/api';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../../components/dashboard/LoadingSpinner';
import ModelSelector from '../../../components/dashboard/ModelSelector';
import ParameterControl from '../../../components/dashboard/ParameterControl';
import { toast } from '../../../contexts/ToastContext';

// Parameter help text definitions
const parameterHelpText = {
  text: "The text content you want to convert to speech. Can include punctuation for natural pauses.",
  voice: "The voice style to use for generation. Different voices have different characteristics.",
  language: "The language of the input text and generated speech.",
  speed: "How fast or slow the speech is generated. 1.0 is normal speed.",
  pitch: "The pitch of the voice. Higher values make the voice higher-pitched, lower values make it deeper.",
  stability: "Controls how consistent the voice sounds. Higher values are more stable but may sound more robotic.",
  style: "The speaking style or emotion to apply to the voice.",
  clarity: "Controls how clear and articulate the speech is.",
  temperature: "Controls randomness. Higher values make output more varied; lower values make it more deterministic."
};

export default function VoiceGenerator() {
  // State for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'processing' | 'failed'>('all');
  
  // State for generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  
  // State for audio playback
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockAssets = mockApi.getAssets().filter(asset => asset.type === 'audio');
        
        // Convert to voice assets
        const voiceAssets = mockAssets.map(asset => ({
          ...asset,
          name: asset.name.replace('Ambient_Track', 'Voice_Clip'),
          tags: [...asset.tags.filter(tag => tag !== 'ambient'), 'voice', 'speech']
        }));
        
        setAssets(voiceAssets);
        
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
          // Convert to voice-specific models
          const voiceModel = {
            ...mockModels[0],
            name: 'VoiceGen Pro',
            description: 'Advanced text-to-speech with natural voice synthesis',
            parameters: {
              text: { default: '' },
              voice: { 
                options: [
                  { value: 'male_1', label: 'Male 1 - Professional' },
                  { value: 'male_2', label: 'Male 2 - Casual' },
                  { value: 'female_1', label: 'Female 1 - Professional' },
                  { value: 'female_2', label: 'Female 2 - Casual' },
                  { value: 'neutral', label: 'Neutral' }
                ], 
                default: 'female_1' 
              },
              language: { 
                options: [
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'ja', label: 'Japanese' }
                ], 
                default: 'en' 
              },
              speed: { min: 0.5, max: 2.0, step: 0.1, default: 1.0 },
              pitch: { min: 0.5, max: 2.0, step: 0.1, default: 1.0 },
              style: { 
                options: [
                  { value: 'neutral', label: 'Neutral' },
                  { value: 'formal', label: 'Formal' },
                  { value: 'friendly', label: 'Friendly' },
                  { value: 'excited', label: 'Excited' },
                  { value: 'sad', label: 'Sad' }
                ], 
                default: 'neutral' 
              }
            }
          };
          
          setSelectedModel(voiceModel);
          
          // Initialize parameters with default values
          const initialParams: Record<string, any> = {};
          if (voiceModel.parameters) {
            Object.entries(voiceModel.parameters).forEach(([key, param]) => {
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

  // Handle parameter change
  const handleParameterChange = (id: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle voice generation
  const handleGenerate = async () => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }
    
    if (!parameters.text || parameters.text.trim() === '') {
      toast.error('Please enter some text to convert to speech');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Voice generated successfully', {
        subtext: 'Your voice clip is now available in your gallery',
        duration: 5000
      });
      
      // Add a mock asset to the list
      const newAsset: Asset = {
        id: `gen-${Date.now()}`,
        name: `Voice_Clip_${new Date().toISOString().slice(0, 10)}.mp3`,
        type: 'audio',
        thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://example.com/audio.mp3',
        size: '3.2 MB',
        duration: '00:00:45',
        createdAt: 'Just now',
        updatedAt: 'Just now',
        status: 'ready',
        likes: 0,
        views: 0,
        tags: ['generated', 'voice', 'speech', parameters.voice || 'female_1'],
        styleId: undefined,
        modelId: selectedModel.id
      };
      
      setAssets(prev => [newAsset, ...prev]);
    } catch (err) {
      toast.error('Failed to generate voice');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
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
              <Mic className="w-8 h-8 mr-3 text-blue-400" />
              Voice Generator
            </h1>
            <p className="text-lg text-white/70">
              Convert text to natural-sounding speech
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Parameters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Selection */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
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
            
            {/* Voice Settings */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Voice Settings
              </h2>
              
              <div className="space-y-4">
                {selectedModel && selectedModel.parameters ? (
                  <>
                    <ParameterControl
                      parameter={{
                        id: 'voice',
                        name: 'Voice',
                        description: 'Select the voice style',
                        type: 'select',
                        options: selectedModel.parameters.voice?.options,
                        defaultValue: selectedModel.parameters.voice?.default,
                        helpText: parameterHelpText.voice
                      }}
                      value={parameters.voice || selectedModel.parameters.voice?.default}
                      onChange={handleParameterChange}
                    />
                    
                    <ParameterControl
                      parameter={{
                        id: 'language',
                        name: 'Language',
                        description: 'Select the language',
                        type: 'select',
                        options: selectedModel.parameters.language?.options,
                        defaultValue: selectedModel.parameters.language?.default,
                        helpText: parameterHelpText.language
                      }}
                      value={parameters.language || selectedModel.parameters.language?.default}
                      onChange={handleParameterChange}
                    />
                    
                    <ParameterControl
                      parameter={{
                        id: 'style',
                        name: 'Speaking Style',
                        description: 'Select the speaking style',
                        type: 'select',
                        options: selectedModel.parameters.style?.options,
                        defaultValue: selectedModel.parameters.style?.default,
                        helpText: parameterHelpText.style
                      }}
                      value={parameters.style || selectedModel.parameters.style?.default}
                      onChange={handleParameterChange}
                    />
                  </>
                ) : (
                  <div className="text-white/60 text-center py-4 text-base">
                    Select a model to see voice options
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Text Input & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Text to Speech
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Enter the text you want to convert to speech. Use punctuation for natural pauses.
                  </div>
                </div>
              </h2>
              
              <div className="space-y-4">
                <textarea
                  value={parameters.text || ''}
                  onChange={(e) => handleParameterChange('text', e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  rows={6}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ParameterControl
                    parameter={{
                      id: 'speed',
                      name: 'Speed',
                      description: 'How fast the speech is generated',
                      type: 'slider',
                      min: 0.5,
                      max: 2.0,
                      step: 0.1,
                      defaultValue: 1.0,
                      helpText: parameterHelpText.speed
                    }}
                    value={parameters.speed || 1.0}
                    onChange={handleParameterChange}
                  />
                  
                  <ParameterControl
                    parameter={{
                      id: 'pitch',
                      name: 'Pitch',
                      description: 'Voice pitch adjustment',
                      type: 'slider',
                      min: 0.5,
                      max: 2.0,
                      step: 0.1,
                      defaultValue: 1.0,
                      helpText: parameterHelpText.pitch
                    }}
                    value={parameters.pitch || 1.0}
                    onChange={handleParameterChange}
                  />
                </div>
                
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !parameters.text || parameters.text.trim() === ''}
                  className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Generate Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Recent Generations */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Voice Clips
                </h2>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clips..."
                    className="w-48 pl-9 pr-3 py-1.5 rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all text-sm"
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" text="Loading voice clips..." />
                </div>
              ) : error ? (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <Mic className="w-8 h-8 text-blue-400/50 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">
                    No voice clips found
                  </h3>
                  <p className="text-white/70 text-sm">
                    {searchQuery || filterType !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Generate your first voice clip to get started'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssets.slice(0, 5).map((asset) => (
                    <div key={asset.id} className="group relative bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-3">
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
                            <span>{asset.tags.slice(0, 2).join(', ')}</span>
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
              
              {filteredAssets.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                    View All Voice Clips
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}