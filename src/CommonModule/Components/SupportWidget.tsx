import React, { useState, useRef, useEffect } from 'react';
import { Bug, MessageCircle, HelpCircle, Phone, X, Send, ChevronRight, Zap, ArrowRight, Search, FileText, Trash2, Download, Copy } from 'lucide-react';
import { useBugReport } from '../Contexts/BugReportContext';
import { Link } from 'react-router-dom';
import { toast } from '../Contexts/ToastContext';

export default function SupportWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hi there! How can I help you today?'}
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { openBugReport } = useBugReport();
  const widgetRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the widget
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        // Don't close chat when clicking outside if chat is open
        if (!isChatOpen) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [isChatOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isChatOpen) {
          setIsChatOpen(false);
        } else if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded, isChatOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem('ai-chat-history');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        if (Array.isArray(parsedChat) && parsedChat.length > 0) {
          setChatHistory(parsedChat);
        }
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 1) { // Only save if there's more than the initial greeting
      localStorage.setItem('ai-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleBugReport = () => {
    openBugReport({
      page: window.location.pathname,
      action: 'Bug report opened from support widget',
      additionalInfo: 'User initiated feedback from support widget'
    });
    setIsExpanded(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, {role: 'user', content: message}]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      let response = '';
      
      // Simple response logic based on keywords
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = 'Hello! How can I assist you with OpenModel Studio today?';
      } else if (lowerMessage.includes('help')) {
        response = 'I\'d be happy to help! What specific feature or issue are you having trouble with?';
      } else if (lowerMessage.includes('model') || lowerMessage.includes('train')) {
        response = 'To train a custom model, go to the Styles section in your dashboard and click "Train New Style". You\'ll need to upload 10-20 reference images.';
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('subscription')) {
        response = 'We offer several pricing plans starting at $10/month for the Pro plan. You can view all pricing details on our Pricing page.';
      } else if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('issue')) {
        response = 'I\'m sorry you\'re experiencing an issue. For technical problems, please use the "Report a Bug" option to submit details to our team.';
      } else if (lowerMessage.includes('upload') || lowerMessage.includes('file')) {
        response = 'To upload files, navigate to the specific section in your dashboard (Images, Videos, Audio, or Music) and click the "Upload" button. You can drag and drop files or browse your computer.';
      } else if (lowerMessage.includes('generate') || lowerMessage.includes('create')) {
        response = 'To generate content, select the appropriate section in your dashboard, choose a model, adjust parameters to your liking, and click "Generate". The AI will create content based on your specifications.';
      } else if (lowerMessage.includes('download') || lowerMessage.includes('export')) {
        response = 'You can download any generated asset by hovering over it in your gallery and clicking the download icon, or by opening the asset details and using the download button there.';
      } else {
        response = 'Thanks for your message! For more detailed assistance, please contact our support team directly or check our documentation for guides and tutorials.';
      }

      setChatHistory(prev => [...prev, {role: 'assistant', content: response}]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    chatInputRef.current?.focus();
  };

  const clearChat = () => {
    setChatHistory([{role: 'assistant', content: 'Hi there! How can I help you today?'}]);
    localStorage.removeItem('ai-chat-history');
    toast.success('Chat history cleared');
  };

  const copyConversation = () => {
    const text = chatHistory.map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Conversation copied to clipboard');
  };

  if (!isWidgetVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[150]" ref={widgetRef}>
      {/* Chat Panel */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl mb-2 flex flex-col overflow-hidden h-[60vh] max-h-[600px]">
          {/* Chat Header */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-1.5 rounded-lg">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white font-bold text-sm">AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={clearChat}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Clear chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={copyConversation}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Copy conversation"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Quick Prompts */}
          <div className="p-2 border-b border-white/10 bg-white/5 overflow-x-auto whitespace-nowrap flex space-x-2">
            <button 
              onClick={() => handleQuickPrompt("How do I upload images?")}
              className="bg-white/10 hover:bg-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              📁 How to upload images
            </button>
            <button 
              onClick={() => handleQuickPrompt("How do I train a style?")}
              className="bg-white/10 hover:bg-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              🎨 How to train a style
            </button>
            <button 
              onClick={() => handleQuickPrompt("How do I save models?")}
              className="bg-white/10 hover:bg-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              💾 How to save models
            </button>
            <button 
              onClick={() => handleQuickPrompt("I found a problem with...")}
              className="bg-white/10 hover:bg-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              🛠 Report a problem
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-purple-600/30 border border-purple-500/50 text-white' 
                    : 'bg-white/10 border border-white/20 text-white/90'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-right mt-1">
                    <span className="text-[10px] opacity-50">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-2xl px-3 py-2 text-white/90">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested Follow-ups */}
          {chatHistory.length > 1 && !isTyping && chatHistory[chatHistory.length - 1].role === 'assistant' && (
            <div className="px-3 py-2 border-t border-white/10 bg-white/5 flex flex-wrap gap-2">
              <button 
                onClick={() => handleQuickPrompt("Can you show me an example?")}
                className="bg-white/10 hover:bg-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-colors flex items-center space-x-1"
              >
                <span>Can you show me an example?</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button 
                onClick={() => handleQuickPrompt("I need more details")}
                className="bg-white/10 hover:bg-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-colors flex items-center space-x-1"
              >
                <span>I need more details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/5">
            <div className="flex space-x-2">
              <input
                type="text"
                ref={chatInputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white p-2 rounded-lg hover:scale-105 transition-all duration-300"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-white/40 text-[10px]">Press Enter to send, Shift+Enter for new line</span>
            </div>
          </form>
        </div>
      )}

      {/* Support Options Panel */}
      {isExpanded && !isChatOpen && (
        <div className="absolute bottom-16 right-0 w-64 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl mb-2 overflow-hidden transform transition-all duration-300 ease-in-out">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm flex items-center">
              <HelpCircle className="w-4 h-4 mr-2 text-blue-400" />
              Need Help?
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-2">
            <button 
              onClick={handleBugReport}
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2 text-white/90 hover:text-white"
            >
              <Bug className="w-4 h-4 text-red-400" />
              <span className="text-sm">Report a Bug / Feedback</span>
            </button>
            
            <button 
              onClick={() => {
                setIsChatOpen(true);
                setIsExpanded(false);
              }}
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2 text-white/90 hover:text-white"
            >
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Chat with AI Assistant</span>
            </button>
            
            <Link 
              to="/contact"
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between text-white/90 hover:text-white"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Contact / Connect with Us</span>
              </div>
              <ChevronRight className="w-3 h-3 text-white/60" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Button with Close Option */}
      <div className="flex flex-col items-end space-y-2">
        {isWidgetVisible && (
          <button
            onClick={() => setIsWidgetVisible(false)}
            className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-all duration-300 backdrop-blur-xl border border-white/20"
            aria-label="Hide support widget"
            title="Hide support widget"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        
        <button
          onClick={() => {
            if (isChatOpen) {
              setIsChatOpen(false);
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className="group bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:shadow-blue-500/25"
          aria-label="Support Options"
        >
          <div className="relative">
            <HelpCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </button>
      </div>
    </div>
  );
}