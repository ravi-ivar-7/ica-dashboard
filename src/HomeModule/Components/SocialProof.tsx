import React from 'react';
import { Star, Quote, TrendingUp, Users, Heart, MessageCircle, Play } from 'lucide-react';

const testimonials = [
  {
    quote: "OpenModel Studio changed how I create content. The quality is incredible!",
    author: "Sarah Chen",
    role: "Content Creator",
    followers: "127K",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    platform: "YouTube",
    result: "+340% engagement"
  },
  {
    quote: "Training my own AI model was so simple. Now I can create unlimited variations of my style.",
    author: "Mike Rodriguez", 
    role: "Digital Artist",
    followers: "89K",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    platform: "Instagram",
    result: "1M+ models trained"
  },
  {
    quote: "The LoRA technology is game-changing. Fast training, amazing results.",
    author: "Emma Davis",
    role: "Brand Designer",
    followers: "45K", 
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    platform: "LinkedIn",
    result: "Studio quality"
  }
];

const metrics = [
  { number: "50,000+", label: "Creators", icon: <Users className="w-6 h-6" /> },
  { number: "1M+", label: "Models Trained", icon: <TrendingUp className="w-6 h-6" /> },
  { number: "5M+", label: "Images Generated", icon: <Star className="w-6 h-6" /> }
];

export default function SocialProof() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/8 via-pink-900/6 to-orange-900/4"></div>
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-500/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-violet-500/7 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-pink-400" />
            <span className="text-pink-300 font-bold text-sm sm:text-base">Social Proof</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Trusted by
            <span className="block bg-gradient-to-r from-pink-400 via-purple-500 to-violet-600 bg-clip-text text-transparent">
              Creators
            </span>
          </h2>
          
          {/* Metrics */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-2 text-white/60">
                <div className="text-purple-400">{metric.icon}</div>
                <span className="text-xl sm:text-2xl font-black text-white">{metric.number}</span>
                <span className="text-base sm:text-lg font-semibold">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-black/60 to-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 hover:bg-gradient-to-br hover:from-gray-800/70 hover:to-black/90 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-600/10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="bg-emerald-600/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-bold">
                  {testimonial.result}
                </div>
              </div>
              
              <Quote className="w-5 h-5 text-white/20 mb-2 sm:mb-3" />
              
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 italic font-medium">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <p className="text-white font-bold text-sm">{testimonial.author}</p>
                    <p className="text-white/50 text-xs">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-bold text-xs sm:text-sm">{testimonial.followers}</p>
                  <p className="text-white/50 text-xs">{testimonial.platform}</p>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4 flex items-center space-x-3 pt-2 sm:pt-3 border-t border-white/10">
                <button className="flex items-center space-x-1 text-white/50 hover:text-red-400 transition-colors">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs">234</span>
                </button>
                <button className="flex items-center space-x-1 text-white/50 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-3 h-3" />
                  <span className="text-xs">67</span>
                </button>
                <button className="flex items-center space-x-1 text-white/50 hover:text-emerald-400 transition-colors">
                  <Play className="w-3 h-3" />
                  <span className="text-xs">Watch</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8">
          <h3 className="text-2xl font-black text-white mb-3 sm:mb-4">Join the Community</h3>
          <p className="text-base sm:text-lg text-white/70 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Become part of the fastest-growing AI creator community
          </p>
          <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-lg">
            Start Creating Today
          </button>
        </div>
      </div>
    </section>
  );
}