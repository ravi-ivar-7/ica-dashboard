import React from 'react';
import { Zap, ArrowRight, Clock, Download, Shuffle } from 'lucide-react';

const loraFeatures = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fast Training",
    description: "Train models in minutes, not hours"
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Small, Portable Models",
    description: "Lightweight files you can download and share"
  },
  {
    icon: <Shuffle className="w-6 h-6" />,
    title: "Mix and Reuse Styles",
    description: "Combine different models for unique results"
  }
];

export default function LoRAArchitecture() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-xl border border-blue-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
              <span className="text-blue-300 font-bold text-sm sm:text-base">Advanced Technology</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Powered by
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
                LoRA Architecture
              </span>
            </h2>
            
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Our advanced LoRA (Low-Rank Adaptation) technology enables fast, efficient model training without compromising quality. Get professional results with minimal computational resources.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {loraFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2">
              <span>Learn More About LoRA</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right side - Visual/Infographic */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl">
              {/* Mock infographic */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-black text-white mb-3">LoRA Training Process</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Upload Photos", time: "30 seconds", color: "from-purple-500 to-pink-500" },
                    { step: "2", title: "AI Analysis", time: "2 minutes", color: "from-blue-500 to-cyan-500" },
                    { step: "3", title: "Model Training", time: "5 minutes", color: "from-emerald-500 to-teal-500" },
                    { step: "4", title: "Ready to Use", time: "Instant", color: "from-yellow-500 to-orange-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-r ${item.color} w-10 h-10 rounded-full flex items-center justify-center font-black text-white`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-semibold text-sm">{item.title}</span>
                          <span className="text-white/60 text-xs">{item.time}</span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2 mt-1">
                          <div 
                            className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000`}
                            style={{ width: index < 3 ? '100%' : '75%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-2 sm:p-3 shadow-2xl animate-bounce">
              <span className="text-white font-bold text-xs">10x Faster</span>
            </div>
            
            <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-2 sm:p-3 shadow-2xl animate-bounce delay-1000">
              <span className="text-white font-bold text-xs">90% Smaller</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}