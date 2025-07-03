import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ConsentProvider } from './contexts/ConsentContext';
import { ToastProvider, setGlobalToastFunction, useToast } from './contexts/ToastContext';
import { BugReportProvider } from './contexts/BugReportContext';
import Navbar from '@/components/home/Navbar';
import Footer from './components/home/Footer';
import AuthModal from './components/global/AuthModal';
import SupportWidget from './components/global/SupportWidget';

// Pages
import Home from './pages/Home';
import ImageModels from './pages/ImageModels';
import VideoModels from './pages/VideoModels';
import AudioModels from './pages/AudioModels';
import Learn from './pages/Learn';
import Contact from './pages/Contact';
import DashboardMain from './pages/DashboardMain';
import Support from './pages/Support';
import ComingSoon from './pages/ComingSoon';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';

// Component to initialize global toast function
const ToastInitializer: React.FC = () => {
  const { showToast } = useToast();
  
  React.useEffect(() => {
    setGlobalToastFunction(showToast);
  }, [showToast]);
  
  return null;
};

function App() {
  return (
      <AuthProvider>
        <ConsentProvider>
          <ToastProvider>
            <BugReportProvider>
              <ToastInitializer />
              <Router>
                <div className="min-h-screen bg-black">
                  <Routes>
                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<DashboardMain />} />
                    <Route path="/dashboard/*" element={<DashboardMain />} />
                    
                    {/* Main Site Routes */}
                    <Route path="/*" element={
                      <>
                        <Navbar />
                        <main>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/image-models" element={<ImageModels />} />
                            <Route path="/video-models" element={<VideoModels />} />
                            <Route path="/audio-models" element={<AudioModels />} />
                            <Route path="/learn" element={<Learn />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/support" element={<Support />} />
                            
                            {/* Special pages */}
                            <Route path="/coming-soon" element={<ComingSoon />} />
                            <Route path="/error" element={<ErrorPage />} />
                            
                            {/* 404 - Must be last */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                        <AuthModal />
                        <SupportWidget />
                      </>
                    } />
                  </Routes>
                </div>
              </Router>
            </BugReportProvider>
          </ToastProvider>
        </ConsentProvider>
      </AuthProvider>
  );
}

export default App;