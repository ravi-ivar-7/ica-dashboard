import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const comparison = [
  {
    feature: "Model Training",
    traditional: "Complex setup required",
    openmodel: "Upload photos, done",
    traditionalIcon: <X className="w-5 h-5 text-red-400" />,
    openmodelIcon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  },
  {
    feature: "Technical Skills",
    traditional: "Coding knowledge needed",
    openmodel: "No code required",
    traditionalIcon: <X className="w-5 h-5 text-red-400" />,
    openmodelIcon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  },
  {
    feature: "Training Time",
    traditional: "Hours to days",
    openmodel: "Minutes",
    traditionalIcon: <X className="w-5 h-5 text-red-400" />,
    openmodelIcon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  },
  {
    feature: "Model Ownership",
    traditional: "Platform dependent",
    openmodel: "You own your models",
    traditionalIcon: <X className="w-5 h-5 text-red-400" />,
    openmodelIcon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  },
  {
    feature: "Customization",
    traditional: "Limited options",
    openmodel: "Fully personalized",
    traditionalIcon: <X className="w-5 h-5 text-red-400" />,
    openmodelIcon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  },
  {
    feature: "Quality Control",
    traditional: "Generic outputs",
    openmodel: "Studio-quality results",
    traditionalIcon: <X className="w-5 h-5 text-red-400" />,
    openmodelIcon: <CheckCircle className="w-5 h-5 text-emerald-400" />
  }
];

export default function WhyOpenModel() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-xl border border-emerald-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            <span className="text-emerald-300 font-bold text-sm sm:text-base">Why Choose Us?</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Why OpenModel
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Studio?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto">
            See how we compare to traditional AI tools and platforms
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-0 border-b border-white/20">
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-black text-white">Feature</h3>
              </div>
              <div className="p-4 sm:p-6 text-center border-x border-white/20">
                <h3 className="text-lg sm:text-xl font-black text-red-400">Traditional AI Tools</h3>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-black text-emerald-400">OpenModel Studio</h3>
              </div>
            </div>

            {/* Comparison Rows */}
            {comparison.map((item, index) => (
              <div key={index} className={`grid grid-cols-3 gap-0 ${index !== comparison.length - 1 ? 'border-b border-white/10' : ''}`}>
                <div className="p-3 sm:p-4 flex items-center">
                  <span className="text-white font-semibold text-sm sm:text-base">{item.feature}</span>
                </div>
                <div className="p-3 sm:p-4 border-x border-white/10 flex items-center space-x-2">
                  {item.traditionalIcon}
                  <span className="text-white/70 text-xs sm:text-sm">{item.traditional}</span>
                </div>
                <div className="p-3 sm:p-4 flex items-center space-x-2">
                  {item.openmodelIcon}
                  <span className="text-white/90 font-semibold text-xs sm:text-sm">{item.openmodel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
              Ready to Experience the Difference?
            </h3>
            <p className="text-white/70 mb-4 text-sm sm:text-base">
              Join thousands of creators who've made the switch to OpenModel Studio
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-lg">
              Start Creating Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}