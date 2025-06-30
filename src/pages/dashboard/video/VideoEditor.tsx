import React from 'react';
import { Scissors, Video, Download, Undo, Redo, Play, Pause, Volume2, Zap, Settings, Layers, Crop, RotateCcw } from 'lucide-react';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';

export default function VideoEditor() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Scissors className="w-8 h-8 mr-3 text-red-400" />
              Video Editor
            </h1>
            <p className="text-lg text-white/70">
              Edit, trim, and enhance your videos
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
              <span>Enhance</span>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tools Panel */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Tools</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: <Scissors className="w-5 h-5" />, name: 'Cut' },
                    { icon: <Crop className="w-5 h-5" />, name: 'Crop' },
                    { icon: <RotateCcw className="w-5 h-5" />, name: 'Rotate' },
                    { icon: <Layers className="w-5 h-5" />, name: 'Layers' },
                    { icon: <Settings className="w-5 h-5" />, name: 'Effects' },
                    { icon: <Volume2 className="w-5 h-5" />, name: 'Audio' },
                    { icon: <Zap className="w-5 h-5" />, name: 'AI Fix' },
                    { icon: <Video className="w-5 h-5" />, name: 'Export' }
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
                <h3 className="text-lg font-bold text-white mb-4">History</h3>
                <div className="flex space-x-2 mb-4">
                  <button className="flex-1 flex items-center justify-center space-x-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white">
                    <Undo className="w-4 h-4" />
                    <span className="text-sm">Undo</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white">
                    <Redo className="w-4 h-4" />
                    <span className="text-sm">Redo</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {['Cut segment', 'Added transition', 'Applied filter', 'Adjusted audio'].map((action, index) => (
                    <div key={index} className="text-white/70 text-sm p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Preview Area */}
            <div className="flex-1 bg-white/5 rounded-xl flex flex-col min-h-[500px]">
              {/* Video Preview */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl inline-block mb-4">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Video Editor</h3>
                  <p className="text-white/70 mb-4">Open a video to start editing</p>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Video className="w-4 h-4" />
                    <span>Open Video</span>
                  </button>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="h-24 bg-white/5 rounded-xl mt-4 p-3">
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/50 text-sm">Timeline will appear here when a video is loaded</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Video Editor Coming Soon</h3>
            <p className="text-white/70">
              We're working on a powerful video editing suite with AI-assisted tools. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}