
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/DashboardModule/Components/DashboardLayout';
import ErrorBoundary from '@/CommonModule/Components/ErrorBoundary';
// Modular Feature Routes
import DashboardMain from '@/DashboardModule/DashboardRoutes';
import AudioMain from '@/AudioModule/AudioRoutes';
import VideoMain from '@/VideoModule/VideoRoutes';
import ImageMain from '@/ImageModule/ImageRoutes';
import CineFlowMain from '@/CineFlowModule/CineFlowRoutes';
import WorkflowMain from '@/WorkFlowModule/WorkFlowRoutes';
import TrainerMain from '@/TrainerModule/TrainerRoutes';
import AssetsMain from '@/AssetsModule/AssetsRoutes';
import UserSettings from './UserModule/Pages/UserSettings';


export default function DashboardRoutes() {
  return (
    <ErrorBoundary>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardMain />} />
          <Route path="/audio/*" element={<AudioMain />} />
          <Route path="/videos/*" element={<VideoMain />} />
          <Route path="/images/*" element={<ImageMain />} />
          <Route path="/cineflow/*" element={<CineFlowMain />} />
          <Route path="/workflow/*" element={<WorkflowMain />} />
          <Route path="/trainers/*" element={<TrainerMain />} />
          <Route path="/assets/*" element={<AssetsMain />} />
          <Route path='/settings' element ={<UserSettings/>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
