import React from 'react';
import { Rocket, Gift, ArrowRight, Zap, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-zinc-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-20 right-1/3 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 text-center">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500/30 to-amber-600/30 backdrop-blur-xl border border-yellow-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-5 sm:mb-6">
          <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
          <span className="text-yellow-300 font-bold text-sm sm:text-base">Ready to Start?</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
          Ready to Create Your
          <span className="block text-yellow-400 drop-shadow-2xl">
            Own AI Model?
          </span>
        </h2>
        
        <p className="text-lg sm:text-2xl lg:text-3xl text-white/90 mb-5 sm:mb-6 max-w-4xl mx-auto font-medium">
          Join thousands of creators bringing their imagination to life with personalized AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 text-white/80">
            <Users className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold">50,000+ creators</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold">1M+ models trained</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <Zap className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold">Studio quality</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
          <button className="group bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 sm:w-7 h-6 sm:h-7" />
              <span>Start with Prebuilt</span>
              <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button className="group bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-2 border-white/40 text-white font-black px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 hover:border-white/60">
            <div className="flex items-center space-x-3">
              <Rocket className="w-6 sm:w-7 h-6 sm:h-7" />
              <span>Upload Your Style</span>
            </div>
          </button>
        </div>

        <div className="bg-gradient-to-r from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto">
          <p className="text-white/80 text-base sm:text-lg mb-2">
            <span className="font-black text-yellow-400">No technical skills required.</span> Just upload your photos and start creating.
          </p>
          <p className="text-white/60 text-sm sm:text-base">
            Join the community that's revolutionizing AI-powered content creation.
          </p>
        </div>
      </div>
    </section>
  );
}