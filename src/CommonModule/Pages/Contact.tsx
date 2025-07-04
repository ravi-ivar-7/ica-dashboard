import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const contactMethods = [
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Email Us",
    description: "Get detailed support via email",
    contact: "hello@aicreators.academy",
    response: "Within 24 hours",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Live Chat",
    description: "Chat with our support team",
    contact: "Available 9 AM - 6 PM EST",
    response: "Instant response",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Book a Call",
    description: "Schedule a 1-on-1 consultation",
    contact: "30-minute sessions",
    response: "Same day booking",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    icon: <Phone className="w-8 h-8" />,
    title: "Priority Line",
    description: "Direct access for Pro members",
    contact: "+1 (555) 123-4567",
    response: "Immediate assistance",
    gradient: "from-orange-600 to-red-600"
  }
];

const officeInfo = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Headquarters",
    details: ["123 Innovation Drive", "San Francisco, CA 94105", "United States"]
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Business Hours",
    details: ["Monday - Friday: 9 AM - 6 PM EST", "Saturday: 10 AM - 4 PM EST", "Sunday: Closed"]
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Response Time",
    details: ["Email: Within 24 hours", "Live Chat: Instant", "Priority: Immediate"]
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'normal'
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl border border-cyan-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-sm sm:text-base">Get in Touch</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            Contact
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto">
            Have questions? Need help? Want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-center hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className={`bg-gradient-to-r ${method.gradient} p-4 rounded-2xl inline-block mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {method.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4">{method.title}</h3>
              <p className="text-white/70 mb-4 leading-relaxed">{method.description}</p>
              <div className="space-y-2">
                <p className="text-cyan-400 font-semibold text-sm">{method.contact}</p>
                <p className="text-white/50 text-xs">{method.response}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8">
            <h2 className="text-3xl font-black text-white mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  >
                    <option value="low" className="bg-gray-900">Low</option>
                    <option value="normal" className="bg-gray-900">Normal</option>
                    <option value="high" className="bg-gray-900">High</option>
                    <option value="urgent" className="bg-gray-900">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Office Info */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                {officeInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-cyan-600/20 p-3 rounded-xl">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-white/70">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8">
              <h3 className="text-2xl font-black text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 border border-emerald-500/40 hover:border-emerald-400/60 backdrop-blur-sm text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Start Live Chat</p>
                      <p className="text-sm text-white/70">Get instant help</p>
                    </div>
                    <MessageCircle className="w-6 h-6" />
                  </div>
                </button>
                
                <button className="w-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 border border-purple-500/40 hover:border-purple-400/60 backdrop-blur-sm text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Book a Call</p>
                      <p className="text-sm text-white/70">Schedule consultation</p>
                    </div>
                    <Calendar className="w-6 h-6" />
                  </div>
                </button>
                
                <button className="w-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 border border-blue-500/40 hover:border-blue-400/60 backdrop-blur-sm text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Browse Help Center</p>
                      <p className="text-sm text-white/70">Find answers quickly</p>
                    </div>
                    <MessageCircle className="w-6 h-6" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}