import React from 'react';
import { X, CheckCircle, Zap, Users, TrendingUp } from 'lucide-react';

const problems = [
  "Drowning in 47 different AI tools",
  "Tried ChatGPT once, never touched it again", 
  "Automations feel like rocket science",
  "Just want to create, not become a programmer"
];

const solutions = [
  "Learn the 5 tools that actually matter",
  "Get workflows that work out of the box",
  "No-code automations anyone can set up",
  "Focus on creating while AI handles the rest"
];

export default function ProblemSolution() {
  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-zinc-800 via-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/8 to-orange-900/5"></div>
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-500/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-1/3 w-64 h-64 bg-violet-500/7 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <span className="text-red-400 font-bold text-sm sm:text-base">The Real Talk</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            Most Creators Are
            <span className="block bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Doing AI Wrong
            </span>
          </h2>
          <p className="text-lg sm:text-2xl text-white/70 max-w-4xl mx-auto">
            And it's not your fault. The AI world is confusing AF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 sm:mb-20">
          {/* Problems */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-br from-black/60 to-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-8">
              <h3 className="text-3xl sm:text-4xl font-black text-red-400 mb-6 sm:mb-8 flex items-center">
                <X className="w-8 sm:w-10 h-8 sm:h-10 mr-3 sm:mr-4" />
                The Struggle
              </h3>
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 group mb-4 sm:mb-6 last:mb-0">
                  <div className="bg-red-600/20 p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0">
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" />
                  </div>
                  <p className="text-white/80 text-base sm:text-xl group-hover:text-white transition-colors leading-relaxed">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-br from-black/60 to-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-8">
              <h3 className="text-3xl sm:text-4xl font-black text-emerald-400 mb-6 sm:mb-8 flex items-center">
                <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 mr-3 sm:mr-4" />
                The Fix
              </h3>
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 group mb-4 sm:mb-6 last:mb-0">
                  <div className="bg-emerald-600/20 p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
                  </div>
                  <p className="text-white/80 text-base sm:text-xl group-hover:text-white transition-colors leading-relaxed">
                    {solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-12">
          <div className="flex items-center justify-center space-x-4 mb-6 sm:mb-8">
            <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-yellow-400" />
            <h3 className="text-3xl sm:text-5xl font-black text-white">
              That's Why We Built This
            </h3>
            <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-yellow-400" />
          </div>
          
          <p className="text-lg sm:text-2xl text-white/70 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            A hands-on platform where creators learn the right tools, use proven workflows, 
            and get help when they need it. <span className="text-yellow-400 font-black">No code. No overwhelm. Just results.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 text-white/60">
              <Users className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
              <span className="text-base sm:text-lg font-semibold">12,847 creators</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
              <span className="text-base sm:text-lg font-semibold">$2.4M+ generated</span>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
            Show Me How It Works
          </button>
        </div>
      </div>
    </section>
  );
}