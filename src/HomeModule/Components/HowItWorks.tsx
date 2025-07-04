import React, { useState, useEffect } from 'react';
import { Upload, MessageSquare, Sparkles, ArrowRight, Play, CheckCircle, Clock, Zap, Image, Video, Brain, Target, Camera, Wand2, Download } from 'lucide-react';

const workflows = [
  {
    id: 'prebuilt',
    title: 'Use Prebuilt Models',
    subtitle: 'Start creating instantly',
    emoji: '🚀',
    steps: [
      {
        icon: <Target className="w-6 h-6" />,
        title: "Browse Models",
        description: "Select from 50+ AI models",
        duration: "30s",
        visual: {
          type: "grid",
          items: [
            { name: "SDXL", type: "Portrait", color: "bg-purple-500" },
            { name: "Veo3", type: "Video", color: "bg-red-500" },
            { name: "DreamShaper", type: "Art", color: "bg-pink-500" },
            { name: "Realistic", type: "Photo", color: "bg-blue-500" }
          ]
        }
      },
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Write Prompt",
        description: "Describe what you want",
        duration: "1m",
        visual: {
          type: "typing",
          text: "Professional headshot, studio lighting, business attire..."
        }
      },
      {
        icon: <Sparkles className="w-6 h-6" />,
        title: "Generate",
        description: "AI creates your content",
        duration: "10s",
        visual: {
          type: "generation",
          progress: [25, 50, 75, 100]
        }
      }
    ]
  },
  {
    id: 'custom',
    title: 'Train Your Style',
    subtitle: 'Create personalized AI',
    emoji: '🎨',
    steps: [
      {
        icon: <Upload className="w-6 h-6" />,
        title: "Upload Photos",
        description: "Add 10-20 images",
        duration: "2m",
        visual: {
          type: "upload",
          files: [
            { name: "IMG_001.jpg", status: "uploaded" },
            { name: "IMG_002.jpg", status: "uploading" },
            { name: "IMG_003.jpg", status: "pending" }
          ]
        }
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "AI Training",
        description: "Learning your style",
        duration: "5-8m",
        visual: {
          type: "training",
          stages: ["Analyzing", "Learning", "Optimizing", "Finalizing"]
        }
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Ready to Use",
        description: "Create unlimited content",
        duration: "∞",
        visual: {
          type: "results",
          outputs: ["Portrait", "Landscape", "Close-up", "Action"]
        }
      }
    ]
  }
];

