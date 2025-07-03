import React from 'react';
import { Users, Palette, Building, Heart } from 'lucide-react';

const audiences = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Creators & Influencers",
    description: "Generate endless content variations while maintaining your unique style and brand identity",
    gradient: "from-purple-600 to-pink-600",
    features: ["Personal branding", "Content scaling", "Audience engagement"]
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Designers & Artists",
    description: "Explore new creative possibilities and accelerate your artistic workflow with AI assistance",
    gradient: "from-blue-600 to-cyan-600",
    features: ["Creative exploration", "Rapid prototyping", "Style experimentation"]
  },
  {
    icon: <Building className="w-8 h-8" />,
    title: "Studios & Teams",
    description: "Scale your creative output while maintaining consistent quality and brand standards",
    gradient: "from-emerald-600 to-teal-600",
    features: ["Team collaboration", "Brand consistency", "Production scaling"]
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Anyone",
    description: "No coding skills required. If you can upload photos, you can create with AI",
    gradient: "from-orange-600 to-red-600",
    features: ["No code needed", "User-friendly", "Quick results"]
  }
];

export default function WhoItsFor() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-zinc-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-600/30 to-purple-600/30 backdrop-blur-xl border border-pink-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Users className="w-4 sm:w-5 h-4 sm:h-5 text-pink-400" />
            <span className="text-pink-300 font-bold text-sm sm:text-base">Who It's For</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Built for
            <span className="block bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto">
            Whether you're a creator, artist, or complete beginner - OpenModel Studio is designed for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {audiences.map((audience, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className={`bg-gradient-to-r ${audience.gradient} p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  {audience.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-black text-white mb-2">{audience.title}</h3>
                  <p className="text-white/70 leading-relaxed mb-4 text-sm sm:text-base">{audience.description}</p>
                  
                  <div className="space-y-1">
                    {audience.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                        <span className="text-white/80 text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}