import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/UserModule/Contexts/AuthContext';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
import LoadingSpinner from '@/CommonModule/Components/LoadingSpinner';
import { toast } from '@/CommonModule/Contexts/ToastContext';

// Audio Pages
import AudioModels from '@/AudioModule/Home/Pages/AudioModels';
import VoiceGenerator from '@/AudioModule/Dashboard/Pages/VoiceGenerator';
import MusicGenerator from '@/AudioModule/Dashboard/Pages/MusicGenerator';
import AudioEditor from '@/AudioModule/Dashboard/Pages/AudioEditor';
import AudioVisualizer from '@/AudioModule/Dashboard/Pages/AudioVisualizer';
import AudioManager from '@/AudioModule/Dashboard/Pages/AudioManager';

export default function AudioMain() {
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
                <LoadingSpinner size="lg" text="Loading Audio Module..." />
            </div>
        );
    }


    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<AudioModels />} />
                <Route path="/voice" element={<VoiceGenerator />} />
                <Route path="/music" element={<MusicGenerator />} />
                <Route path="/editor" element={<AudioEditor />} />
                <Route path="/visualizer" element={<AudioVisualizer />} />
                <Route path="/manager" element={<AudioManager />} />
            </Routes>
        </ErrorBoundary>
    );
}