export default function HowItWorks() {
  const [activeWorkflow, setActiveWorkflow] = useState('prebuilt');
  const [activeStep, setActiveStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  const currentWorkflow = workflows.find(w => w.id === activeWorkflow);
  const currentStep = currentWorkflow?.steps[activeStep];

  // Auto-advance animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => {
        const nextStep = (prev + 1) % (currentWorkflow?.steps.length || 1);
        if (nextStep === 0) {
          // Switch workflow when completing a cycle
          setActiveWorkflow(current => current === 'prebuilt' ? 'custom' : 'prebuilt');
        }
        return nextStep;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentWorkflow]);

  const renderVisual = () => {
    if (!currentStep?.visual) return null;

    const { visual } = currentStep;

    switch (visual.type) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-2">
            {visual.items.map((item, index) => (
              <div 
                key={index}
                className={`${item.color} rounded-xl p-3 text-white text-center transform transition-all duration-500 ${
                  animationPhase === index ? 'scale-110 shadow-lg' : 'scale-100'
                }`}
              >
                <div className="text-xl mb-1">🎯</div>
                <div className="font-bold text-sm">{item.name}</div>
                <div className="text-xs opacity-80">{item.type}</div>
              </div>
            ))}
          </div>
        );

      case 'typing':
        const displayText = visual.text.slice(0, Math.min(visual.text.length, (animationPhase + 1) * 15));
        return (
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-600">
            <div className="text-gray-400 text-xs mb-1">Prompt:</div>
            <div className="text-white font-mono text-sm">
              {displayText}
              <span className="animate-pulse">|</span>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <div className="text-purple-400 text-xs">AI optimizing prompt...</div>
            </div>
          </div>
        );

      case 'generation':
        const progress = visual.progress[animationPhase] || 0;
        return (
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">Generating...</span>
                <span className="text-emerald-400 font-bold text-sm">{progress}%</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            {progress === 100 && (
              <div className="bg-emerald-600/20 border border-emerald-500/50 rounded-xl p-2 text-center animate-pulse">
                <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-emerald-400 font-bold text-sm">Ready to download!</div>
              </div>
            )}
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-2">
            {visual.files.map((file, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-2 flex items-center space-x-2">
                <Image className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{file.name}</div>
                  <div className={`text-xs ${
                    file.status === 'uploaded' ? 'text-emerald-400' :
                    file.status === 'uploading' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {file.status === 'uploading' && animationPhase % 2 === 0 ? 'Uploading...' : file.status}
                  </div>
                </div>
                {file.status === 'uploaded' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {file.status === 'uploading' && <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />}
              </div>
            ))}
          </div>
        );

      case 'training':
        const currentStage = visual.stages[animationPhase] || visual.stages[0];
        return (
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-white font-semibold text-sm">AI Training</span>
              </div>
              <div className="text-purple-400 font-medium text-sm mb-2">{currentStage}</div>
              <div className="grid grid-cols-4 gap-1">
                {visual.stages.map((stage, index) => (
                  <div 
                    key={index}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index <= animationPhase ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="grid grid-cols-2 gap-2">
            {visual.outputs.map((output, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-2 text-white text-center transform transition-all duration-500 ${
                  animationPhase === index ? 'scale-110 shadow-lg' : 'scale-100'
                }`}
              >
                <Sparkles className="w-5 h-5 mx-auto mb-1" />
                <div className="font-bold text-sm">{output}</div>
                <div className="text-xs opacity-80">Ready</div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Compact background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6">
        {/* Compact Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-xl border border-emerald-500/40 rounded-full px-4 py-2 mb-3">
            <Play className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-bold text-sm">How It Works</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
            Two Simple
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Workflows
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Choose your path: use prebuilt models or train your own AI
          </p>
        </div>

        {/* Compact Workflow Display */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl">
          {/* Workflow Tabs */}
          <div className="flex justify-center mb-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => {
                    setActiveWorkflow(workflow.id);
                    setActiveStep(0);
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-sm transition-all duration-300 ${
                    activeWorkflow === workflow.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{workflow.emoji}</span>
                    <div className="text-left">
                      <div>{workflow.title}</div>
                      <div className="text-xs opacity-80">{workflow.subtitle}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Single Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* Steps Navigation */}
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white mb-3">
                {currentWorkflow?.title}
              </h3>
              
              {currentWorkflow?.steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                    index === activeStep 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    index === activeStep 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' 
                      : 'bg-white/10'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-bold">{step.title}</h4>
                      <span className="text-emerald-400 text-sm font-semibold">{step.duration}</span>
                    </div>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                  {index === activeStep && (
                    <div className="text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Visual Animation */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3 animate-bounce">
                  {currentStep?.title === "Browse Models" && "🎯"}
                  {currentStep?.title === "Write Prompt" && "✍️"}
                  {currentStep?.title === "Generate" && "✨"}
                  {currentStep?.title === "Upload Photos" && "📤"}
                  {currentStep?.title === "AI Training" && "🧠"}
                  {currentStep?.title === "Ready to Use" && "⚡"}
                </div>
                <h4 className="text-white font-black text-lg mb-1">{currentStep?.title}</h4>
                <p className="text-white/70 text-sm mb-3">{currentStep?.description}</p>
              </div>
              
              {/* Dynamic Visual Content */}
              <div className="min-h-[180px] flex items-center justify-center">
                {renderVisual()}
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="mt-5 text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 justify-center">
                <Target className="w-5 h-5" />
                <span>Try Prebuilt Models</span>
              </button>
              <button className="border-2 border-white/20 text-white font-semibold px-6 py-2 rounded-xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm flex items-center space-x-2 justify-center">
                <Upload className="w-5 h-5" />
                <span>Train Your Own</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}