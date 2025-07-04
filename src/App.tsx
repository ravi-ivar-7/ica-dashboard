import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './UserModule/Contexts/AuthContext';
import { ConsentProvider } from './UserModule/Contexts/ConsentContext';
import { ToastProvider, setGlobalToastFunction, useToast } from './CommonModule/Contexts/ToastContext';
import { BugReportProvider } from './CommonModule/Contexts/BugReportContext';

// Layout Components
import Navbar from '@/CommonModule/Components/Navbar';
import Footer from './CommonModule/Components/Footer';
import AuthModal from './UserModule/Components/AuthModal';
import SupportWidget from './CommonModule/Components/SupportWidget';

// Feature Route Groups
import DashboardRoutes from './DashboardRoutes'; // <-- all /dashboard/*, /audio/*, etc.

// Public Pages
import Home from './HomeModule/Pages/Home';
import ImageModels from './ImageModule/Home/Pages/ImageModels';
import VideoModels from './VideoModule/Pages/VideoModels';
import AudioModels from './AudioModule/Home/Pages/AudioModels';
import Contact from './CommonModule/Pages/Contact';
import Support from './CommonModule/Pages/Support';
import ComingSoon from './CommonModule/Pages/ComingSoon';
import ErrorPage from './CommonModule/Pages/ErrorPage';
import NotFound from './CommonModule/Pages/NotFound';

// Component to register toast
const ToastInitializer: React.FC = () => {
  const { showToast } = useToast();
  React.useEffect(() => {
    setGlobalToastFunction(showToast);
  }, [showToast]);
  return null;
};

// Public Layout with Navbar/Footer
const PublicLayout: React.FC = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-models" element={<ImageModels />} />
        <Route path="/video-models" element={<VideoModels />} />
        <Route path="/audio-models" element={<AudioModels />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
    <AuthModal />
    <SupportWidget />
  </>
);

function App() {
  return (
    <AuthProvider>
      <ConsentProvider>
        <ToastProvider>
          <BugReportProvider>
            <ToastInitializer />
            <Router>
              <Routes>
                {/* All feature modules like /dashboard/* /audio/* etc. */}
                <Route path="/dashboard/*" element={<DashboardRoutes />} />

                {/* Public routes wrapped in layout */}
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </Router>
          </BugReportProvider>
        </ToastProvider>
      </ConsentProvider>
    </AuthProvider>
  );
}

export default App;
