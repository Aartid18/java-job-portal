import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AtmosphereBackground from './components/AtmosphereBackground';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AuthOnlyRoute from './components/AuthOnlyRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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

function AppRoutes() {
  const location = useLocation();

  return (
    <main className="relative z-10 flex-1 w-full">
      <div key={location.pathname} className="page-enter">
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
            path="/recruiter"
            element={
              <RoleProtectedRoute roles={['RECRUITER', 'ADMIN']}>
                <RecruiterDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col relative">
            <AtmosphereBackground />
            <Navbar />
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
