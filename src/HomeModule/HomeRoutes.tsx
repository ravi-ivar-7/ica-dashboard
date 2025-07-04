import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/UserModule/Contexts/AuthContext';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
import LoadingSpinner from '@/CommonModule/Components/LoadingSpinner';
import { toast } from '@/CommonModule/Contexts/ToastContext';

import Home from '@/HomeModule/Pages/Home';

export default function HomeMain() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!user && !isLoading) {
    toast.info('You must be logged in to access Home', {
      subtext: 'Redirecting to login...',
      duration: 3000,
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900">
        <LoadingSpinner size="lg" text="Loading Home..." />
      </div>
    );
  }


  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ErrorBoundary>
  );
}
