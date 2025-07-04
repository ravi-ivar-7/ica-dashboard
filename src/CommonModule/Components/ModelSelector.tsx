import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Zap } from 'lucide-react';
import { Model } from '../../DashboardModule/Types/dashboard';
import LoadingSpinner from './LoadingSpinner';

interface ModelSelectorProps {
  type: 'image' | 'video' | 'audio';
  onModelSelect: (model: Model) => void;
  selectedModelId?: string;
}

// Mock data for models
const mockModels: Record<string, Model[]> = {
  image: [
    {
      id: 'stable-diffusion-xl',
      name: 'Stable Diffusion XL',
      description: 'High-quality image generation with excellent detail',
      type: 'image',
      provider: 'Stability AI',
      parameters: {
        steps: { min: 1, max: 50, default: 20 },
        guidance: { min: 1, max: 20, default: 7.5 },
        width: { min: 512, max: 1024, default: 1024 },
        height: { min: 512, max: 1024, default: 1024 }
      }
    },
    {
      id: 'midjourney-v6',
      name: 'Midjourney v6',
      description: 'Artistic and creative image generation',
      type: 'image',
      provider: 'Midjourney',
      parameters: {
        steps: { min: 1, max: 50, default: 25 },
        guidance: { min: 1, max: 20, default: 8 },
        width: { min: 512, max: 1024, default: 1024 },
        height: { min: 512, max: 1024, default: 1024 }
      }
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      description: 'Advanced AI image generation with precise prompt following',
      type: 'image',
      provider: 'OpenAI',
      parameters: {
        steps: { min: 1, max: 50, default: 30 },
        guidance: { min: 1, max: 20, default: 9 },
        width: { min: 512, max: 1024, default: 1024 },
        height: { min: 512, max: 1024, default: 1024 }
      }
    }
  ],
  video: [
    {
      id: 'runway-gen3',
      name: 'Runway Gen-3',
      description: 'High-quality video generation from text and images',
      type: 'video',
      provider: 'Runway',
      parameters: {
        duration: { min: 1, max: 10, default: 4 },
        fps: { min: 12, max: 30, default: 24 },
        width: { min: 512, max: 1920, default: 1280 },
        height: { min: 512, max: 1080, default: 720 }
      }
    },
    {
      id: 'pika-labs',
      name: 'Pika Labs',
      description: 'Creative video generation with style control',
      type: 'video',
      provider: 'Pika Labs',
      parameters: {
        duration: { min: 1, max: 8, default: 3 },
        fps: { min: 12, max: 30, default: 24 },
        width: { min: 512, max: 1920, default: 1280 },
        height: { min: 512, max: 1080, default: 720 }
      }
    },
    {
      id: 'stable-video',
      name: 'Stable Video Diffusion',
      description: 'Open-source video generation model',
      type: 'video',
      provider: 'Stability AI',
      parameters: {
        duration: { min: 1, max: 6, default: 2 },
        fps: { min: 12, max: 30, default: 24 },
        width: { min: 512, max: 1024, default: 768 },
        height: { min: 512, max: 1024, default: 768 }
      }
    }
  ],
  audio: [
    {
      id: 'musicgen-large',
      name: 'MusicGen Large',
      description: 'High-quality music generation from text descriptions',
      type: 'audio',
      provider: 'Meta',
      parameters: {
        duration: { min: 5, max: 300, default: 30 },
        temperature: { min: 0.1, max: 2.0, default: 1.0 },
        top_k: { min: 1, max: 250, default: 250 },
        top_p: { min: 0.1, max: 1.0, default: 0.9 }
      }
    },
    {
      id: 'audiocraft',
      name: 'AudioCraft',
      description: 'Versatile audio generation including music and sound effects',
      type: 'audio',
      provider: 'Meta',
      parameters: {
        duration: { min: 5, max: 180, default: 20 },
        temperature: { min: 0.1, max: 2.0, default: 0.8 },
        top_k: { min: 1, max: 250, default: 200 },
        top_p: { min: 0.1, max: 1.0, default: 0.85 }
      }
    },
    {
      id: 'bark',
      name: 'Bark',
      description: 'Text-to-speech with voice cloning capabilities',
      type: 'audio',
      provider: 'Suno AI',
      parameters: {
        duration: { min: 1, max: 60, default: 10 },
        temperature: { min: 0.1, max: 1.5, default: 0.7 },
        voice_preset: { 
          options: [
            { value: 'speaker_0', label: 'Speaker 0' },
            { value: 'speaker_1', label: 'Speaker 1' },
            { value: 'speaker_2', label: 'Speaker 2' }
          ], 
          default: 'speaker_0' 
        }
      }
    }
  ]
};

export default function ModelSelector({ type, onModelSelect, selectedModelId }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data instead of API call
        const modelData = mockModels[type] || [];
        setModels(modelData);
        
        // If there's no selectedModelId and we have models, select the first one
        if (!selectedModelId && modelData.length > 0) {
          onModelSelect(modelData[0]);
        }
        
        setError(null);
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [type, onModelSelect, selectedModelId]);

  const selectedModel = models.find(model => model.id === selectedModelId) || models[0];
  
  const filteredModels = searchQuery 
    ? models.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : models;

  if (loading) {
    return <LoadingSpinner size="sm" text="Loading models..." />;
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Selected Model Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/15 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-base">{selectedModel?.name || 'Select a model'}</p>
            <p className="text-white/60 text-sm truncate max-w-[200px]">{selectedModel?.description || 'Choose an AI model'}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full bg-white/10 border border-white/20 rounded-md pl-8 pr-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Models List */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {filteredModels.length === 0 ? (
              <div className="p-3 text-center text-white/60 text-sm">
                No models found
              </div>
            ) : (
              filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelSelect(model);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors text-left
                    ${selectedModelId === model.id ? 'bg-white/5' : ''}
                  `}
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">{model.name}</p>
                    <p className="text-white/60 text-sm">{model.description}</p>
                  </div>
                  {selectedModelId === model.id && (
                    <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}