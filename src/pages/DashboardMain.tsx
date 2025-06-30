import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorBoundary from '../components/dashboard/ErrorBoundary';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import LoadingSpinner from '../components/dashboard/LoadingSpinner';

// Dashboard Pages
import DashboardHome from './dashboard/DashboardHome';
import DashboardGallery from './dashboard/DashboardGallery';
import DashboardStyles from './dashboard/DashboardStyles';
import DashboardSettings from './dashboard/DashboardSettings';

// Image Pages
import DashboardImages from './dashboard/DashboardImages';
import ImageGenerator from './dashboard/image/ImageGenerator';
import ImageCanvas from './dashboard/image/ImageCanvas';
import ImageManager from './dashboard/image/ImageManager';

// Video Pages
import DashboardVideos from './dashboard/DashboardVideos';
import VideoGenerator from './dashboard/video/VideoGenerator';
import VideoEditor from './dashboard/video/VideoEditor';
import VideoThumbnail from './dashboard/video/VideoThumbnail';
import VideoManager from './dashboard/video/VideoManager';

// CineFlow Pages
import CineFlowHome from './dashboard/cineflow/CineFlowHome';
import CineFlowEditor from './dashboard/cineflow/CineFlowEditor';

// Audio Pages
import DashboardAudio from './dashboard/DashboardAudio';
import VoiceGenerator from './dashboard/audio/VoiceGenerator';
import MusicGenerator from './dashboard/audio/MusicGenerator';
import AudioEditor from './dashboard/audio/AudioEditor';
import AudioVisualizer from './dashboard/audio/AudioVisualizer';
import AudioManager from './dashboard/audio/AudioManager';

export default function DashboardMain() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect to login if not authenticated
  if (!user && !isLoading) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<DashboardHome />} />
          <Route path="/gallery" element={<DashboardGallery />} />
          <Route path="/styles" element={<DashboardStyles />} />
          <Route path="/settings" element={<DashboardSettings />} />
          
          {/* Image Routes */}
          <Route path="/images" element={<DashboardImages />} />
          <Route path="/images/manager" element={<ImageManager />} />
          <Route path="/images/generator" element={<ImageGenerator />} />
          <Route path="/images/canvas" element={<ImageCanvas />} />
          
          {/* Video Routes */}
          <Route path="/videos" element={<DashboardVideos />} />
          <Route path="/videos/manager" element={<VideoManager />} />
          <Route path="/videos/generator" element={<VideoGenerator />} />
          <Route path="/videos/editor" element={<VideoEditor />} />
          <Route path="/videos/thumbnail" element={<VideoThumbnail />} />
          
          {/* CineFlow Routes */}
          <Route path="/cineflow" element={<CineFlowHome />} />
          <Route path="/cineflow/editor/:id" element={<CineFlowEditor />} />
          
          {/* Audio Routes */}
          <Route path="/audio" element={<DashboardAudio />} />
          <Route path="/audio/manager" element={<AudioManager />} />
          <Route path="/audio/voice" element={<VoiceGenerator />} />
          <Route path="/audio/music" element={<MusicGenerator />} />
          <Route path="/audio/editor" element={<AudioEditor />} />
          <Route path="/audio/visualizer" element={<AudioVisualizer />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ErrorBoundary>
  );
}