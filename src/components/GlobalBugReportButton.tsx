import React, { useState } from 'react';
import { Bug, MessageCircle } from 'lucide-react';
import { useBugReport } from '../contexts/BugReportContext';

export default function GlobalBugReportButton() {
  const [isHovered, setIsHovered] = useState(false);
  const { openBugReport } = useBugReport();

  const handleClick = () => {
    openBugReport({
      page: window.location.pathname,
      action: 'Global feedback button clicked',
      additionalInfo: 'User initiated feedback from global button'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:shadow-blue-500/25"
        title="Send Feedback"
      >
        <div className="relative">
          <Bug className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-ping opacity-20"></div>
        </div>
        
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <div className="bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold text-sm">Send Feedback</span>
            </div>
            <p className="text-white/60 text-xs mt-1">Report bugs, request features, or share ideas</p>
            
            {/* Arrow */}
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20"></div>
          </div>
        </div>
      </button>
    </div>
  );
}