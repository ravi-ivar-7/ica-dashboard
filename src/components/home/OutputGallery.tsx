import React, { useState } from 'react';
import { Image, Video, User, Palette, Sparkles, Camera, Play, Heart, Eye, ArrowRight, Star } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: <Sparkles className="w-4 h-4" />, count: 47 },
  { id: 'portraits', name: 'Portraits', icon: <User className="w-4 h-4" />, count: 12 },
  { id: 'reels', name: 'Stylized Reels', icon: <Video className="w-4 h-4" />, count: 8 },
  { id: 'brand', name: 'Brand Assets', icon: <Palette className="w-4 h-4" />, count: 9 },
  { id: 'avatars', name: 'Custom Avatars', icon: <User className="w-4 h-4" />, count: 6 },
  { id: 'art', name: 'Experimental Art', icon: <Sparkles className="w-4 h-4" />, count: 7 },
  { id: 'products', name: 'Product Shots', icon: <Camera className="w-4 h-4" />, count: 5 }
];

const galleryItems = [
  {
    id: 1,
    category: 'portraits',
    title: "Professional Headshot Series",
    creator: "Sarah K.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Portrait",
    likes: 234,
    views: "2.4k",
    featured: true,
    gradient: "from-purple-600 to-pink-600",
    description: "AI-generated professional headshots with studio lighting"
  },
  {
    id: 2,
    category: 'reels',
    title: "Cinematic B-Roll Collection",
    creator: "Mike R.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Video",
    likes: 189,
    views: "1.8k",
    gradient: "from-red-600 to-orange-600",
    description: "Dynamic video content with cinematic quality"
  },
  {
    id: 3,
    category: 'brand',
    title: "Complete Brand Identity",
    creator: "Emma D.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Brand",
    likes: 156,
    views: "1.2k",
    gradient: "from-emerald-600 to-teal-600",
    description: "Cohesive brand assets across all platforms"
  },
  {
    id: 4,
    category: 'avatars',
    title: "Digital Twin Avatar",
    creator: "Alex T.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Avatar",
    likes: 298,
    views: "3.1k",
    gradient: "from-blue-600 to-cyan-600",
    description: "Photorealistic avatar for virtual presence"
  },
  {
    id: 5,
    category: 'art',
    title: "Abstract Art Series",
    creator: "Jess M.",
    image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Art",
    likes: 167,
    views: "1.5k",
    gradient: "from-violet-600 to-purple-600",
    description: "Experimental AI-generated abstract artwork"
  },
  {
    id: 6,
    category: 'products',
    title: "Product Photography",
    creator: "David K.",
    image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Product",
    likes: 145,
    views: "1.1k",
    gradient: "from-yellow-600 to-amber-600",
    description: "High-quality product shots with perfect lighting"
  },
  {
    id: 7,
    category: 'portraits',
    title: "Artistic Portrait Style",
    creator: "Lisa W.",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Portrait",
    likes: 203,
    views: "1.9k",
    gradient: "from-pink-600 to-rose-600",
    description: "Creative portrait with artistic flair"
  },
  {
    id: 8,
    category: 'reels',
    title: "Motion Graphics Reel",
    creator: "Tom H.",
    image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Video",
    likes: 178,
    views: "1.6k",
    gradient: "from-indigo-600 to-blue-600",
    description: "Dynamic motion graphics with smooth transitions"
  },
  {
    id: 9,
    category: 'brand',
    title: "Logo Variations",
    creator: "Nina P.",
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    type: "Brand",
    likes: 134,
    views: "987",
    gradient: "from-green-600 to-emerald-600",
    description: "Multiple logo variations for different use cases"
  }
];

export default function OutputGallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems = galleryItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  const featuredItem = galleryItems.find(item => item.featured);

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-zinc-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/8 via-purple-900/6 to-pink-900/4"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500/12 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/6 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-violet-600/30 to-purple-600/30 backdrop-blur-xl border border-violet-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Camera className="w-4 sm:w-5 h-4 sm:h-5 text-violet-400 animate-pulse" />
            <span className="text-violet-300 font-bold text-sm sm:text-base">Creator Showcase</span>
            <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Real Creative
            <span className="block bg-gradient-to-r from-violet-400 via-purple-500 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
              Results
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Discover what creators are building with OpenModel Studio — from portraits to brand assets
          </p>
        </div>

        {/* Featured Item Showcase */}
        {featuredItem && (
          <div className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-500 shadow-2xl hover:shadow-violet-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative group">
                  <img 
                    src={featuredItem.image}
                    alt={featuredItem.title}
                    className="w-full h-56 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-3 hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-xl rounded-xl p-2 border border-white/20">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span>{featuredItem.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span>{featuredItem.views}</span>
                          </div>
                        </div>
                        <span className="text-violet-400 font-semibold">{featuredItem.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="mb-3">
                    <div className={`bg-gradient-to-r ${featuredItem.gradient} text-white px-2 py-1 rounded-full text-xs font-bold inline-block`}>
                      {featuredItem.type}
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3">{featuredItem.title}</h3>
                  <p className="text-white/70 text-base mb-4 leading-relaxed">{featuredItem.description}</p>
                  
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{featuredItem.creator}</p>
                        <p className="text-white/60 text-xs">Creator</p>
                      </div>
                    </div>
                  </div>

                  <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 w-fit">
                    <span>View Full Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Category Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30'
                }`}
              >
                <div className={`transition-transform duration-300 ${activeCategory === category.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {category.icon}
                </div>
                <span>{category.name}</span>
                <div className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                  activeCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/60'
                }`}>
                  {category.count}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {filteredItems.slice(0, 8).map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-500 hover:scale-105 cursor-pointer hover:shadow-2xl hover:shadow-violet-500/20"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 sm:h-48 lg:h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <div className={`bg-gradient-to-r ${item.gradient} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    {item.type}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
                  hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 hover:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-xl rounded-lg p-1.5 border border-white/20">
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-black text-white mb-1 group-hover:text-violet-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm mb-2 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white/80 text-xs font-medium">{item.creator}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-violet-400" />
              <h3 className="text-2xl sm:text-3xl font-black text-white">Join the Showcase</h3>
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            
            <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
              Create stunning, personalized content and get featured in our creator gallery
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6">
              <button className="group bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button className="border-2 border-white/20 text-white font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm hover:border-white/40">
                View All Projects
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-violet-400 mb-1">50K+</div>
                <div className="text-white/60 font-semibold text-sm">Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-1">1M+</div>
                <div className="text-white/60 font-semibold text-sm">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-pink-400 mb-1">5M+</div>
                <div className="text-white/60 font-semibold text-sm">Assets Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}