import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/UserModule/Contexts/AuthContext';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
import LoadingSpinner from '@/CommonModule/Components/LoadingSpinner';
import { toast } from '@/CommonModule/Contexts/ToastContext';

import ImageModels from '@/ImageModule/Home/Pages/ImageModels';
import ImageGenerator from '@/ImageModule/Dashboard/Pages/ImageGenerator';
import ImageCanvas from '@/ImageModule/Dashboard/Pages/ImageCanvas';
import ImageManager from '@/ImageModule/Dashboard/Pages/ImageManager';

export default function ImageMain() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!user && !isLoading) {
    toast.info('You must be logged in to access this page', {
      subtext: 'Redirecting to login...',
      duration: 3000,
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Image Module..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ImageModels />} />
        <Route path="/generator" element={<ImageGenerator />} />
        <Route path="/canvas" element={<ImageCanvas />} />
        <Route path="/manager" element={<ImageManager />} />
      </Routes>
    </ErrorBoundary>
  );
}
