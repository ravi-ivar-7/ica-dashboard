import React, { useState, useEffect } from 'react';
import { Music, Upload, Search, Zap, Download, Trash2, Play, Pause, Volume2, Settings, Info, Radio, X } from 'lucide-react';
import { Asset, Model } from '../../../types/dashboard';
import { mockApi } from '../../../services/api';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import LoadingSpinner from '../../../components/global/LoadingSpinner';
import ModelSelector from '../../../components/dashboard/ModelSelector';
import ParameterControl from '../../../components/dashboard/ParameterControl';
import MediaUploader from '../../../components/dashboard/MediaUploader';
import { toast } from '../../../contexts/ToastContext';

// Parameter help text definitions
const parameterHelpText = {
  prompt: "Describe the music you want to generate. Include genre, mood, instruments, tempo, and any specific musical elements.",
  duration: "Length of the generated music in seconds. Longer music requires more processing time and resources.",
  temperature: "Controls randomness. Higher values (e.g., 1.0) make output more random; lower values (e.g., 0.2) make it more deterministic.",
  genre: "Musical genre that defines the overall style and characteristics of the generated music.",
  mood: "Emotional quality of the music (e.g., happy, sad, energetic, calm).",
  instruments: "Primary instruments to be featured in the composition.",
  tempo: "Speed of the music in beats per minute (BPM).",
  key: "Musical key for the composition (e.g., C Major, A Minor).",
  structure: "Arrangement structure of the music (e.g., verse-chorus-verse, AABA).",
  reference_track: "Optional link to a reference track to influence the style.",
  top_k: "Limits token selection to the top k most likely tokens. Lower values create more predictable output.",
  top_p: "Nucleus sampling - considers the smallest set of tokens whose cumulative probability exceeds p."
};

