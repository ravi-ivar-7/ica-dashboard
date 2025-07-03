import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, ChevronDown, Menu, X, Home, BookOpen, Settings, Gift, Video, Brain, Target, Mail, Scissors, Palette, ArrowRight, Star, Users, Clock, User, HelpCircle, Phone, LogOut, Image, Music, Bug } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBugReport } from '@/contexts/BugReportContext';

const imageModels = [
  {
    icon: <Image className="w-6 h-6" />,
    title: "SDXL",
    description: "High-quality image generation",
    emoji: "🎨",
    gradient: "from-purple-600 to-indigo-600",
    users: "2.4k",
    time: "Fast"
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "DreamShaper",
    description: "Artistic style generation",
    emoji: "✨",
    gradient: "from-pink-600 to-purple-600",
    users: "1.8k",
    time: "Medium"
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Realistic Vision",
    description: "Photorealistic outputs",
    emoji: "📸",
    gradient: "from-blue-600 to-cyan-600",
    users: "3.1k",
    time: "Fast"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Anime Diffusion",
    description: "Anime and manga styles",
    emoji: "🎭",
    gradient: "from-orange-600 to-red-600",
    users: "967",
    time: "Fast"
  }
];

const videoModels = [
  {
    icon: <Video className="w-6 h-6" />,
    title: "Veo 3",
    description: "Next-gen video generation",
    emoji: "🎬",
    gradient: "from-red-600 to-pink-600",
    users: "1.5k",
    time: "2-5 min"
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: "Kling",
    description: "High-quality video creation",
    emoji: "🎞️",
    gradient: "from-emerald-600 to-teal-600",
    users: "847",
    time: "3-8 min"
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Runway Gen-3",
    description: "Creative video synthesis",
    emoji: "🚀",
    gradient: "from-violet-600 to-purple-600",
    users: "1.2k",
    time: "1-3 min"
  }
];

const audioModels = [
  {
    icon: <Music className="w-6 h-6" />,
    title: "Bark",
    description: "Text-to-speech generation",
    emoji: "🎵",
    gradient: "from-yellow-600 to-orange-600",
    users: "892",
    time: "30s"
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AudioCraft",
    description: "Music and audio creation",
    emoji: "🎼",
    gradient: "from-cyan-600 to-blue-600",
    users: "654",
    time: "1-2 min"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "MusicGen",
    description: "AI music composition",
    emoji: "🎹",
    gradient: "from-indigo-600 to-purple-600",
    users: "743",
    time: "45s"
  }
];

const learnItems = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Getting Started",
    description: "Quick start guide",
    gradient: "from-emerald-600 to-teal-600",
    path: "/learn/getting-started"
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "Tutorials",
    description: "Step-by-step videos",
    gradient: "from-blue-600 to-cyan-600",
    path: "/learn/tutorials"
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "LoRA Guide",
    description: "Advanced techniques",
    gradient: "from-purple-600 to-pink-600",
    path: "/learn/lora"
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: "Documentation",
    description: "Complete reference",
    gradient: "from-orange-600 to-red-600",
    path: "/learn/docs"
  }
];

