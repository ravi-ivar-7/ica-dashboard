import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/UserModule/Contexts/AuthContext';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
import LoadingSpinner from '@/CommonModule/Components/LoadingSpinner';
import { toast } from '@/CommonModule/Contexts/ToastContext';

import ComingSoon from '@/CommonModule/Pages/ComingSoon';
import Contact from '@/CommonModule/Pages/Contact';
import ErrorPage from '@/CommonModule/Pages/ErrorPage';
import NotFound from '@/CommonModule/Pages/NotFound';
import Support from '@/CommonModule/Pages/Support';

export default function CommonMain() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

//   if (!user && !isLoading) {
//     toast.info('You must be logged in to access this page', {
//       subtext: 'Redirecting to login...',
//       duration: 3000,
//     });
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }


  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
