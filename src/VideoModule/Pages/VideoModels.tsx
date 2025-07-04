import React, { useState } from 'react';
import { Video, Download, Play, Users, Clock, Star, ChevronRight, Filter, Search, Zap, Film, Camera, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Models', icon: <Video className="w-4 h-4" />, count: 12 },
  { id: 'realistic', name: 'Realistic', icon: <Camera className="w-4 h-4" />, count: 4 },
  { id: 'cinematic', name: 'Cinematic', icon: <Film className="w-4 h-4" />, count: 3 },
  { id: 'animation', name: 'Animation', icon: <Sparkles className="w-4 h-4" />, count: 3 },
  { id: 'motion', name: 'Motion Graphics', icon: <Zap className="w-4 h-4" />, count: 2 }
];

const videoModels = [
  {
    id: 1,
    name: "Veo 3",
    description: "Next-generation video generation with unprecedented quality and realism",
    category: "realistic",
    thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 1547,
    rating: 4.9,
    duration: "2-5 min",
    resolution: "1080p",
    featured: true,
    gradient: "from-red-600 to-pink-600",
    badges: ["Realistic", "High-Quality", "Latest"],
    emoji: "🎬"
  },
  {
    id: 2,
    name: "Kling",
    description: "High-quality video creation with advanced motion understanding",
    category: "cinematic",
    thumbnail: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 847,
    rating: 4.8,
    duration: "3-8 min",
    resolution: "720p",
    gradient: "from-emerald-600 to-teal-600",
    badges: ["Cinematic", "Motion", "Professional"],
    emoji: "🎞️"
  },
  {
    id: 3,
    name: "Runway Gen-3",
    description: "Creative video synthesis with artistic flair and style control",
    category: "animation",
    thumbnail: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 1234,
    rating: 4.7,
    duration: "1-3 min",
    resolution: "1080p",
    gradient: "from-violet-600 to-purple-600",
    badges: ["Creative", "Artistic", "Fast"],
    emoji: "🚀"
  },
  {
    id: 4,
    name: "Stable Video",
    description: "Consistent and stable video generation for professional use",
    category: "realistic",
    thumbnail: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 923,
    rating: 4.6,
    duration: "2-4 min",
    resolution: "720p",
    gradient: "from-blue-600 to-cyan-600",
    badges: ["Stable", "Consistent", "Professional"],
    emoji: "📹"
  },
  {
    id: 5,
    name: "Motion Master",
    description: "Specialized for dynamic motion graphics and visual effects",
    category: "motion",
    thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 654,
    rating: 4.8,
    duration: "1-2 min",
    resolution: "1080p",
    gradient: "from-yellow-600 to-orange-600",
    badges: ["Motion", "Effects", "Dynamic"],
    emoji: "⚡"
  },
  {
    id: 6,
    name: "Anime Video",
    description: "Anime-style video generation with character animation",
    category: "animation",
    thumbnail: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    users: 789,
    rating: 4.5,
    duration: "2-6 min",
    resolution: "720p",
    gradient: "from-pink-600 to-rose-600",
    badges: ["Anime", "Character", "Animation"],
    emoji: "🎭"
  }
];

export default function VideoModels() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = videoModels.filter(model => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredModel = videoModels.find(model => model.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600/30 to-pink-600/30 backdrop-blur-xl border border-red-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <Video className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" />
            <span className="text-red-300 font-bold text-sm sm:text-base">Video Generation Models</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            AI Video
            <span className="block bg-gradient-to-r from-red-400 via-pink-500 to-orange-600 bg-clip-text text-transparent">
              Models
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto">
            Create cinematic videos with our cutting-edge AI video generation models
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
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold">
                      {featuredModel.resolution}
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

                  <button className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2">
                    <Video className="w-5 h-5" />
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
                placeholder="Search video models..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
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
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
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
                  <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">
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
                  <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
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
                  <span>{model.resolution}</span>
                </div>

                <button className="w-full bg-gradient-to-r from-red-600/30 to-pink-600/30 hover:from-red-600/50 hover:to-pink-600/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-red-500/40 hover:border-red-400/60 backdrop-blur-sm flex items-center justify-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Try Model</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
            Ready to Create Videos?
          </h3>
          <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Start generating cinematic videos with our AI models
          </p>
          <button className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-black font-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-lg">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}