import React, { useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, Save, Trash2, LogOut, Check, X, Info } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import ErrorBoundary from '../../../components/dashboard/ErrorBoundary';
import { toast } from '../../../contexts/ToastContext';

// Settings help text definitions
const settingsHelpText = {
  account: {
    name: "Your display name visible to other users",
    email: "Your primary contact email for notifications and account recovery",
    bio: "A brief description about yourself visible on your public profile",
    website: "Your personal or business website URL",
    twitter: "Your Twitter/X handle (e.g., @username)",
    instagram: "Your Instagram handle (e.g., @username)"
  },
  notifications: {
    emailNotifications: "Receive important updates and information via email",
    pushNotifications: "Get real-time alerts in your browser",
    weeklyDigest: "Receive a weekly summary of your activity and platform updates",
    productUpdates: "Be notified about new features, models, and platform improvements"
  },
  privacy: {
    profileVisibility: "Control who can see your profile and generated content",
    dataSharing: "Allow anonymous usage data to help improve our services",
    analytics: "Enable collection of usage statistics to enhance your experience",
    twoFactorAuth: "Add an extra layer of security to your account with 2FA",
    loginAlerts: "Receive notifications when your account is accessed from a new device"
  },
  billing: {
    plan: "Your current subscription plan and billing cycle",
    nextBilling: "When your next payment will be processed",
    paymentMethod: "Your default payment method for subscription charges",
    billingHistory: "View your past transactions and payment receipts"
  }
};

