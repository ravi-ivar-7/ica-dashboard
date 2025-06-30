import React from 'react';
import { Brain, Zap, Award, Shield } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Smart Learning",
    description: "AI that learns your unique style",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fast Training",
    description: "Models ready in minutes, not hours",
    gradient: "from-yellow-600 to-orange-600"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Studio Quality",
    description: "Professional-grade outputs",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Own Your AI",
    description: "Your models, your data, your control",
    gradient: "from-blue-600 to-cyan-600"
  }
];

export default function WhatIsOpenModel() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-zinc-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl border border-cyan-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-sm sm:text-base">What Is OpenModel Studio?</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              AI Studio
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              OpenModel Studio is a creative platform that lets you build your own AI model from just a few photos or clips — no technical skill needed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 text-center hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className={`bg-gradient-to-r ${feature.gradient} p-3 sm:p-4 rounded-2xl inline-block mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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