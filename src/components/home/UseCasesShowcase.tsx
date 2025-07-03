import React, { useState } from 'react';
import { Image, Video, Palette, User, Sparkles, ArrowRight, Play, Eye, Heart, Star, Zap, Camera, Wand2, Search, Filter } from 'lucide-react';

const useCases = [
  {
    icon: <Image className="w-8 h-8" />,
    title: "Portrait Magic",
    subtitle: "Professional headshots & artistic portraits",
    description: "Transform your selfies into studio-quality portraits with any style imaginable",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    preview: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    stats: { likes: "2.4k", views: "12k", models: "15+" },
    features: ["Studio lighting", "Multiple styles", "High resolution", "Instant results"],
    color: "purple",
    emoji: "🎭",
    tags: ["portrait", "headshot", "professional", "studio", "artistic"]
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Creative Videos",
    subtitle: "Cinematic content & dynamic reels",
    description: "Turn simple clips into professional-grade video content with AI-powered enhancement",
    gradient: "from-red-600 via-pink-600 to-rose-600",
    preview: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    stats: { likes: "1.8k", views: "9.5k", models: "8+" },
    features: ["Cinematic quality", "Motion effects", "Style transfer", "Auto editing"],
    color: "red",
    emoji: "🎬",
    tags: ["video", "cinematic", "reels", "motion", "editing"]
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Brand Assets",
    subtitle: "Consistent visual identity at scale",
    description: "Generate cohesive brand materials that maintain your unique style across all platforms",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    preview: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    stats: { likes: "3.1k", views: "15k", models: "12+" },
    features: ["Brand consistency", "Multiple formats", "Logo variations", "Color schemes"],
    color: "emerald",
    emoji: "🎨",
    tags: ["brand", "logo", "identity", "marketing", "business"]
  },
  {
    icon: <User className="w-8 h-8" />,
    title: "Custom Avatars",
    subtitle: "Digital twins for any scenario",
    description: "Create photorealistic avatars that capture your essence for virtual presence",
    gradient: "from-blue-600 via-cyan-600 to-sky-600",
    preview: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    stats: { likes: "1.9k", views: "8.2k", models: "10+" },
    features: ["Photorealistic", "Multiple poses", "Virtual presence", "Gaming ready"],
    color: "blue",
    emoji: "👤",
    tags: ["avatar", "digital", "virtual", "gaming", "metaverse"]
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Experimental Art",
    subtitle: "Push creative boundaries",
    description: "Explore new artistic dimensions with AI-powered creative tools and style fusion",
    gradient: "from-yellow-600 via-orange-600 to-amber-600",
    preview: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    stats: { likes: "2.7k", views: "11k", models: "20+" },
    features: ["Style fusion", "Abstract art", "Creative filters", "Unique outputs"],
    color: "yellow",
    emoji: "✨",
    tags: ["art", "experimental", "creative", "abstract", "fusion"]
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Product Shots",
    subtitle: "Commercial-grade photography",
    description: "Generate stunning product photography with perfect lighting and composition",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    preview: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    stats: { likes: "1.5k", views: "7.8k", models: "6+" },
    features: ["Studio lighting", "Multiple angles", "Background removal", "E-commerce ready"],
    color: "violet",
    emoji: "📸",
    tags: ["product", "photography", "commercial", "ecommerce", "studio"]
  }
];

const categories = [
  { id: 'all', name: 'All', count: useCases.length },
  { id: 'creative', name: 'Creative', count: 3 },
  { id: 'business', name: 'Business', count: 2 },
  { id: 'personal', name: 'Personal', count: 2 }
];

