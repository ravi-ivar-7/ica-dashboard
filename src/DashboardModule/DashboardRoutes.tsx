import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/UserModule/Contexts/AuthContext';
import LoadingSpinner from '@/CommonModule/Components/LoadingSpinner';
import { toast } from '@/CommonModule/Contexts/ToastContext';

import DashboardHome from '@/DashboardModule/Pages/DashboardHome';

export default function DashboardMain() {
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
    toast.info('You must be logged in to access the dashboard', {
      subtext: 'Redirecting to login...',
      duration: 3000,
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  return (
        <Routes>
          <Route path="/" element={<DashboardHome />} />
        </Routes>
  );
}
