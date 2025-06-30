import React from 'react';
import { Upload, Zap, Settings, Palette, Download, Code } from 'lucide-react';

const features = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Upload-based Fine-tuning",
    description: "Train AI models with your own photos and videos",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Real-time Generation",
    description: "Create content instantly with lightning-fast processing",
    gradient: "from-yellow-600 to-orange-600"
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: "LoRA Support",
    description: "Advanced model architecture for superior results",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Studio-style UI",
    description: "Professional interface designed for creators",
    gradient: "from-pink-600 to-purple-600"
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "Downloadable Models",
    description: "Own and export your trained AI models",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "API (Coming Soon)",
    description: "Integrate with your existing workflows",
    gradient: "from-orange-600 to-red-600"
  }
];

export default function CoreFeatures() {
  return (
    <section className="py-6 sm:py-12 bg-gradient-to-b from-zinc-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-3 sm:mb-4">
            <Settings className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
            <span className="text-purple-300 font-bold text-sm sm:text-base">Core Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight">
            Powerful
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto">
            Everything you need to create, train, and deploy AI models without the complexity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-5 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-2xl inline-block mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}