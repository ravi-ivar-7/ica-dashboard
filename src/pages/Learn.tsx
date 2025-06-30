import React, { useState } from 'react';
import { Play, BookOpen, Clock, Users, Star, ChevronRight, Filter, Search, Zap, Brain, Video, FileText, Target, Palette } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Courses', icon: <BookOpen className="w-4 h-4" />, count: 24 },
  { id: 'getting-started', name: 'Getting Started', icon: <Brain className="w-4 h-4" />, count: 8 },
  { id: 'image-models', name: 'Image Models', icon: <Palette className="w-4 h-4" />, count: 6 },
  { id: 'video-models', name: 'Video Models', icon: <Video className="w-4 h-4" />, count: 5 },
  { id: 'advanced', name: 'Advanced', icon: <Zap className="w-4 h-4" />, count: 3 },
  { id: 'lora', name: 'LoRA Training', icon: <Target className="w-4 h-4" />, count: 2 }
];

const courses = [
  {
    id: 1,
    title: "OpenModel Studio Fundamentals",
    description: "Master the basics of AI model creation and personalization",
    instructor: "Sarah Chen",
    duration: "2h 30m",
    lessons: 12,
    students: 2847,
    rating: 4.9,
    level: "Beginner",
    category: "getting-started",
    thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    price: "Free",
    featured: true
  },
  {
    id: 2,
    title: "Image Model Mastery",
    description: "Create stunning images with SDXL, DreamShaper, and more",
    instructor: "Mike Rodriguez",
    duration: "3h 15m",
    lessons: 18,
    students: 1923,
    rating: 4.8,
    level: "Intermediate",
    category: "image-models",
    thumbnail: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    price: "$97"
  },
  {
    id: 3,
    title: "Video Generation with Veo 3",
    description: "Create cinematic videos with next-gen AI technology",
    instructor: "Emma Davis",
    duration: "4h 45m",
    lessons: 24,
    students: 1456,
    rating: 4.9,
    level: "Advanced",
    category: "video-models",
    thumbnail: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    price: "$197"
  },
  {
    id: 4,
    title: "LoRA Training Deep Dive",
    description: "Advanced techniques for training personalized AI models",
    instructor: "Alex Thompson",
    duration: "1h 45m",
    lessons: 8,
    students: 3241,
    rating: 4.7,
    level: "Advanced",
    category: "lora",
    thumbnail: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    price: "$67"
  },
  {
    id: 5,
    title: "Custom Style Development",
    description: "Develop your unique artistic style with AI assistance",
    instructor: "Jessica Martinez",
    duration: "2h 20m",
    lessons: 14,
    students: 987,
    rating: 4.8,
    level: "Intermediate",
    category: "image-models",
    thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    price: "$127"
  },
  {
    id: 6,
    title: "AI Model Optimization",
    description: "Optimize your models for speed and quality",
    instructor: "David Kim",
    duration: "1h 30m",
    lessons: 6,
    students: 2156,
    rating: 4.9,
    level: "Advanced",
    category: "advanced",
    thumbnail: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    price: "Free"
  }
];

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredCourse = courses.find(course => course.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
            <span className="text-purple-300 font-bold text-sm sm:text-base">Learn & Master AI</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
            Learning
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-600 bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-white/80 max-w-4xl mx-auto">
            Master AI model creation with hands-on courses designed for creators
          </p>
        </div>

        {/* Featured Course */}
        {featuredCourse && (
          <div className="mb-8 sm:mb-16">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img 
                    src={featuredCourse.thumbnail}
                    alt={featuredCourse.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black px-3 py-1 rounded-full text-sm">
                      🔥 Featured
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all duration-300 hover:scale-110">
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">
                      {featuredCourse.price}
                    </span>
                    <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                      {featuredCourse.level}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">{featuredCourse.title}</h3>
                  <p className="text-white/70 text-lg mb-6">{featuredCourse.description}</p>
                  
                  <div className="flex items-center space-x-6 mb-6 text-white/60">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{featuredCourse.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{featuredCourse.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{featuredCourse.rating}</span>
                    </div>
                  </div>

                  <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Start Learning</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    course.price === 'Free' 
                      ? 'bg-emerald-600/20 text-emerald-400' 
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {course.price}
                  </span>
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">
                    {course.level}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{course.description}</p>
                
                <div className="flex items-center justify-between text-white/60 text-sm mb-4">
                  <span>by {course.instructor}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white/60 text-sm mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  <span>{course.lessons} lessons</span>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-purple-500/40 hover:border-purple-400/60 backdrop-blur-sm flex items-center justify-center space-x-2">
                  <span>Start Course</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
            Ready to Master AI?
          </h3>
          <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've transformed their workflow with AI
          </p>
          <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-lg">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}