import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AtmosphereBackground from './components/AtmosphereBackground';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AuthOnlyRoute from './components/AuthOnlyRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CursorZoneProvider } from './context/CursorZoneContext';
import SplashCursor from './components/effects/SplashCursor';
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

import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui';
import OpeningSplash from './components/reactbits/OpeningSplash';
import ErrorBoundary from './components/ui/ErrorBoundary';

function AppRoutes() {
  const location = useLocation();

  return (
    <main className="relative z-10 flex-1 w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
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
        </PageTransition>
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
            <div className="min-h-screen flex flex-col relative overflow-hidden">
              <ErrorBoundary>
                <OpeningSplash />
              </ErrorBoundary>
              <ErrorBoundary>
                <SplashCursor
                  SIM_RESOLUTION={96}
                  DYE_RESOLUTION={900}
                  CAPTURE_RESOLUTION={512}
                  DENSITY_DISSIPATION={3.8}
                  VELOCITY_DISSIPATION={2.2}
                  PRESSURE={0.1}
                  PRESSURE_ITERATIONS={15}
                  CURL={3}
                  SPLAT_RADIUS={0.18}
                  SPLAT_FORCE={4500}
                  SHADING={true}
                  COLOR_UPDATE_SPEED={10}
                  RAINBOW_MODE={false}
                  COLOR="#6366f1"
                  TRANSPARENT={true}
                />
              </ErrorBoundary>
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
