import React from 'react';
import { AudioWaveform as Waveform, Play, Pause, Volume2, Download, Settings, Music, Mic, Zap } from 'lucide-react';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';

export default function AudioVisualizer() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Waveform className="w-8 h-8 mr-3 text-blue-400" />
              Audio Visualizer
            </h1>
            <p className="text-lg text-white/70">
              Create stunning audio visualizations
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
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
            >
              <Zap className="w-5 h-5" />
              <span>Generate</span>
            </button>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Panel */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Visualization Style</h3>
                <div className="space-y-3">
                  {['Waveform', 'Spectrum', 'Circular', 'Particles', 'Bars', 'Terrain'].map((style, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        index === 0 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Color Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'bg-gradient-to-r from-blue-500 to-indigo-500',
                    'bg-gradient-to-r from-purple-500 to-pink-500',
                    'bg-gradient-to-r from-emerald-500 to-teal-500',
                    'bg-gradient-to-r from-red-500 to-orange-500',
                    'bg-gradient-to-r from-yellow-500 to-amber-500',
                    'bg-gradient-to-r from-gray-500 to-slate-500'
                  ].map((color, index) => (
                    <button
                      key={index}
                      className={`h-10 rounded-lg ${color} ${index === 0 ? 'ring-2 ring-white' : ''}`}
                      title={`Color Theme ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Visualizer */}
            <div className="flex-1 bg-black rounded-xl flex flex-col min-h-[500px]">
              {/* Playback Controls */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Play className="w-5 h-5 text-white" />
                  </button>
                  <div className="text-white/70 text-sm">00:00 / 00:00</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Volume2 className="w-5 h-5 text-white" />
                  </button>
                  <div className="w-24 h-1 bg-white/20 rounded-full">
                    <div className="w-3/4 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Visualization Area */}
              <div className="flex-1 flex items-center justify-center p-4">
                {/* Simulated waveform visualization */}
                <div className="w-full h-64 flex items-center justify-around">
                  {[...Array(50)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full"
                      style={{ 
                        height: `${20 + Math.sin(i * 0.2) * 100 + Math.cos(i * 0.3) * 50}px`,
                        opacity: 0.7 + Math.sin(i * 0.5) * 0.3
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* No Audio State (Shown when no audio is loaded) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl inline-block mb-4">
                    <Waveform className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Audio Visualizer</h3>
                  <p className="text-white/70 mb-4">Load an audio file to visualize</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                      <Music className="w-4 h-4" />
                      <span>Open Audio</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                      <Mic className="w-4 h-4" />
                      <span>Record Input</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Audio Visualizer Coming Soon</h3>
            <p className="text-white/70">
              We're working on a powerful audio visualization tool with multiple styles and export options. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}