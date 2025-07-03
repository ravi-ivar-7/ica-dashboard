import React, { useState } from 'react';
import { Play, ArrowRight, Eye, Zap, Video, Image, FileText, Scissors, Palette, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const demos = [
  {
    id: 1,
    type: "🎨 Portrait Magic",
    title: "Your Style → Endless Possibilities",
    description: "Upload 10-20 photos and create unlimited portraits in your unique style",
    beforeText: "Upload your photos",
    afterResult: "Infinite personalized portraits",
    icon: <Image className="w-6 h-6" />,
    gradient: "from-purple-600 to-indigo-600",
    tool: "Custom LoRA",
    time: "5 min training",
    preview: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
  },
  {
    id: 2,
    type: "🎬 Creative Videos",
    title: "Clips → Cinematic Content",
    description: "Transform your video clips into professional-quality content",
    beforeText: "Upload video clips",
    afterResult: "Studio-quality video content",
    icon: <Video className="w-6 h-6" />,
    gradient: "from-red-600 to-pink-600",
    tool: "Veo 3",
    time: "2-5 min",
    preview: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
  },
  {
    id: 3,
    type: "🏢 Brand Assets",
    title: "Logo → Complete Brand Kit",
    description: "Generate consistent brand assets across all platforms",
    beforeText: "Upload brand elements",
    afterResult: "Complete visual identity",
    icon: <Palette className="w-6 h-6" />,
    gradient: "from-emerald-600 to-teal-600",
    tool: "SDXL + LoRA",
    time: "3 min setup",
    preview: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
  },
  {
    id: 4,
    type: "👤 Custom Avatars",
    title: "Photos → Digital Twin",
    description: "Create your digital avatar for any scenario",
    beforeText: "Upload selfies",
    afterResult: "Photorealistic avatar",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-yellow-600 to-orange-600",
    tool: "DreamShaper",
    time: "8 min training",
    preview: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
  },
  {
    id: 5,
    type: "🎭 Experimental Art",
    title: "Style → Artistic Vision",
    description: "Push creative boundaries with AI-powered art generation",
    beforeText: "Define artistic style",
    afterResult: "Unique artistic creations",
    icon: <Scissors className="w-6 h-6" />,
    gradient: "from-cyan-600 to-blue-600",
    tool: "Multiple Models",
    time: "Instant",
    preview: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
  }
];

export default function SeeItInAction() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextDemo = () => {
    setActiveDemo((prev) => (prev + 1) % demos.length);
  };

  const prevDemo = () => {
    setActiveDemo((prev) => (prev - 1 + demos.length) % demos.length);
  };

  const currentDemo = demos[activeDemo];

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-black via-zinc-900 to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-500/7 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
            <span className="text-purple-300 font-bold text-sm sm:text-base">What You Can Create</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 sm:mb-6">
            See It in
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Real outputs from real creators using OpenModel Studio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-6 sm:mb-10">
          {/* Left side - Demo showcase */}
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`bg-gradient-to-r ${currentDemo.gradient} p-2 rounded-xl shadow-lg`}>
                    {currentDemo.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">{currentDemo.title}</h3>
                    <p className="text-white/70 text-xs sm:text-sm">{currentDemo.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-xs">{currentDemo.time}</div>
                  <div className="text-white/60 text-xs">{currentDemo.tool}</div>
                </div>
              </div>

              <p className="text-white/90 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                {currentDemo.description}
              </p>

              {/* Before/After showcase */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-2 sm:p-3 border border-white/10">
                  <div className="text-red-400 font-bold text-xs mb-1">INPUT:</div>
                  <p className="text-white/90 italic text-xs sm:text-sm">"{currentDemo.beforeText}"</p>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
                </div>
                
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-2 sm:p-3 border border-white/10">
                  <div className="text-emerald-400 font-bold text-xs mb-1">OUTPUT:</div>
                  <p className="text-white/90 font-semibold text-xs sm:text-sm">{currentDemo.afterResult}</p>
                </div>
              </div>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 flex items-center justify-center space-x-2"
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="text-sm">{isPlaying ? 'Playing Demo...' : 'Watch Demo'}</span>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button 
                onClick={prevDemo}
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-white/20 text-white p-2 rounded-xl hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex space-x-1">
                {demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDemo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeDemo 
                        ? 'bg-yellow-400 scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextDemo}
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-white/20 text-white p-2 rounded-xl hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right side - Visual preview */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={currentDemo.preview}
                alt={currentDemo.title}
                className="w-full h-52 sm:h-64 object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-white/30 rounded-full p-3 sm:p-4 hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 hover:scale-110"
                >
                  <Play className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </button>
              </div>
              
              {/* Bottom info */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                <div className="bg-gradient-to-r from-gray-900/80 to-black/90 backdrop-blur-xl rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs sm:text-sm">{currentDemo.type}</span>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-xs">{currentDemo.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-2 shadow-2xl animate-bounce">
              <span className="text-white font-bold text-xs">50k+ users</span>
            </div>
            
            <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 bg-gradient-to-r from-purple-600 to-pink-700 rounded-xl p-2 shadow-2xl animate-bounce delay-1000">
              <span className="text-white font-bold text-xs">1M+ models</span>
            </div>
          </div>
        </div>

        {/* Quick demo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(index)}
              className={`group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border rounded-xl p-2 sm:p-3 transition-all duration-300 hover:scale-105 ${
                index === activeDemo 
                  ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20' 
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <div className={`bg-gradient-to-r ${demo.gradient} p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {demo.icon}
              </div>
              <h4 className="text-white font-bold text-xs mb-1">{demo.title}</h4>
              <p className="text-white/70 text-xs">{demo.tool}</p>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4">
            Ready to Create Your Own AI Model?
          </h3>
          <p className="text-base sm:text-lg text-white/80 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Join thousands of creators bringing their imagination to life with personalized AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
              Start with Prebuilt
            </button>
            <button className="border-2 border-white/20 text-white font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
              Upload Your Style
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}