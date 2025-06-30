import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  Image, 
  Video, 
  Music, 
  Plus,
  ArrowRight,
  Target,
  Palette
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import AssetCard from '../../components/dashboard/AssetCard';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../services/api';
import ErrorBoundary from '../../components/dashboard/ErrorBoundary';

const stats = [
  {
    title: "Total Assets",
    value: "1,247",
    change: "+12% this month",
    changeType: "positive" as const,
    icon: TrendingUp,
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    title: "Active Models",
    value: "24",
    change: "+3 this week",
    changeType: "positive" as const,
    icon: Zap,
    gradient: "from-yellow-600 to-orange-600"
  },
  {
    title: "Processing Time",
    value: "2.3s",
    change: "-15% faster",
    changeType: "positive" as const,
    icon: Clock,
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    title: "Success Rate",
    value: "98.7%",
    change: "+2.1% increase",
    changeType: "positive" as const,
    icon: Target,
    gradient: "from-blue-600 to-cyan-600"
  }
];

const quickActions = [
  {
    title: 'Generate Image',
    description: 'Create stunning images with AI',
    icon: <Image className="w-5 h-5" />,
    gradient: 'from-purple-600 to-pink-600',
    path: '/dashboard/images'
  },
  {
    title: 'Create Video',
    description: 'Generate cinematic videos',
    icon: <Video className="w-5 h-5" />,
    gradient: 'from-red-600 to-orange-600',
    path: '/dashboard/videos'
  },
  {
    title: 'Audio Generation',
    description: 'Compose music and sounds',
    icon: <Music className="w-5 h-5" />,
    gradient: 'from-cyan-600 to-blue-600',
    path: '/dashboard/audio'
  },
  {
    title: 'Style Training',
    description: 'Train custom AI models',
    icon: <Palette className="w-5 h-5" />,
    gradient: 'from-emerald-600 to-teal-600',
    path: '/dashboard/styles'
  }
];

export default function DashboardHome() {
  const { user } = useAuth();
  
  // Get recent assets from mock API
  const recentAssets = mockApi.getAssets().slice(0, 4);

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-md">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">
              Welcome back, {user?.name || 'Creator'}! 👋
            </h1>
            <p className="text-sm text-white/70">
              Here's what's happening with your AI creations today.
            </p>
          </div>
          
          <div className="mt-3 lg:mt-0">
            <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-md flex items-center space-x-1 text-sm">
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">
              Quick Actions
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className={`bg-gradient-to-r ${action.gradient} p-2 rounded-lg inline-block mb-2 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-1">
                  {action.title}
                </h3>
                <p className="text-white/70 text-xs mb-2">
                  {action.description}
                </p>
                <div className="flex items-center justify-center space-x-1 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="font-semibold text-xs">Get Started</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Assets */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">
                Recent Assets
              </h2>
              <button className="text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1 transition-colors text-xs">
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentAssets.map((asset) => (
                <AssetCard key={asset.id} {...asset} />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">
              Activity Feed
            </h2>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 space-y-3">
              {[
                {
                  action: 'Generated new image',
                  item: 'Portrait_Style_v2.jpg',
                  time: '2 hours ago',
                  icon: <Image className="w-3.5 h-3.5" />,
                  color: 'text-purple-400'
                },
                {
                  action: 'Started video processing',
                  item: 'Cinematic_Reel.mp4',
                  time: '5 hours ago',
                  icon: <Video className="w-3.5 h-3.5" />,
                  color: 'text-red-400'
                },
                {
                  action: 'Completed style training',
                  item: 'Custom_Brand_Style',
                  time: '1 day ago',
                  icon: <Palette className="w-3.5 h-3.5" />,
                  color: 'text-emerald-400'
                },
                {
                  action: 'Generated audio track',
                  item: 'Ambient_Track.mp3',
                  time: '2 days ago',
                  icon: <Music className="w-3.5 h-3.5" />,
                  color: 'text-cyan-400'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className={`${activity.color} mt-0.5`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs">
                      {activity.action}
                    </p>
                    <p className="text-white/70 text-xs truncate">
                      {activity.item}
                    </p>
                    <p className="text-white/50 text-[10px]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}