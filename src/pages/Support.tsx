import React, { useState } from 'react';
import { HelpCircle, Search, Book, Video, MessageCircle, Mail, Phone, Clock, ChevronRight, Star } from 'lucide-react';

const faqCategories = [
  { id: 'all', name: 'All Topics', count: 24 },
  { id: 'getting-started', name: 'Getting Started', count: 8 },
  { id: 'automations', name: 'Automations', count: 6 },
  { id: 'billing', name: 'Billing', count: 4 },
  { id: 'technical', name: 'Technical', count: 6 }
];

const faqs = [
  {
    id: 1,
    question: "How do I get started with AI automations?",
    answer: "Start with our free automation pack, then follow our step-by-step setup guides. Most automations can be set up in under 10 minutes.",
    category: "getting-started",
    helpful: 234,
    featured: true
  },
  {
    id: 2,
    question: "Do I need coding skills to use these automations?",
    answer: "No coding required! All our automations are designed for creators, not developers. We provide copy-paste templates and visual guides.",
    category: "getting-started",
    helpful: 189
  },
  {
    id: 3,
    question: "Which AI tools do I need to get started?",
    answer: "We recommend starting with ChatGPT, Notion, and Canva. These three tools can handle 80% of your content creation needs.",
    category: "getting-started",
    helpful: 156
  },
  {
    id: 4,
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime from your account settings. Your access continues until the end of your billing period.",
    category: "billing",
    helpful: 98
  },
  {
    id: 5,
    question: "Why isn't my automation working?",
    answer: "Check your API connections and make sure all required fields are filled. Our troubleshooting guide covers the most common issues.",
    category: "technical",
    helpful: 145
  },
  {
    id: 6,
    question: "Can I customize the automations for my brand?",
    answer: "Absolutely! All templates are fully customizable. We provide brand voice training and style guide templates.",
    category: "automations",
    helpful: 167
  }
];

const supportOptions = [
  {
    icon: <Book className="w-8 h-8" />,
    title: "Knowledge Base",
    description: "Comprehensive guides and tutorials",
    action: "Browse Articles",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    action: "Watch Videos",
    gradient: "from-red-600 to-pink-600"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Community Forum",
    description: "Get help from other creators",
    action: "Join Discussion",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Email Support",
    description: "Direct support from our team",
    action: "Send Message",
    gradient: "from-emerald-600 to-teal-600"
  }
];

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-xl border border-blue-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <HelpCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
            <span className="text-blue-300 font-bold text-sm sm:text-base">Help & Support</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            How Can We
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
              Help You?
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto">
            Find answers, get support, and master AI automation
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 sm:mb-16">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, or tutorials..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl pl-16 pr-6 py-6 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-lg"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-16">
          {supportOptions.map((option, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-center hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className={`bg-gradient-to-r ${option.gradient} p-4 rounded-2xl inline-block mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4">{option.title}</h3>
              <p className="text-white/70 mb-6 leading-relaxed">{option.description}</p>
              <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-2 mx-auto transition-colors">
                <span>{option.action}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>

          {/* FAQ Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{category.name}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className={`bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/30 ${faq.featured ? 'border-blue-500/50' : ''}`}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {faq.featured && (
                      <Star className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0" />
                    )}
                    <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                    expandedFaq === faq.id ? 'rotate-90' : ''
                  }`} />
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-6">
                    <p className="text-white/80 leading-relaxed mb-4">{faq.answer}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
                          👍 Helpful
                        </button>
                        <button className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
                          👎 Not helpful
                        </button>
                      </div>
                      <span className="text-white/50 text-sm">{faq.helpful} found this helpful</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
            Still Need Help?
          </h3>
          <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you succeed with AI automation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Email Support</h4>
              <p className="text-white/70 text-sm mb-4">Get detailed help via email</p>
              <p className="text-white/50 text-xs">Response within 24 hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <Phone className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Priority Support</h4>
              <p className="text-white/70 text-sm mb-4">Direct line to our experts</p>
              <p className="text-white/50 text-xs">Available for Pro members</p>
            </div>
          </div>

          <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}