import React from 'react';
import { Image, Pencil, Eraser, Undo, Redo, Download, Layers, Settings, Palette, Crop, RotateCcw, Zap } from 'lucide-react';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';

export default function ImageCanvas() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center">
              <Pencil className="w-8 h-8 mr-3 text-purple-400" />
              Image Canvas
            </h1>
            <p className="text-lg text-white/70">
              Draw, edit, and enhance your images
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
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
            >
              <Zap className="w-5 h-5" />
              <span>Enhance</span>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tools Panel */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4">Tools</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: <Pencil className="w-5 h-5" />, name: 'Brush' },
                    { icon: <Eraser className="w-5 h-5" />, name: 'Eraser' },
                    { icon: <Crop className="w-5 h-5" />, name: 'Crop' },
                    { icon: <Palette className="w-5 h-5" />, name: 'Color' },
                    { icon: <Layers className="w-5 h-5" />, name: 'Layers' },
                    { icon: <RotateCcw className="w-5 h-5" />, name: 'Rotate' },
                    { icon: <Settings className="w-5 h-5" />, name: 'Settings' },
                    { icon: <Zap className="w-5 h-5" />, name: 'AI Fix' }
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
                  {['Brush stroke', 'Eraser', 'Added layer', 'Crop'].map((action, index) => (
                    <div key={index} className="text-white/70 text-sm p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Canvas */}
            <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center min-h-[500px]">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl inline-block mb-4">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Canvas Area</h3>
                <p className="text-white/70 mb-4">Upload an image or create a new canvas</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Image className="w-4 h-4" />
                    <span>Open Image</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Layers className="w-4 h-4" />
                    <span>New Canvas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Canvas Feature Coming Soon</h3>
            <p className="text-white/70">
              We're working on a powerful image editing canvas with AI-assisted tools. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}