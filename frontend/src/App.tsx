import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AtmosphereBackground from './components/AtmosphereBackground';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AuthOnlyRoute from './components/AuthOnlyRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CursorZoneProvider } from './context/CursorZoneContext';
import { ReactiveCursor } from './components/ui';
import Dashboard from './pages/Dashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import OnboardingPage from './pages/OnboardingPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import JobBrowsePage from './pages/JobBrowsePage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SkillGapPage from './pages/SkillGapPage';
import { CareerRoadmapPage } from './pages/CareerRoadmapPage';
import AdminPage from './pages/AdminPage';
import NotificationsPage from './pages/NotificationsPage';

import { motion, AnimatePresence } from 'framer-motion';

function AppRoutes() {
  const location = useLocation();

  return (
    <main className="relative z-10 flex-1 w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full"
        >
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/onboarding"
              element={
                <AuthOnlyRoute>
                  <OnboardingPage />
                </AuthOnlyRoute>
              }
            />
            <Route
              path="/candidate"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <JobSeekerDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/career-roadmap"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <CareerRoadmapPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/career-roadmap"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <CareerRoadmapPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/resume-builder"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <ResumeBuilderPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/resume-analyzer"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <ResumeAnalyzerPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/jobs"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <JobBrowsePage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/jobs/:id"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <JobDetailPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <ApplicationsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/skill-gap"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN']}>
                  <SkillGapPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/candidate/notifications"
              element={
                <RoleProtectedRoute roles={['JOB_SEEKER', 'ADMIN', 'RECRUITER']}>
                  <NotificationsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <RoleProtectedRoute roles={['RECRUITER', 'ADMIN']}>
                  <RecruiterDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute roles={['ADMIN']}>
                  <AdminPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CursorZoneProvider>
            <div className="min-h-screen flex flex-col relative">
              <ReactiveCursor />
              <AtmosphereBackground />
              <Navbar />
              <AppRoutes />
            </div>
          </CursorZoneProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