export default function MusicGenerator() {
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
  
  // State for audio playback
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data
        const mockAssets = mockApi.getAssets().filter(asset => asset.type === 'audio');
        
        // Convert to music assets
        const musicAssets = mockAssets.map(asset => ({
          ...asset,
          name: asset.name.replace('Ambient_Track', 'Music_Track'),
          tags: [...asset.tags.filter(tag => tag !== 'ambient'), 'music', 'composition']
        }));
        
        setAssets(musicAssets);
        
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
          // Convert to music-specific models
          const musicModel = {
            ...mockModels[0],
            name: 'MusicGen Pro',
            description: 'Advanced music generation with genre and style control',
            parameters: {
              prompt: { default: '' },
              duration: { min: 10, max: 300, default: 60 },
              temperature: { min: 0.1, max: 2.0, default: 1.0 },
              genre: { 
                options: [
                  { value: 'pop', label: 'Pop' },
                  { value: 'rock', label: 'Rock' },
                  { value: 'electronic', label: 'Electronic' },
                  { value: 'classical', label: 'Classical' },
                  { value: 'jazz', label: 'Jazz' },
                  { value: 'ambient', label: 'Ambient' },
                  { value: 'hiphop', label: 'Hip Hop' }
                ], 
                default: 'pop' 
              },
              mood: { 
                options: [
                  { value: 'happy', label: 'Happy' },
                  { value: 'sad', label: 'Sad' },
                  { value: 'energetic', label: 'Energetic' },
                  { value: 'calm', label: 'Calm' },
                  { value: 'epic', label: 'Epic' },
                  { value: 'romantic', label: 'Romantic' }
                ], 
                default: 'energetic' 
              },
              tempo: { min: 60, max: 200, default: 120 },
              instruments: { 
                options: [
                  { value: 'piano', label: 'Piano' },
                  { value: 'guitar', label: 'Guitar' },
                  { value: 'drums', label: 'Drums' },
                  { value: 'strings', label: 'Strings' },
                  { value: 'synth', label: 'Synthesizer' },
                  { value: 'orchestra', label: 'Orchestra' }
                ], 
                default: 'piano' 
              }
            }
          };
          
          setSelectedModel(musicModel);
          
          // Initialize parameters with default values
          const initialParams: Record<string, any> = {};
          if (musicModel.parameters) {
            Object.entries(musicModel.parameters).forEach(([key, param]) => {
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
    toast.success(`${files.length} audio files uploaded successfully`, {
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
  
  // Handle music generation
  const handleGenerate = async () => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      toast.success('Music generated successfully', {
        subtext: 'Your music track is now available in your gallery',
        duration: 5000
      });
      
      // Add a mock asset to the list
      const newAsset: Asset = {
        id: `gen-${Date.now()}`,
        name: `Generated_${parameters.genre || 'Pop'}_Track_${new Date().toISOString().slice(0, 10)}.mp3`,
        type: 'audio',
        thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://example.com/audio.mp3',
        size: '12.4 MB',
        duration: `00:0${Math.floor(parameters.duration / 60)}:${parameters.duration % 60 < 10 ? '0' + parameters.duration % 60 : parameters.duration % 60}`,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        status: 'ready',
        likes: 0,
        views: 0,
        tags: ['generated', 'music', parameters.genre || 'pop', parameters.mood || 'energetic'],
        styleId: undefined,
        modelId: selectedModel.id
      };
      
      setAssets(prev => [newAsset, ...prev]);
    } catch (err) {
      toast.error('Failed to generate music');
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
              <Radio className="w-8 h-8 mr-3 text-purple-500" />
              Music Generator
            </h1>
            <p className="text-lg text-white/70">
              Create original music compositions with AI
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
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 text-white font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
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
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
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
            
            {/* Music Style */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <Radio className="w-5 h-5 mr-2 text-purple-500" />
                Music Style
              </h2>
              
              <div className="space-y-4">
                {selectedModel && selectedModel.parameters ? (
                  <>
                    <ParameterControl
                      parameter={{
                        id: 'genre',
                        name: 'Genre',
                        description: 'Select the musical genre',
                        type: 'select',
                        options: selectedModel.parameters.genre?.options,
                        defaultValue: selectedModel.parameters.genre?.default,
                        helpText: parameterHelpText.genre
                      }}
                      value={parameters.genre || selectedModel.parameters.genre?.default}
                      onChange={handleParameterChange}
                    />
                    
                    <ParameterControl
                      parameter={{
                        id: 'mood',
                        name: 'Mood',
                        description: 'Select the emotional quality',
                        type: 'select',
                        options: selectedModel.parameters.mood?.options,
                        defaultValue: selectedModel.parameters.mood?.default,
                        helpText: parameterHelpText.mood
                      }}
                      value={parameters.mood || selectedModel.parameters.mood?.default}
                      onChange={handleParameterChange}
                    />
                    
                    <ParameterControl
                      parameter={{
                        id: 'instruments',
                        name: 'Primary Instrument',
                        description: 'Select the main instrument',
                        type: 'select',
                        options: selectedModel.parameters.instruments?.options,
                        defaultValue: selectedModel.parameters.instruments?.default,
                        helpText: parameterHelpText.instruments
                      }}
                      value={parameters.instruments || selectedModel.parameters.instruments?.default}
                      onChange={handleParameterChange}
                    />
                  </>
                ) : (
                  <div className="text-white/60 text-center py-4 text-base">
                    Select a model to see style options
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Generation & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generation Parameters */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <Settings className="w-5 h-5 mr-2 text-purple-500" />
                Generation Parameters
                <div className="relative ml-2 group">
                  <button className="text-white/60 hover:text-white/80 transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                  <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Music generation parameters control the output quality, style, and characteristics. Hover over each parameter for specific help.
                  </div>
                </div>
              </h2>
              
              <div className="space-y-4">
                {selectedModel && selectedModel.parameters ? (
                  <>
                    <ParameterControl
                      parameter={{
                        id: 'prompt',
                        name: 'Music Description',
                        description: 'Describe the music you want to create',
                        type: 'text',
                        defaultValue: '',
                        helpText: parameterHelpText.prompt
                      }}
                      value={parameters.prompt || ''}
                      onChange={handleParameterChange}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ParameterControl
                        parameter={{
                          id: 'tempo',
                          name: 'Tempo (BPM)',
                          description: 'Speed of the music',
                          type: 'slider',
                          min: 60,
                          max: 200,
                          step: 1,
                          defaultValue: 120,
                          helpText: parameterHelpText.tempo
                        }}
                        value={parameters.tempo || 120}
                        onChange={handleParameterChange}
                      />
                      
                      <ParameterControl
                        parameter={{
                          id: 'duration',
                          name: 'Duration (seconds)',
                          description: 'Length of the generated music',
                          type: 'slider',
                          min: 10,
                          max: 300,
                          step: 10,
                          defaultValue: 60,
                          helpText: parameterHelpText.duration
                        }}
                        value={parameters.duration || 60}
                        onChange={handleParameterChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ParameterControl
                        parameter={{
                          id: 'key',
                          name: 'Musical Key',
                          description: 'Tonal center of the composition',
                          type: 'select',
                          options: [
                            { value: 'c_major', label: 'C Major' },
                            { value: 'a_minor', label: 'A Minor' },
                            { value: 'g_major', label: 'G Major' },
                            { value: 'e_minor', label: 'E Minor' },
                            { value: 'f_major', label: 'F Major' },
                            { value: 'd_minor', label: 'D Minor' }
                          ],
                          defaultValue: 'c_major',
                          helpText: parameterHelpText.key
                        }}
                        value={parameters.key || 'c_major'}
                        onChange={handleParameterChange}
                      />
                      
                      <ParameterControl
                        parameter={{
                          id: 'structure',
                          name: 'Song Structure',
                          description: 'Arrangement of musical sections',
                          type: 'select',
                          options: [
                            { value: 'verse_chorus', label: 'Verse-Chorus' },
                            { value: 'aaba', label: 'AABA Form' },
                            { value: 'intro_verse_chorus_bridge_outro', label: 'Full Structure' },
                            { value: 'ambient', label: 'Ambient/No Structure' }
                          ],
                          defaultValue: 'verse_chorus',
                          helpText: parameterHelpText.structure
                        }}
                        value={parameters.structure || 'verse_chorus'}
                        onChange={handleParameterChange}
                      />
                    </div>
                    
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 text-yellow-300 text-sm">
                      <p className="flex items-start">
                        <span className="mr-2">⚠️</span>
                        <span>Music generation may take several minutes to complete depending on the duration and complexity.</span>
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 text-white font-black py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Generate Music</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="text-white/60 text-center py-4 text-base">
                    Select a model to see parameters
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Generations */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Music className="w-5 h-5 mr-2 text-purple-500" />
                  Recent Generations
                </h2>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search music..."
                    className="w-48 pl-9 pr-3 py-1.5 rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" text="Loading music..." />
                </div>
              ) : error ? (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <Music className="w-8 h-8 text-purple-500/50 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">
                    No music tracks found
                  </h3>
                  <p className="text-white/70 text-sm">
                    {searchQuery || filterType !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Generate your first music track to get started'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssets.slice(0, 5).map((asset) => (
                    <div key={asset.id} className="group relative bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => togglePlayback(asset.id)}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg"
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
                                className="w-1 bg-purple-400/50 rounded-full"
                                style={{ 
                                  height: `${10 + Math.sin(i * 0.5) * 20}px`,
                                  opacity: i < 15 ? 1 : 0.5
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-purple-500 to-indigo-500 opacity-30 rounded-l-lg"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {filteredAssets.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                    View All Music Tracks
                  </button>
                </div>
              )}
            </div>
          </div>
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
                Upload Music
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
              acceptedFileTypes={['audio/mpeg', 'audio/wav', 'audio/ogg']}
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB
              title="Upload Music Files"
              description="MP3, WAV, OGG (max 50MB each)"
              mediaType="audio"
              onClose={() => setShowUploader(false)}
            />
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}