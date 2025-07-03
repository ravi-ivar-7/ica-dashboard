import React, { useState } from 'react';
import { Image, Video, Palette, Brain, Zap, ArrowRight, Star, Users, Clock, Search, Filter, Sparkles } from 'lucide-react';
import { useConsent } from '@/contexts/ConsentContext';
import { toast } from '@/contexts/ToastContext';

const models = [
  {
    name: "Veo 3",
    label: "Video",
    badges: ["Realistic", "Video", "Motion"],
    icon: <Video className="w-8 h-8" />,
    gradient: "from-red-600 to-pink-600",
    users: "1.5k",
    rating: 4.9,
    emoji: "🎬",
    tags: ["video", "realistic", "motion", "cinematic"]
  },
  {
    name: "SDXL",
    label: "Image", 
    badges: ["High-Res", "Detailed", "Fast"],
    icon: <Image className="w-8 h-8" />,
    gradient: "from-purple-600 to-indigo-600",
    users: "2.4k",
    rating: 4.8,
    emoji: "🎨",
    tags: ["image", "high-res", "detailed", "fast"]
  },
  {
    name: "DreamShaper",
    label: "Art",
    badges: ["Artistic", "Creative", "Stylized"],
    icon: <Palette className="w-8 h-8" />,
    gradient: "from-pink-600 to-purple-600",
    users: "1.8k",
    rating: 4.9,
    emoji: "✨",
    tags: ["art", "artistic", "creative", "stylized"]
  },
  {
    name: "Realistic Vision",
    label: "Photo",
    badges: ["Photorealistic", "Portrait", "Sharp"],
    icon: <Brain className="w-8 h-8" />,
    gradient: "from-blue-600 to-cyan-600",
    users: "3.1k",
    rating: 4.7,
    emoji: "📸",
    tags: ["photo", "realistic", "portrait", "sharp"]
  },
  {
    name: "Anime Diffusion",
    label: "Anime",
    badges: ["Anime", "Manga", "Character"],
    icon: <Zap className="w-8 h-8" />,
    gradient: "from-orange-600 to-red-600",
    users: "967",
    rating: 4.8,
    emoji: "🎭",
    tags: ["anime", "manga", "character", "stylized"]
  },
  {
    name: "AudioCraft",
    label: "Audio",
    badges: ["Music", "Voice", "Sound"],
    icon: <Sparkles className="w-8 h-8" />,
    gradient: "from-emerald-600 to-teal-600",
    users: "654",
    rating: 4.6,
    emoji: "🎵",
    tags: ["audio", "music", "voice", "sound"]
  }
];

const categories = [
  { id: 'all', name: 'All Models', count: models.length },
  { id: 'image', name: 'Image', count: 3 },
  { id: 'video', name: 'Video', count: 1 },
  { id: 'audio', name: 'Audio', count: 1 },
  { id: 'art', name: 'Art', count: 2 }
];

export default function FeaturedModels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { openConsentModal } = useConsent();

  // Filter models based on search and category
  const filteredModels = models.filter(model => {
    const matchesSearch = searchQuery === '' || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.badges.some(badge => badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      model.label.toLowerCase() === selectedCategory ||
      (selectedCategory === 'art' && ['art', 'anime'].includes(model.label.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  const handleTryModel = (modelName: string) => {
    openConsentModal(() => {
      // This action will run after consent is given
      toast.success(`Starting ${modelName} model...`, {
        subtext: 'Initializing AI model for content generation',
        duration: 6000,
        position: 'top-right'
      });
      // Here you would typically navigate to the model or start the generation process
    });
  };

  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-600/30 to-yellow-600/30 backdrop-blur-xl border border-orange-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-orange-400" />
            <span className="text-orange-300 font-bold text-sm sm:text-base">Featured Models</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            Powerful AI
            <span className="block bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Models
            </span>
          </h2>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto mb-8">
            Choose from our curated collection of state-of-the-art AI models
          </p>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-center mb-8">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI models..."
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all text-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-black shadow-lg'
                        : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Info */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="text-center mb-6">
                <p className="text-white/60">
                  {filteredModels.length === 0 ? 'No models found' : 
                   `Showing ${filteredModels.length} of ${models.length} models`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Models Grid - Responsive & Distinguishable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {filteredModels.map((model, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 text-center hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer">
              {/* Icon with Emoji */}
              <div className={`bg-gradient-to-r ${model.gradient} p-4 sm:p-6 rounded-2xl inline-block mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl relative`}>
                <span className="text-2xl sm:text-3xl">{model.emoji}</span>
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Label Badge */}
              <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-1 inline-block mb-3 sm:mb-4 border border-white/10">
                <span className="text-orange-400 font-black text-xs sm:text-sm px-2 sm:px-3 py-1">{model.label}</span>
              </div>

              {/* Model Name */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white mb-3 sm:mb-4 group-hover:text-orange-400 transition-colors">
                {model.name}
              </h3>
              
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-1 justify-center mb-4 sm:mb-6">
                {model.badges.map((badge, badgeIndex) => (
                  <span key={badgeIndex} className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 text-white/80 px-2 py-1 rounded-full text-xs font-medium border border-white/20 backdrop-blur-sm">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-white/60 text-xs sm:text-sm mb-4 sm:mb-6">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="font-medium">{model.users}</span>
                </div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{model.rating}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => handleTryModel(model.name)}
                className="w-full bg-gradient-to-r from-orange-600/30 to-yellow-600/30 hover:from-orange-600/50 hover:to-yellow-600/50 text-white font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 border border-orange-500/40 hover:border-orange-400/60 backdrop-blur-sm text-xs sm:text-sm group-hover:scale-105"
              >
                Try Model
              </button>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-black text-white mb-4">No Models Found</h3>
            <p className="text-white/70 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                toast.info('Filters cleared', {
                  subtext: 'Showing all available models',
                  duration: 3000
                });
              }}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats & CTA Section */}
        <div className="bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-12 max-w-6xl mx-auto">
          <div className="text-center">
            {/* Stats */}
            <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto border border-white/10 backdrop-blur-sm mb-6 sm:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Users className="w-5 sm:w-6 h-5 sm:h-6 text-orange-400" />
                  <span className="text-white/70 text-sm sm:text-base lg:text-lg font-medium">50,000+ creators</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold text-sm sm:text-base lg:text-lg">4.8/5 rating</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm sm:text-base lg:text-lg">1M+ models trained</span>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <button 
              onClick={() => openConsentModal(() => {
                toast.success('Exploring all models...', {
                  subtext: 'Redirecting to our complete model collection',
                  duration: 5000
                });
                // Navigate to models page
              })}
              className="group bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-black px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 rounded-2xl text-base sm:text-lg lg:text-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25"
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                <Zap className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 group-hover:animate-bounce" />
                <span>Explore All Models</span>
                <ArrowRight className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}