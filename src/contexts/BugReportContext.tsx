import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bug, X, Send, User, MessageSquare, Code, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from './ToastContext';

interface BugReportContextType {
  openBugReport: (context?: BugReportContext) => void;
  closeBugReport: () => void;
}

interface BugReportContext {
  page?: string;
  action?: string;
  error?: Error;
  additionalInfo?: string;
}

const BugReportContext = createContext<BugReportContextType | undefined>(undefined);

export const useBugReport = () => {
  const context = useContext(BugReportContext);
  if (context === undefined) {
    throw new Error('useBugReport must be used within a BugReportProvider');
  }
  return context;
};

interface BugReportProviderProps {
  children: ReactNode;
}

export const BugReportProvider: React.FC<BugReportProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bugContext, setBugContext] = useState<BugReportContext | undefined>();

  const openBugReport = (context?: BugReportContext) => {
    setBugContext(context);
    setIsOpen(true);
  };

  const closeBugReport = () => {
    setIsOpen(false);
    setBugContext(undefined);
  };

  return (
    <BugReportContext.Provider value={{ openBugReport, closeBugReport }}>
      {children}
      {isOpen && (
        <GlobalBugReportModal
          isOpen={isOpen}
          onClose={closeBugReport}
          context={bugContext}
        />
      )}
    </BugReportContext.Provider>
  );
};

interface GlobalBugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: BugReportContext;
}

const GlobalBugReportModal: React.FC<GlobalBugReportModalProps> = ({ isOpen, onClose, context }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'bug',
    priority: 'medium',
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    browserInfo: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    page: context?.page || window.location.pathname,
    action: context?.action || '',
    additionalInfo: context?.additionalInfo || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
    { value: 'feature', label: 'Feature Request', icon: '💡' },
    { value: 'improvement', label: 'Improvement', icon: '⚡' },
    { value: 'ui', label: 'UI/UX Issue', icon: '🎨' },
    { value: 'performance', label: 'Performance', icon: '🚀' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-orange-400' },
    { value: 'critical', label: 'Critical', color: 'text-red-400' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // In a real app, you would send this to your bug tracking service
    const report = {
      ...formData,
      errorMessage: context?.error?.message,
      errorStack: context?.error?.stack,
      reportId: `${formData.category.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    };

    console.log('Bug report submitted:', report);
    
    toast.success('Report submitted successfully!', {
      subtext: `Report ID: ${report.reportId}`,
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
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
                  <Bug className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Submit Feedback</h2>
                  <p className="text-white/60 text-sm">Help us improve OpenModel Studio</p>
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
              Found a bug, have a feature request, or want to share feedback? We'd love to hear from you!
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <form onSubmit={handleSubmit} className="p-4 sm:p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-400" />
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
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
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
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Report Type & Priority */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-purple-400" />
                      <span>Report Details</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/80 text-sm font-semibold mb-1">
                            Category
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                          >
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value} className="bg-gray-900">
                                {cat.icon} {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm font-semibold mb-1">
                            Priority
                          </label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                          >
                            {priorities.map((priority) => (
                              <option key={priority.value} value={priority.value} className="bg-gray-900">
                                {priority.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-semibold mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                          placeholder="Brief summary of the issue or request"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-orange-400" />
                      <span>Description</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/80 text-sm font-semibold mb-1">
                          Detailed Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none text-sm"
                          placeholder="Describe the issue, feature request, or feedback in detail..."
                          required
                        />
                      </div>
                      
                      {formData.category === 'bug' && (
                        <>
                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-1">
                              Steps to Reproduce
                            </label>
                            <textarea
                              name="stepsToReproduce"
                              value={formData.stepsToReproduce}
                              onChange={handleChange}
                              rows={2}
                              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none text-sm"
                              placeholder="1. Go to... 2. Click on... 3. Error appears..."
                            />
                          </div>
                        </>
                      )}
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
                disabled={isSubmitting || !formData.name || !formData.email || !formData.title || !formData.description}
                className={`flex-1 font-bold px-4 py-2 rounded-xl transition-all duration-300 text-sm ${
                  isSubmitting || !formData.name || !formData.email || !formData.title || !formData.description
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white hover:scale-105 shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Report</span>
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