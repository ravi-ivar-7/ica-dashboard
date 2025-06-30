import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, LogOut, ChevronDown, Settings, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  setIsMobileOpen: (open: boolean) => void;
}

export default function DashboardHeader({ setIsMobileOpen }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New Feature Available",
      message: "Try our new music generation model",
      time: "2 hours ago",
      read: false,
      type: "feature"
    },
    {
      id: 2,
      title: "Image Generated",
      message: "Your image 'Portrait_Style_v2.jpg' is ready",
      time: "5 hours ago",
      read: false,
      type: "success"
    },
    {
      id: 3,
      title: "Style Training Complete",
      message: "Your 'Cinematic Style' is ready to use",
      time: "1 day ago",
      read: true,
      type: "success"
    },
    {
      id: 4,
      title: "Pro Plan Expiring",
      message: "Your subscription will renew in 3 days",
      time: "2 days ago",
      read: true,
      type: "warning"
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-gray-900/80 border-white/20 backdrop-blur-xl border-b shadow-md">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Search Bar - Desktop */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-xl border rounded-lg pl-8 pr-3 py-1.5 w-64 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all"
            />
          </div>

          {/* Search Bar - Mobile (Expandable) */}
          <div className="md:hidden flex items-center">
            {isSearchExpanded ? (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-xl border rounded-lg pl-8 pr-3 py-1.5 w-48 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all"
                  autoFocus
                  onBlur={() => setIsSearchExpanded(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl p-2 z-50">
                <div className="flex items-center justify-between p-2 border-b border-white/10">
                  <h3 className="text-white font-bold text-sm">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 text-xs">2 unread</span>
                    <button className="text-white/60 hover:text-white text-xs hover:underline">
                      Mark all as read
                    </button>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${notification.read ? '' : 'bg-white/5'}`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          notification.type === 'success' ? 'bg-emerald-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'feature' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-xs">{notification.title}</p>
                          <p className="text-white/70 text-xs">{notification.message}</p>
                          <p className="text-white/50 text-[10px] mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 border-t border-white/10 mt-1">
                  <button className="w-full text-center text-purple-400 hover:text-purple-300 text-xs font-semibold py-1">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border-white/20 border transition-all duration-300 hover:scale-105"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-white font-semibold text-xs">
                  {user?.name || 'User'}
                </p>
                <p className="text-white/60 text-[10px]">
                  {user?.plan || 'Free'} Plan
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-white/60 hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl p-2 z-50">
                {/* User Info */}
                <div className="p-3 border-b border-white/10 mb-1">
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm">{user?.name || 'User'}</p>
                      <p className="text-white/60 text-xs">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 bg-white/10 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">{user?.plan || 'Free'} Plan</span>
                      <span className="text-purple-400 text-xs font-semibold">750/1000 credits</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-1">
                  
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white text-sm"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  
                  {/* Upgrade Button */}
                  {user?.plan === 'free' && (
                    <button
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold mt-1"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Upgrade to Pro</span>
                    </button>
                  )}
                  
                  <hr className="border-white/10 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-600/20 transition-colors text-red-400 w-full text-left text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}