const mobileMenuItems = [
  {
    icon: <Home className="w-5 h-5" />,
    title: "Dashboard",
    path: "/dashboard",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    icon: <User className="w-5 h-5" />,
    title: "Profile",
    path: "/profile",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Settings",
    path: "/settings",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Learn",
    path: "/learn",
    gradient: "from-violet-600 to-purple-600"
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: "Support",
    path: "/support",
    gradient: "from-orange-600 to-red-600"
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Contact",
    path: "/contact",
    gradient: "from-pink-600 to-purple-600"
  }
];

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const { openBugReport } = useBugReport();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isImageModelsOpen, setIsImageModelsOpen] = useState(false);
  const [isVideoModelsOpen, setIsVideoModelsOpen] = useState(false);
  const [isAudioModelsOpen, setIsAudioModelsOpen] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Mobile dropdown states
  const [mobileImageDropdown, setMobileImageDropdown] = useState(false);
  const [mobileVideoDropdown, setMobileVideoDropdown] = useState(false);
  const [mobileAudioDropdown, setMobileAudioDropdown] = useState(false);
  const [mobileLearnDropdown, setMobileLearnDropdown] = useState(false);

  // Track scroll for enhanced glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path.startsWith('/image-models')) setActiveTab('image-models');
    else if (path.startsWith('/video-models')) setActiveTab('video-models');
    else if (path.startsWith('/audio-models')) setActiveTab('audio-models');
    else if (path.startsWith('/learn')) setActiveTab('learn');
    else setActiveTab('menu');
  }, [location.pathname]);

  // Body scroll lock when dropdown is open
  useEffect(() => {
    if (isImageModelsOpen || isVideoModelsOpen || isAudioModelsOpen || isLearnOpen || isUserMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isImageModelsOpen, isVideoModelsOpen, isAudioModelsOpen, isLearnOpen, isUserMenuOpen]);

  // Close dropdown on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModelsOpen(false);
        setIsVideoModelsOpen(false);
        setIsAudioModelsOpen(false);
        setIsLearnOpen(false);
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setMobileImageDropdown(false);
        setMobileVideoDropdown(false);
        setMobileAudioDropdown(false);
        setMobileLearnDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleBugReport = () => {
    openBugReport({
      page: location.pathname,
      action: 'Bug report opened from navbar',
      additionalInfo: 'User accessed bug report from navigation menu'
    });
    setIsMobileMenuOpen(false);
  };

  const renderModelDropdown = (models: any[], isOpen: boolean, title: string) => (
    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ease-in-out ${
      isOpen 
        ? 'opacity-100 visible scale-100 translate-y-0' 
        : 'opacity-0 invisible scale-95 translate-y-2'
    }`}>
      <div className="bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 p-4 w-[350px]">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-orange-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full px-3 py-1 mb-2">
            <Zap className="w-3 h-3 text-orange-400" />
            <span className="text-orange-300 font-bold text-xs">Available Models</span>
          </div>
          <h3 className="text-lg font-black text-white mb-1 tracking-tight">{title}</h3>
          <p className="text-white/70 font-medium text-sm">Choose from our curated collection</p>
        </div>

        {/* Vertical Stack with Scroll */}
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mb-3">
          {models.map((model, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/30 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center space-x-3">
                <div className={`bg-gradient-to-r ${model.gradient} p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-lg">{model.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm mb-0.5 tracking-tight">{model.title}</h4>
                  <p className="text-white/70 text-xs mb-1 line-clamp-2">{model.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-white/60">
                      <Users className="w-3 h-3" />
                      <span className="font-medium">{model.users}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-400">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{model.time}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/20 pt-2">
          <Link
            to="/models"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto w-fit text-sm"
          >
            <span>Explore All Models</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderMobileDropdown = (models: any[], isOpen: boolean, title: string, onClose: () => void) => (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl m-2 p-3">
        <div className="text-center mb-3">
          <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
          <p className="text-white/60 text-xs">Tap to explore models</p>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {models.map((model, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className={`bg-gradient-to-r ${model.gradient} p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-base">{model.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-white font-bold text-sm truncate">{model.title}</h5>
                  <p className="text-white/70 text-xs line-clamp-1">{model.description}</p>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-white/60">{model.users} users</span>
                    <span className="text-emerald-400">{model.time}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-white/10">
          <Link
            to="/models"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-3 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 justify-center text-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className={`hidden lg:block sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/50' 
          : 'bg-gradient-to-b from-black via-zinc-900 to-gray-900 backdrop-blur-xl border-b border-white/10 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-2.5 rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tight">OpenModel Studio</h1>
                <p className="text-white/60 text-xs font-medium">Personalized AI Creation</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-white/90 font-medium tracking-tight hover:text-purple-400 transition-all duration-300 border-b-2 border-transparent hover:border-purple-500/30 pb-1 text-sm"
              >
                Home
              </Link>
              
              {/* Image Models Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsImageModelsOpen(true)}
                onMouseLeave={() => setIsImageModelsOpen(false)}
              >
                <Link
                  to="/image-models"
                  className="flex items-center space-x-1 text-white/90 font-medium tracking-tight hover:text-pink-400 transition-all duration-300 border-b-2 border-transparent hover:border-pink-500/30 pb-1 text-sm"
                >
                  <span>Image Models</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    isImageModelsOpen ? 'rotate-180' : ''
                  }`} />
                </Link>
                {renderModelDropdown(imageModels, isImageModelsOpen, "Image Models")}
              </div>

              {/* Video Models Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsVideoModelsOpen(true)}
                onMouseLeave={() => setIsVideoModelsOpen(false)}
              >
                <Link
                  to="/video-models"
                  className="flex items-center space-x-1 text-white/90 font-medium tracking-tight hover:text-orange-400 transition-all duration-300 border-b-2 border-transparent hover:border-orange-500/30 pb-1 text-sm"
                >
                  <span>Video Models</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    isVideoModelsOpen ? 'rotate-180' : ''
                  }`} />
                </Link>
                {renderModelDropdown(videoModels, isVideoModelsOpen, "Video Models")}
              </div>

              {/* Audio Models Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsAudioModelsOpen(true)}
                onMouseLeave={() => setIsAudioModelsOpen(false)}
              >
                <Link
                  to="/audio-models"
                  className="flex items-center space-x-1 text-white/90 font-medium tracking-tight hover:text-cyan-400 transition-all duration-300 border-b-2 border-transparent hover:border-cyan-500/30 pb-1 text-sm"
                >
                  <span>Audio Models</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    isAudioModelsOpen ? 'rotate-180' : ''
                  }`} />
                </Link>
                {renderModelDropdown(audioModels, isAudioModelsOpen, "Audio Models")}
              </div>

              {/* Learn Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsLearnOpen(true)}
                onMouseLeave={() => setIsLearnOpen(false)}
              >
                <Link
                  to="/learn"
                  className="flex items-center space-x-1 text-white/90 font-medium tracking-tight hover:text-purple-400 transition-all duration-300 border-b-2 border-transparent hover:border-purple-500/30 pb-1 text-sm"
                >
                  <span>Learn</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    isLearnOpen ? 'rotate-180' : ''
                  }`} />
                </Link>

                {/* Learn Dropdown */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ease-in-out ${
                  isLearnOpen 
                    ? 'opacity-100 visible scale-100 translate-y-0' 
                    : 'opacity-0 invisible scale-95 translate-y-2'
                }`}>
                  <div className="bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 p-4 w-[350px]">
                    {/* Header */}
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-orange-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full px-3 py-1 mb-2">
                        <BookOpen className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-300 font-bold text-xs">Learn & Master</span>
                      </div>
                      <h3 className="text-lg font-black text-white mb-1 tracking-tight">Learning Resources</h3>
                      <p className="text-white/70 font-medium text-sm">Master AI model creation</p>
                    </div>

                    {/* Vertical Stack with Scroll */}
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mb-3">
                      {learnItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/30 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 block"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`bg-gradient-to-r ${item.gradient} p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-sm tracking-tight">{item.title}</h4>
                              <p className="text-white/70 text-xs font-medium">{item.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center border-t border-white/20 pt-2">
                      <Link
                        to="/learn"
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto w-fit text-sm"
                      >
                        <span>View All Resources</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu or CTA Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 hover:bg-white/20 transition-all duration-300"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-white font-semibold text-sm">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl shadow-black/50 p-3 z-50">
                    <div className="space-y-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Home className="w-4 h-4" />
                        <span className="text-sm">Dashboard</span>
                      </Link>
                      <Link
                        to="dashboard/settings"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleBugReport();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white w-full text-left"
                      >
                        <Bug className="w-4 h-4" />
                        <span className="text-sm">Send Feedback</span>
                      </button>
                      <hr className="border-white/20 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-600/20 transition-colors text-red-400 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => openAuthModal('login')}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-5 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg tracking-tight text-sm"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVBAR */}
      <nav className="lg:hidden fixed bottom-0 w-full h-16 z-[100] bg-black/80 backdrop-blur-2xl border-t border-white/20 shadow-2xl shadow-black/50">
        <div className="flex justify-between items-center px-4 h-full">
          <Link
            to="/"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
              activeTab === 'home' 
                ? 'text-purple-400 border-t-2 border-purple-500/40 pt-1' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium tracking-tight">Home</span>
          </Link>

          <button
            onClick={() => {
              setActiveTab('image-models');
              setMobileImageDropdown(!mobileImageDropdown);
              setMobileVideoDropdown(false);
              setMobileAudioDropdown(false);
              setMobileLearnDropdown(false);
            }}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
              activeTab === 'image-models' || mobileImageDropdown
                ? 'text-purple-400 border-t-2 border-purple-500/40 pt-1' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Image className="w-5 h-5" />
            <span className="text-xs font-medium tracking-tight">Images</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('video-models');
              setMobileVideoDropdown(!mobileVideoDropdown);
              setMobileImageDropdown(false);
              setMobileAudioDropdown(false);
              setMobileLearnDropdown(false);
            }}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
              activeTab === 'video-models' || mobileVideoDropdown
                ? 'text-purple-400 border-t-2 border-purple-500/40 pt-1' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-xs font-medium tracking-tight">Videos</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('audio-models');
              setMobileAudioDropdown(!mobileAudioDropdown);
              setMobileImageDropdown(false);
              setMobileVideoDropdown(false);
              setMobileLearnDropdown(false);
            }}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
              activeTab === 'audio-models' || mobileAudioDropdown
                ? 'text-purple-400 border-t-2 border-purple-500/40 pt-1' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Music className="w-5 h-5" />
            <span className="text-xs font-medium tracking-tight">Audio</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
              activeTab === 'menu' 
                ? 'text-purple-400 border-t-2 border-purple-500/40 pt-1' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium tracking-tight">Menu</span>
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWNS - Above bottom navbar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-[90]">
        {/* Image Models Dropdown */}
        {renderMobileDropdown(imageModels, mobileImageDropdown, "Image Models", () => setMobileImageDropdown(false))}
        
        {/* Video Models Dropdown */}
        {renderMobileDropdown(videoModels, mobileVideoDropdown, "Video Models", () => setMobileVideoDropdown(false))}
        
        {/* Audio Models Dropdown */}
        {renderMobileDropdown(audioModels, mobileAudioDropdown, "Audio Models", () => setMobileAudioDropdown(false))}
        
        {/* Learn Dropdown */}
        <div className={`overflow-hidden transition-all duration-300 ${mobileLearnDropdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl m-2 p-3">
            <div className="text-center mb-3">
              <h4 className="text-white font-bold text-sm mb-1">Learning Resources</h4>
              <p className="text-white/60 text-xs">Master AI model creation</p>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {learnItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setMobileLearnDropdown(false)}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-all duration-300 cursor-pointer block"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`bg-gradient-to-r ${item.gradient} p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white font-bold text-sm truncate">{item.title}</h5>
                      <p className="text-white/70 text-xs line-clamp-1">{item.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-3 pt-2 border-t border-white/10">
              <Link
                to="/learn"
                onClick={() => setMobileLearnDropdown(false)}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-3 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 justify-center text-sm"
              >
                <span>View All Resources</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[150] flex flex-col">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel - Fixed height with proper spacing for navbar */}
          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border-t border-white/20 rounded-t-2xl shadow-2xl shadow-black/50 w-full mt-auto mb-16 max-h-[calc(100vh-8rem)] flex flex-col">
            {/* Background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header - Fixed */}
            <div className="relative z-10 p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-2 rounded-lg shadow-lg">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Menu</h2>
                    <p className="text-white/60 text-xs">Navigate OpenModel Studio</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white/10 backdrop-blur-xl p-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="p-4">
                {/* Menu Items */}
                <div className="space-y-3 mb-6">
                  {mobileMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
                    >
                      <div className={`bg-gradient-to-r ${item.gradient} p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-base">{item.title}</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                    </Link>
                  ))}

                  {/* Bug Report Button */}
                  <button
                    onClick={handleBugReport}
                    className="group flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 w-full"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Bug className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-base">Send Feedback</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </button>
                </div>

                {/* User Section */}
                {user ? (
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                      />
                      <div>
                        <h3 className="text-white font-bold">{user.name}</h3>
                        <p className="text-white/60 text-xs">{user.plan.toUpperCase()} Plan</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-600/20 text-red-400 font-semibold px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors flex items-center space-x-2 justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-white/20 pt-4">
                    <button 
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-5 py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CTA (Mobile) */}
      {!user && (
        <div className="lg:hidden fixed bottom-20 right-4 z-[80]">
          <button 
            onClick={() => openAuthModal('login')}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse backdrop-blur-xl border border-white/20"
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}