export default function DashboardSettings() {
  const { user, logout } = useAuth();
  
  const [activeSection, setActiveSection] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'AI-powered content creator passionate about automation and efficiency.',
    website: 'https://mywebsite.com',
    twitter: '@myhandle',
    instagram: '@myhandle'
  });
  
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    productUpdates: false,
    
    // Privacy settings
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true,
    
    // Security settings
    twoFactorAuth: false,
    loginAlerts: true
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSave = () => {
    // In a real app, we would call the API to update the user profile
    // For demo purposes, just show a toast
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Setting updated successfully');
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requested. Please contact support to complete this process.');
    }
  };

  const renderHelpTooltip = (section: string, field: string) => {
    const helpText = settingsHelpText[section as keyof typeof settingsHelpText]?.[field as any];
    if (!helpText) return null;
    
    return (
      <div className="relative inline-block ml-1">
        <button
          type="button"
          className="text-white/60 hover:text-white/80 transition-colors focus:outline-none"
          onMouseEnter={() => setShowTooltip(`${section}-${field}`)}
          onMouseLeave={() => setShowTooltip(null)}
          onClick={() => setShowTooltip(showTooltip === `${section}-${field}` ? null : `${section}-${field}`)}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
        
        {showTooltip === `${section}-${field}` && (
          <div className="absolute z-10 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg text-xs text-white/90 left-0 top-full mt-1">
            {helpText}
            <div className="absolute w-2 h-2 bg-gray-900 border-t border-l border-white/20 transform rotate-45 -top-1 left-2"></div>
          </div>
        )}
      </div>
    );
  };

  const renderAccountSettings = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-400" />
          Account Information
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
              Full Name
              {renderHelpTooltip('account', 'name')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 text-base"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
              Email Address
              {renderHelpTooltip('account', 'email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
            Bio
            {renderHelpTooltip('account', 'bio')}
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={3}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 resize-none text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
              Website
              {renderHelpTooltip('account', 'website')}
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 text-base"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
              Twitter
              {renderHelpTooltip('account', 'twitter')}
            </label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
            Instagram
            {renderHelpTooltip('account', 'instagram')}
          </label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all disabled:opacity-50 text-base"
          />
        </div>

        {isEditing && (
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 text-base"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-5 border-t border-white/20">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
          <Trash2 className="w-5 h-5 mr-2 text-red-400" />
          Danger Zone
        </h3>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600/20 text-red-400 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-600/30 transition-colors border border-red-500/40 text-base"
        >
          Delete Account
        </button>
        <p className="text-white/50 text-sm mt-2">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center">
        <Bell className="w-5 h-5 mr-2 text-purple-400" />
        Notification Preferences
      </h2>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
          { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in your browser' },
          { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of your activity' },
          { key: 'productUpdates', label: 'Product Updates', description: 'Be notified about new features and updates' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <h4 className="text-white font-semibold text-base flex items-center">
                {item.label}
                {renderHelpTooltip('notifications', item.key)}
              </h4>
              <p className="text-white/60 text-sm">{item.description}</p>
            </div>
            <button
              onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[item.key as keyof typeof settings] ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-purple-400" />
        Privacy & Security
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center">
            Profile Visibility
            {renderHelpTooltip('privacy', 'profileVisibility')}
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-base"
          >
            <option value="public" className="bg-gray-900">Public</option>
            <option value="private" className="bg-gray-900">Private</option>
            <option value="friends" className="bg-gray-900">Friends Only</option>
          </select>
        </div>
        
        {[
          { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing of anonymized usage data' },
          { key: 'analytics', label: 'Analytics', description: 'Help improve our service with usage analytics' },
          { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
          { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified when someone logs into your account' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <h4 className="text-white font-semibold text-base flex items-center">
                {item.label}
                {renderHelpTooltip('privacy', item.key)}
              </h4>
              <p className="text-white/60 text-sm">{item.description}</p>
            </div>
            <button
              onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[item.key as keyof typeof settings] ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
        Subscription & Billing
      </h2>
      
      <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-white font-bold text-lg flex items-center">
              Current Plan
              {renderHelpTooltip('billing', 'plan')}
            </h4>
            <p className="text-white/60 text-base">{user?.plan.toUpperCase()} Plan</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            user?.plan === 'free' ? 'bg-gray-600/20 text-gray-400' :
            user?.plan === 'pro' ? 'bg-purple-600/20 text-purple-400' :
            'bg-yellow-600/20 text-yellow-400'
          }`}>
            {user?.plan === 'free' ? 'Free' : user?.plan === 'pro' ? '$97/month' : '$197/month'}
          </div>
        </div>
        
        {user?.plan !== 'free' && (
          <div className="text-white/60 text-base mb-4 flex items-center">
            <span>Next billing date: February 15, 2025</span>
            {renderHelpTooltip('billing', 'nextBilling')}
          </div>
        )}
        
        <div className="flex space-x-4">
          {user?.plan === 'free' ? (
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 text-base">
              Upgrade to Pro
            </button>
          ) : (
            <>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 text-base">
                Change Plan
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border-white/20 border font-semibold px-6 py-2.5 rounded-xl transition-colors text-base">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h4 className="text-white font-bold text-lg mb-4 flex items-center">
          Billing History
          {renderHelpTooltip('billing', 'billingHistory')}
        </h4>
        <div className="space-y-3">
          {user?.plan !== 'free' ? (
            <>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/80 text-base">January 15, 2025</span>
                <span className="text-emerald-400 font-semibold text-base">$97.00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/80 text-base">December 15, 2024</span>
                <span className="text-emerald-400 font-semibold text-base">$97.00</span>
              </div>
            </>
          ) : (
            <p className="text-white/60 text-center py-4 text-base">
              No billing history available
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 p-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-400" />
              Settings
            </h3>
            <nav className="space-y-2">
              {[
                { id: 'account', title: 'Account', description: 'Manage account info', icon: <User className="w-5 h-5" /> },
                { id: 'notifications', title: 'Notifications', description: 'Control notifications', icon: <Bell className="w-5 h-5" /> },
                { id: 'privacy', title: 'Privacy & Security', description: 'Manage privacy settings', icon: <Shield className="w-5 h-5" /> },
                { id: 'billing', title: 'Billing', description: 'Manage subscription', icon: <CreditCard className="w-5 h-5" /> }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeSection === section.id
                      ? 'bg-purple-600/30 border border-purple-500/50 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section.icon}
                  <div>
                    <div className="font-semibold text-base">{section.title}</div>
                    <div className="text-sm text-white/50 hidden md:block">{section.description}</div>
                  </div>
                </button>
              ))}
            </nav>
            
            <div className="mt-5 pt-4 border-t border-white/20">
              <button
                onClick={logout}
                className="w-full bg-red-600/20 text-red-400 font-semibold px-4 py-2.5 rounded-xl hover:bg-red-600/30 transition-colors flex items-center space-x-2 justify-center text-base"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg">
            {renderContent()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}