export default function UseCasesShowcase() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentUseCase = useCases[activeUseCase];

  // Filter use cases based on search and category
  const filteredUseCases = useCases.filter(useCase => {
    const matchesSearch = searchQuery === '' || 
      useCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      useCase.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      useCase.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      useCase.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'creative' && ['art', 'video', 'avatar'].some(tag => useCase.tags.includes(tag))) ||
      (selectedCategory === 'business' && ['brand', 'product'].some(tag => useCase.tags.includes(tag))) ||
      (selectedCategory === 'personal' && ['portrait', 'avatar'].some(tag => useCase.tags.includes(tag)));
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/8 to-orange-900/6"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/12 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/6 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        {/* Premium Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-2xl border border-purple-500/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-bold text-base">Creative Possibilities</span>
            <Wand2 className="w-5 h-5 text-pink-400" />
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
            What You Can
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
              Create
            </span>
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 max-w-5xl mx-auto leading-relaxed font-medium mb-8">
            Unleash your creativity with AI-powered tools designed for every type of content creator
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
                  placeholder="Search use cases..."
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-lg"
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
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
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
                  {filteredUseCases.length === 0 ? 'No results found' : 
                   `Showing ${filteredUseCases.length} of ${useCases.length} use cases`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Showcase */}
        <div className="mb-16 sm:mb-24">
          <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Visual Side */}
              <div className="relative group">
                <img 
                  src={currentUseCase.preview}
                  alt={currentUseCase.title}
                  className="w-full h-80 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Floating Badge */}
                <div className="absolute top-6 left-6">
                  <div className={`bg-gradient-to-r ${currentUseCase.gradient} text-white px-4 py-2 rounded-full text-sm font-black shadow-2xl flex items-center space-x-2`}>
                    <span className="text-lg">{currentUseCase.emoji}</span>
                    <span>Featured</span>
                  </div>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-full p-6 hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-5 h-5 text-red-400" />
                          <span className="font-bold">{currentUseCase.stats.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-5 h-5 text-blue-400" />
                          <span className="font-bold">{currentUseCase.stats.views}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="font-bold">{currentUseCase.stats.models}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <div className="mb-6">
                  <div className={`bg-gradient-to-r ${currentUseCase.gradient} p-4 rounded-2xl inline-block shadow-2xl mb-6`}>
                    {currentUseCase.icon}
                  </div>
                </div>
                
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                  {currentUseCase.title}
                </h3>
                <p className="text-xl text-purple-400 font-bold mb-6">{currentUseCase.subtitle}</p>
                <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
                  {currentUseCase.description}
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {currentUseCase.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                      <span className="text-white/80 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`bg-gradient-to-r ${currentUseCase.gradient} text-white font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3 w-fit`}>
                  <Zap className="w-6 h-6" />
                  <span>Try This Style</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {filteredUseCases.map((useCase, index) => (
            <div 
              key={index} 
              className={`group relative bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-105 hover:border-white/30 hover:shadow-2xl ${
                index === activeUseCase ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20' : ''
              }`}
              onClick={() => setActiveUseCase(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={useCase.preview}
                  alt={useCase.title}
                  className="w-full h-56 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`bg-gradient-to-r ${useCase.gradient} p-3 rounded-xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{useCase.emoji}</span>
                  </div>
                </div>

                {/* Active Indicator */}
                {index === activeUseCase && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black">
                      Active
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
                  hoveredCard === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-4 hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-2xl rounded-xl p-3 border border-white/20">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="font-bold">{useCase.stats.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="font-bold">{useCase.stats.views}</span>
                        </div>
                      </div>
                      <span className="text-purple-400 font-bold">{useCase.stats.models}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-white/60 text-sm mb-4 font-medium">{useCase.subtitle}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 bg-gradient-to-r ${useCase.gradient} rounded-full`}></div>
                    <span className="text-white/80 text-sm font-medium">{useCase.color}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {filteredUseCases.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black text-white mb-4">No Results Found</h3>
            <p className="text-white/70 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Premium CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 lg:p-16 max-w-5xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                Ready to Create?
              </h3>
              <Wand2 className="w-10 h-10 text-pink-400" />
            </div>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/70 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Join thousands of creators bringing their imagination to life with AI-powered tools
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 sm:mb-12">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-2">50K+</div>
                <div className="text-white/60 font-bold text-lg">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-pink-400 mb-2">1M+</div>
                <div className="text-white/60 font-bold text-lg">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-2">5M+</div>
                <div className="text-white/60 font-bold text-lg">Assets Generated</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-10 sm:px-16 py-5 sm:py-6 rounded-2xl text-xl sm:text-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25">
                <div className="flex items-center space-x-4">
                  <Sparkles className="w-7 h-7 group-hover:animate-spin" />
                  <span>Start Creating</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button className="border-2 border-white/30 text-white font-black px-10 sm:px-16 py-5 sm:py-6 rounded-2xl text-xl sm:text-2xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm hover:border-white/50">
                <div className="flex items-center space-x-4">
                  <Eye className="w-7 h-7" />
                  <span>View Gallery</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}