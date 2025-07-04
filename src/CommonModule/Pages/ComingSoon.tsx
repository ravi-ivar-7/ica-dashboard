import React, { useState, useEffect } from 'react';
import { Rocket, Clock, Bell, Mail, ArrowRight, Sparkles, Zap, Star, Users } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer (example: 30 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-1/3 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 rounded-2xl shadow-2xl animate-bounce">
            <Rocket className="w-12 h-12 text-black" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white">OpenModel Studio</h1>
            <p className="text-white/60 text-lg">Next-Gen AI Platform</p>
          </div>
        </div>

        {/* Main heading */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-500/40 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-bold">Something Amazing is Coming</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6 leading-tight">
            Coming
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Soon
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12">
            We're crafting the future of AI-powered content creation. Get ready for an experience that will revolutionize how you create.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 hover:border-white/30 transition-all duration-300 hover:scale-105">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-white/60 font-semibold text-lg uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features preview */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-8">What's Coming</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast AI",
                description: "Generate content in seconds, not minutes",
                gradient: "from-yellow-600 to-orange-600"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Studio Quality",
                description: "Professional-grade outputs every time",
                gradient: "from-purple-600 to-pink-600"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Collaborative Tools",
                description: "Work together with your team seamlessly",
                gradient: "from-blue-600 to-cyan-600"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-center hover:border-white/30 transition-all duration-300 hover:scale-105">
                <div className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl inline-block mb-6 shadow-2xl`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email signup */}
        <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto">
          {!isSubscribed ? (
            <>
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Bell className="w-8 h-8 text-purple-400" />
                <h3 className="text-3xl sm:text-4xl font-black text-white">Get Notified</h3>
              </div>
              
              <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Be the first to know when we launch. Join thousands of creators waiting for the future of AI.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2 justify-center"
                >
                  <span>Notify Me</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              
              <p className="text-white/50 text-sm mt-6">
                Join 50,000+ creators already on the waitlist. No spam, unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white mb-4">You're In!</h3>
              <p className="text-lg text-white/70 mb-6">
                Thanks for joining the waitlist. We'll notify you as soon as we launch!
              </p>
              <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-2xl p-4">
                <p className="text-emerald-400 font-semibold">
                  🎉 Welcome to the future of AI content creation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Social proof */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/60">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold">50,000+ on waitlist</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Launching Q2 2025</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">Backed by top VCs</span>
          </div>
        </div>
      </div>
    </div>
  );
}