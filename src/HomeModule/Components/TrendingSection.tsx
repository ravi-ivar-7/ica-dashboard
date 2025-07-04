import React from 'react';
import { TrendingUp, Flame, Zap, Star, Clock, Eye, MessageCircle, Heart } from 'lucide-react';

const trends = [
  {
    type: "🎨 Visual AI",
    content: "Leonardo AI just dropped their new model - it's crushing Midjourney",
    badge: "🔥 HOT",
    badgeColor: "bg-gradient-to-r from-red-600 to-orange-600",
    time: "2h ago",
    engagement: "2.4k views",
    creator: "@aiartist"
  },
  {
    type: "🧰 New Workflow", 
    content: "ChatGPT + Gamma = Presentations that actually look good",
    badge: "🚀 VIRAL",
    badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    time: "5h ago",
    engagement: "847 saves",
    creator: "@designpro"
  },
  {
    type: "📈 Prompt Drop",
    content: "This 1-sentence prompt creates entire content calendars",
    badge: "💎 GOLD",
    badgeColor: "bg-gradient-to-r from-yellow-600 to-amber-600",
    time: "1d ago",
    engagement: "1.2k shares",
    creator: "@contentqueen"
  },
  {
    type: "🎥 Case Study",
    content: "How @creatorname gained 30h/month with AI repurposing",
    badge: "💰 WIN",
    badgeColor: "bg-gradient-to-r from-emerald-600 to-teal-600",
    time: "2d ago",
    engagement: "567 comments",
    creator: "@timesaver"
  },
  {
    type: "💡 Pro Tip",
    content: "Stop using GPT-4 for this. Claude 3.5 is 10x better",
    badge: "🧠 SMART",
    badgeColor: "bg-gradient-to-r from-blue-600 to-cyan-600",
    time: "3d ago",
    engagement: "934 likes",
    creator: "@aitips"
  },
  {
    type: "🚀 Tool Alert",
    content: "Veo3 is now available - video generation just got insane",
    badge: "⚡ NEW",
    badgeColor: "bg-gradient-to-r from-indigo-600 to-purple-600",
    time: "1w ago",
    engagement: "3.1k views",
    creator: "@videoai"
  }
];

export default function TrendingSection() {
  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-slate-900 via-gray-800 to-zinc-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-violet-600/30 to-purple-600/30 backdrop-blur-xl border border-violet-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-violet-400 animate-pulse" />
            <span className="text-violet-300 font-bold text-sm sm:text-base">What's Trending in Creator World</span>
            <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            The Creator
            <span className="block bg-gradient-to-r from-violet-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Feed
            </span>
          </h2>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto">
            Fresh AI tools, viral workflows, and creator wins. Updated daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {trends.map((trend, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 hover:bg-gradient-to-br hover:from-gray-800/90 hover:to-black/95 transition-all duration-300 hover:scale-105 cursor-pointer hover:border-white/30 hover:shadow-2xl hover:shadow-violet-600/20">
              
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold">{trend.type}</span>
                <div className={`${trend.badgeColor} text-white text-xs font-black px-2 sm:px-3 py-1 rounded-full shadow-lg`}>
                  {trend.badge}
                </div>
              </div>
              
              <p className="text-white font-bold text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 group-hover:text-white/90 transition-colors">
                {trend.content}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3 sm:space-x-4 text-white/60">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="text-xs sm:text-sm">{trend.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="text-xs sm:text-sm">{trend.engagement}</span>
                  </div>
                </div>
                <span className="text-violet-400 font-semibold text-xs sm:text-sm">{trend.creator}</span>
              </div>
              
              <div className="mt-3 sm:mt-4 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center space-x-1 text-white/60 hover:text-red-400 transition-colors">
                  <Heart className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="text-xs sm:text-sm">Like</span>
                </button>
                <button className="flex items-center space-x-1 text-white/60 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="text-xs sm:text-sm">Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-white/60 hover:text-emerald-400 transition-colors">
                  <Zap className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="text-xs sm:text-sm">Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 sm:mb-6">
            Never Miss the Next Big Thing
          </h3>
          <p className="text-lg sm:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Get these AI updates delivered to your inbox every Tuesday. Join 12,847 creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="your@email.com"
              className="flex-1 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-2 border-white/20 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-white/50 focus:outline-none focus:border-violet-400 text-base sm:text-lg backdrop-blur-sm"
            />
            <button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg shadow-lg">
              Join Feed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}