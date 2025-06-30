import React from 'react';
import { Image, Video, Download, Zap, Settings, Layers, Crop, RotateCcw, Camera } from 'lucide-react';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';

export default function VideoThumbnail() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Camera className="w-8 h-8 mr-3 text-red-400" />
              Thumbnail Generator
            </h1>
            <p className="text-lg text-white/70">
              Create eye-catching thumbnails from your videos
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button 
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
            
            <button 
              className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
            >
              <Zap className="w-5 h-5" />
              <span>Generate</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Generator Area */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tools Panel */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Tools</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Video className="w-5 h-5" />, name: 'From Video' },
                    { icon: <Image className="w-5 h-5" />, name: 'From Image' },
                    { icon: <Crop className="w-5 h-5" />, name: 'Crop' },
                    { icon: <Layers className="w-5 h-5" />, name: 'Layers' },
                    { icon: <Settings className="w-5 h-5" />, name: 'Effects' },
                    { icon: <Zap className="w-5 h-5" />, name: 'AI Enhance' }
                  ].map((tool, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title={tool.name}
                    >
                      <div className="text-white/80 hover:text-white transition-colors">
                        {tool.icon}
                      </div>
                      <span className="text-white/70 text-xs mt-1">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Templates</h3>
                <div className="space-y-2">
                  {['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Custom'].map((template, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        index === 0 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Preview Area */}
            <div className="flex-1 bg-white/5 rounded-xl flex flex-col min-h-[500px]">
              {/* Thumbnail Preview */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl inline-block mb-4">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Thumbnail Generator</h3>
                  <p className="text-white/70 mb-4">Upload a video or image to create a thumbnail</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                      <Video className="w-4 h-4" />
                      <span>Open Video</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                      <Image className="w-4 h-4" />
                      <span>Open Image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Thumbnail Generator Coming Soon</h3>
            <p className="text-white/70">
              We're working on a powerful thumbnail generator with AI-assisted tools. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}