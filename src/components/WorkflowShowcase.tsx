import React from 'react';
import { Video, Brain, Zap, Mail, Target, ArrowRight, Play, Users, Clock, Star } from 'lucide-react';

const workflows = [
  {
    title: "Podcast → Viral Clips",
    tools: ["Descript", "ChatGPT", "OpusClip"],
    outcome: "1 episode = 20+ clips",
    icon: <Video className="w-8 h-8" />,
    gradient: "from-red-600 to-pink-700",
    demo: "Watch Demo",
    creator: "Sarah K.",
    result: "+2.4M views"
  },
  {
    title: "Notion Content Engine",
    tools: ["Notion", "GPT-4", "Zapier"],
    outcome: "30 days of content in 1 hour",
    icon: <Brain className="w-8 h-8" />,
    gradient: "from-purple-600 to-indigo-700",
    demo: "See Template",
    creator: "Mike R.",
    result: "20h/week saved"
  },
  {
    title: "Auto Caption Generator",
    tools: ["GPT-4", "Canva API", "Buffer"],
    outcome: "Captions that convert",
    icon: <Zap className="w-8 h-8" />,
    gradient: "from-yellow-500 to-amber-600",
    demo: "Try Now",
    creator: "Emma D.",
    result: "+340% engagement"
  },
  {
    title: "Newsletter Automation",
    tools: ["Beehiiv", "Claude", "Zapier"],
    outcome: "Notes → Newsletter in 5 mins",
    icon: <Mail className="w-8 h-8" />,
    gradient: "from-cyan-600 to-blue-700",
    demo: "Get Setup",
    creator: "Alex T.",
    result: "12k subscribers"
  },
  {
    title: "Content Calendar AI",
    tools: ["Airtable", "Notion", "GPT-4"],
    outcome: "Never run out of ideas",
    icon: <Target className="w-8 h-8" />,
    gradient: "from-emerald-600 to-teal-700",
    demo: "Download",
    creator: "Jess M.",
    result: "90 days planned"
  }
];

export default function WorkflowShowcase() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-600/12 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500/30 to-amber-600/30 backdrop-blur-xl border border-yellow-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
            <span className="text-yellow-300 font-bold text-sm sm:text-base">Creator Workflows That Actually Work</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Stop Copying.
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Start Creating.
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            These aren't theory. Real creators are using these exact systems to go viral, save time, and make bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-10">
          {workflows.map((workflow, index) => (
            <div key={index} className="group relative">
              <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 hover:bg-gradient-to-br hover:from-gray-800/90 hover:to-black/95 transition-all duration-500 hover:scale-105 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-600/20">
                
                {/* Creator badge */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`bg-gradient-to-r ${workflow.gradient} p-2 sm:p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {workflow.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-xs">by {workflow.creator}</div>
                    <div className="text-emerald-400 font-bold text-xs">{workflow.result}</div>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3">{workflow.title}</h3>
                
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                  {workflow.tools.map((tool, toolIndex) => (
                    <span key={toolIndex} className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 text-white/90 px-2 py-1 rounded-full text-xs font-medium border border-white/20 backdrop-blur-sm">
                      {tool}
                    </span>
                  ))}
                </div>
                
                <p className="text-yellow-400 font-bold text-sm sm:text-base mb-3 sm:mb-4">{workflow.outcome}</p>
                
                <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-white font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 group/btn border border-purple-500/40 hover:border-purple-400/60 w-full justify-center backdrop-blur-sm">
                  <Play className="w-4 h-4" />
                  <span className="text-sm">{workflow.demo}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-8">
          <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-black text-white">Join 12,847 Creators</h3>
          </div>
          <p className="text-base sm:text-lg text-white/70 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Who stopped struggling with AI and started making money with it
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
            Get All 5 Workflows Setup
          </button>
        </div>
      </div>
    </section>
  );
}