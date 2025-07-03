import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowLeft, Compass, Zap, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generate floating elements
  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setFloatingElements(elements);
  }, []);

  const popularPages = [
    { name: 'Image Models', path: '/image-models', icon: '🎨' },
    { name: 'Video Models', path: '/video-models', icon: '🎬' },
    { name: 'Audio Models', path: '/audio-models', icon: '🎵' },
    { name: 'Learn', path: '/learn', icon: '📚' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Support', path: '/support', icon: '💬' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would perform a site search
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-3 h-3 bg-white/10 rounded-full animate-bounce"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <span className="text-[12rem] sm:text-[16rem] lg:text-[20rem] font-black text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-cyan-600 bg-clip-text leading-none animate-pulse">
              404
            </span>

            {/* Floating icons around 404 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/4 ">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full shadow-lg">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/4  ">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/3  ">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Page Not Found
          </h1>

          <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
            Oops! The page you're looking for seems to have wandered off into the digital void.
            Let's get you back on track.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pages, models, or features..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl pl-16 pr-6 py-6 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
          <Link
            to="/"
            className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-2 border-white/30 text-white font-black px-8 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 hover:border-white/50 flex items-center space-x-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Popular pages */}
        <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto">
          <h3 className="text-3xl font-black text-white mb-8">Popular Pages</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {popularPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
              >
                <div className="text-4xl mb-4">{page.icon}</div>
                <h4 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">
                  {page.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Help section */}
        <div className="my-8">
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Star className="w-8 h-8 text-indigo-400" />
              <h3 className="text-2xl font-black text-white">Still Lost?</h3>
            </div>

            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Our support team is here to help you find what you're looking for.
              We're available 24/7 to assist with any questions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 justify-center"
              >
                <span>Contact Support</span>
              </Link>

              <Link
                to="/learn"
                className="border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm flex items-center space-x-2 justify-center"
              >
                <span>Browse Help Center</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}