import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Mail, Bug, X, Send, User, MessageSquare, Code, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/CommonModule/Contexts/ToastContext';

interface ErrorPageProps {
  error?: Error;
  errorCode?: string;
  title?: string;
  message?: string;
  showReload?: boolean;
}

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: Error;
  errorCode?: string;
}

const BugReportModal: React.FC<BugReportModalProps> = ({ isOpen, onClose, error, errorCode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    browserInfo: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would send this to your error tracking service
    const bugReport = {
      ...formData,
      errorCode,
      errorMessage: error?.message,
      errorStack: error?.stack,
      reportId: `BUG-${Date.now().toString(36).toUpperCase()}`
    };

    console.log('Bug report submitted:', bugReport);
    
    toast.success('Bug report submitted successfully!', {
      subtext: `Report ID: ${bugReport.reportId}`,
      duration: 6000
    });

    setIsSubmitting(false);
    onClose();
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Reduced size */}
      <div className="p-6 relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 p-2 rounded-xl shadow-lg">
                  <Bug className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Report Bug</h2>
                  <p className="text-white/60 text-sm">Help us fix this issue</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/10 backdrop-blur-xl p-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <p className="text-white/80 text-sm leading-relaxed">
              We're sorry you encountered this error. Your feedback helps us improve OpenModel Studio.
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <form onSubmit={handleSubmit} className="p-4 sm:p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column - User Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                      <User className="w-4 h-4 text-red-400" />
                      <span>Contact Information</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/80 text-sm font-semibold mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all text-sm"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-semibold mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all text-sm"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Details */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                      <Code className="w-4 h-4 text-orange-400" />
                      <span>Error Details</span>
                    </h3>
                    
                    <div className="bg-gradient-to-br from-red-600/10 to-orange-600/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Error Code:</span>
                        <span className="text-red-400 font-bold">{errorCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Page URL:</span>
                        <span className="text-white/90 font-mono truncate max-w-[180px]">{formData.url}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Timestamp:</span>
                        <span className="text-white/90">{new Date(formData.timestamp).toLocaleString()}</span>
                      </div>
                      {error?.message && (
                        <div>
                          <span className="text-white/70 block mb-1">Error Message:</span>
                          <span className="text-red-400 font-mono break-all text-xs">{error.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Bug Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span>Bug Details</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/80 text-sm font-semibold mb-1">
                          What were you trying to do?
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all resize-none text-sm"
                          placeholder="Describe what you were doing when the error occurred..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-semibold mb-1">
                          Steps to Reproduce
                        </label>
                        <textarea
                          name="stepsToReproduce"
                          value={formData.stepsToReproduce}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all resize-none text-sm"
                          placeholder="1. Go to... 2. Click on... 3. Error appears..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-white/10 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.email || !formData.description}
                className={`flex-1 font-bold px-4 py-2 rounded-xl transition-all duration-300 text-sm ${
                  isSubmitting || !formData.name || !formData.email || !formData.description
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-black hover:scale-105 shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Bug Report</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ErrorPage({ 
  error, 
  errorCode = "500", 
  title = "Something went wrong",
  message = "We encountered an unexpected error. Our team has been notified and is working on a fix.",
  showReload = true 
}: ErrorPageProps) {
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    setIsBugReportOpen(true);
  };

  return (
    <>
      <div className="pt-4 min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Glitch effect elements */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-20 bg-red-500/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-6 text-center">
          {/* Error icon */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-full inline-block shadow-2xl animate-pulse">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Error code */}
          <div className="mb-6">
            <span className="text-6xl sm:text-9xl lg:text-[12rem] font-black text-transparent bg-gradient-to-r from-red-400 via-orange-500 to-yellow-600 bg-clip-text leading-none">
              {errorCode}
            </span>
          </div>

          {/* Error title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Error message */}
          <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            {message}
          </p>

          {/* Error details (if available) */}
          {error && (
            <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-red-400 mb-3">Technical Details</h3>
              <p className="text-white/70 text-sm font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
            {showReload && (
              <button
                onClick={handleReload}
                className="group bg-gradient-to-r from-red-500 to-orange-600 text-white font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3"
              >
                <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
                <span>Try Again</span>
              </button>
            )}
            
            <Link
              to="/"
              className="group bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-2 border-white/30 text-white font-black px-8 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 hover:border-white/50 flex items-center space-x-3"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>

            <button
              onClick={handleReportError}
              className="group bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-xl border border-blue-500/40 text-blue-400 font-semibold px-6 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-600/50 hover:to-cyan-600/50 transition-all duration-300 flex items-center space-x-2"
            >
              <Bug className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>

          {/* Help section */}
          <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 max-w-3xl mx-auto">
            <h3 className="text-2xl font-black text-white mb-6">Need Help?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl inline-block mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-bold mb-2">Contact Support</h4>
                <p className="text-white/70 text-sm mb-4">Get help from our support team</p>
                <Link
                  to="/contact"
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
                >
                  Contact Us →
                </Link>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl inline-block mb-4">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-bold mb-2">Go Back</h4>
                <p className="text-white/70 text-sm mb-4">Return to the previous page</p>
                <button
                  onClick={() => window.history.back()}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors"
                >
                  Go Back →
                </button>
              </div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="mt-12 mb-4 flex items-center justify-center space-x-4 text-white/50">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Error ID: {Date.now().toString(36).toUpperCase()}</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
        error={error}
        errorCode={errorCode}
      />
    </>
  );
}