import React, { useState } from 'react';
import { Music, Download, Play, Users, Clock, Star, ChevronRight, Filter, Search, Zap, Mic, Volume2, Headphones } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Models', icon: <Music className="w-4 h-4" />, count: 8 },
  { id: 'speech', name: 'Text-to-Speech', icon: <Mic className="w-4 h-4" />, count: 3 },
  { id: 'music', name: 'Music Generation', icon: <Music className="w-4 h-4" />, count: 3 },
  { id: 'effects', name: 'Sound Effects', icon: <Volume2 className="w-4 h-4" />, count: 2 }
];

const audioModels = [
  {
    id: 1,
    name: "Bark",
    description: "Advanced text-to-speech with natural voice synthesis and emotion",
    category: "speech",
    thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 892,
    rating: 4.8,
    duration: "30s",
    quality: "High",
    featured: true,
    gradient: "from-yellow-600 to-orange-600",
    badges: ["Natural", "Emotional", "Multilingual"],
    emoji: "🎵"
  },
  {
    id: 2,
    name: "AudioCraft",
    description: "Comprehensive music and audio creation with style control",
    category: "music",
    thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 654,
    rating: 4.7,
    duration: "1-2 min",
    quality: "Studio",
    gradient: "from-cyan-600 to-blue-600",
    badges: ["Music", "Audio", "Creative"],
    emoji: "🎼"
  },
  {
    id: 3,
    name: "MusicGen",
    description: "AI music composition with genre and style customization",
    category: "music",
    thumbnail: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 743,
    rating: 4.6,
    duration: "45s",
    quality: "High",
    gradient: "from-indigo-600 to-purple-600",
    badges: ["Composition", "Genre", "Style"],
    emoji: "🎹"
  },
  {
    id: 4,
    name: "VoiceClone",
    description: "Clone and synthesize voices with high fidelity reproduction",
    category: "speech",
    thumbnail: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 567,
    rating: 4.9,
    duration: "20s",
    quality: "Premium",
    gradient: "from-emerald-600 to-teal-600",
    badges: ["Voice Clone", "High Fidelity", "Custom"],
    emoji: "🎤"
  },
  {
    id: 5,
    name: "SoundFX",
    description: "Generate realistic sound effects for any scenario or environment",
    category: "effects",
    thumbnail: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 423,
    rating: 4.5,
    duration: "10s",
    quality: "High",
    gradient: "from-purple-600 to-pink-600",
    badges: ["Effects", "Realistic", "Environment"],
    emoji: "🔊"
  },
  {
    id: 6,
    name: "Ambient Pro",
    description: "Create atmospheric and ambient soundscapes for relaxation",
    category: "music",
    thumbnail: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 334,
    rating: 4.7,
    duration: "2-5 min",
    quality: "Studio",
    gradient: "from-green-600 to-emerald-600",
    badges: ["Ambient", "Relaxation", "Atmospheric"],
    emoji: "🌊"
  }
];

export default function AudioModels() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = audioModels.filter(model => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredModel = audioModels.find(model => model.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl border border-cyan-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <Music className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-sm sm:text-base">Audio Generation Models</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            AI Audio
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Models
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto">
            Generate speech, music, and sound effects with our advanced AI audio models
          </p>
        </div>

        {/* Featured Model */}
        {featuredModel && (
          <div className="mb-8 sm:mb-16">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img 
                    src={featuredModel.thumbnail}
                    alt={featuredModel.name}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black px-3 py-1 rounded-full text-sm">
                      🔥 Featured
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all duration-300 hover:scale-110">
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">
                      {featuredModel.duration}
                    </span>
                    <span className="bg-cyan-600/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold">
                      {featuredModel.quality}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">{featuredModel.name}</h3>
                  <p className="text-white/70 text-lg mb-6">{featuredModel.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredModel.badges.map((badge, index) => (
                      <span key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 px-3 py-1 rounded-full text-sm font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-6 mb-6 text-white/60">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{featuredModel.users.toLocaleString()} users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{featuredModel.rating}</span>
                    </div>
                  </div>

                  <button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2">
                    <Music className="w-5 h-5" />
                    <span>Try Model</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audio models..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredModels.map((model) => (
            <div key={model.id} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img 
                  src={model.thumbnail}
                  alt={model.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="bg-cyan-600/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold">
                    {model.duration}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{model.emoji}</span>
                  <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    {model.name}
                  </h3>
                </div>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{model.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {model.badges.map((badge, index) => (
                    <span key={index} className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-xs font-medium">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-white/60 text-sm mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{model.users.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{model.rating}</span>
                    </div>
                  </div>
                  <span>{model.quality}</span>
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-cyan-500/40 hover:border-cyan-400/60 backdrop-blur-sm flex items-center justify-center space-x-2">
                  <Music className="w-4 h-4" />
                  <span>Try Model</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
            Ready to Create Audio?
          </h3>
          <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Start generating speech, music, and sound effects with our AI models
          </p>
          <button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-lg">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}