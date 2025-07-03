import React from 'react';
import { Play, Sparkles, ArrowRight, Zap, Image, Video } from 'lucide-react';
import { useConsent } from '@/contexts/ConsentContext';
import { toast } from '@/contexts/ToastContext';

export default function Hero() {
  const { openConsentModal } = useConsent();

  const handleTrainModel = () => {
    openConsentModal(() => {
      toast.success('Starting model training...', {
        subtext: 'Upload your photos to begin creating your personalized AI model',
        duration: 6000
      });
      // Navigate to training interface
    });
  };

  const handleTryPrebuilt = () => {
    openConsentModal(() => {
      toast.info('Loading prebuilt models...', {
        subtext: 'Explore our collection of ready-to-use AI models',
        duration: 5000
      });
      // Navigate to prebuilt models
    });
  };

  return (
    <section className="relative min-h-[85vh] bg-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-orange-900/30"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex items-center min-h-[85vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          {/* Left side - Content */}
          <div className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90 text-sm">Introducing OpenModel Studio</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Personalized AI
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Creation Platform
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
              Create stunning, personalized images and videos from just 10–20 of your own photos or clips — or use professionally crafted prebuilt models.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button 
                onClick={handleTrainModel}
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 text-base sm:text-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Train Your Model</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button 
                onClick={handleTryPrebuilt}
                className="border-2 border-white/30 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-base sm:text-lg"
              >
                Try a Prebuilt One
              </button>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative mt-6 lg:mt-0">
            <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-5 sm:p-6 shadow-2xl">
              {/* Mock interface */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/70 text-sm ml-3">OpenModel Studio</span>
                </div>
                
                <div className="bg-black/50 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm sm:text-base">Your AI Models</span>
                    <div className="bg-green-500/30 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                      3 ready
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { type: "Portrait Style", status: "Training", color: "bg-yellow-500", icon: <Image className="w-4 h-4" /> },
                      { type: "Video Avatar", status: "Ready", color: "bg-green-500", icon: <Video className="w-4 h-4" /> },
                      { type: "Brand Assets", status: "Generating", color: "bg-blue-500", icon: <Sparkles className="w-4 h-4" /> },
                      { type: "Custom Style", status: "Complete", color: "bg-purple-500", icon: <Zap className="w-4 h-4" /> }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-white/10 rounded-lg p-2 sm:p-3 hover:bg-white/15 transition-all duration-300">
                        <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                        <div className="text-white/70 text-sm">{item.icon}</div>
                        <span className="text-white/90 flex-1 text-sm font-medium">{item.type}</span>
                        <span className="text-white/70 text-xs bg-black/30 px-2 py-1 rounded-md">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-2 shadow-2xl animate-bounce">
              <span className="text-white font-bold text-xs">Studio Quality</span>
            </div>
            
            <div className="absolute -bottom-3 -left-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-2 shadow-2xl animate-bounce delay-1000">
              <span className="text-white font-bold text-xs">Fast Training</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}