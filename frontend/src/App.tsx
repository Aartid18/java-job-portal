import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Dashboard from './pages/Dashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

function AppRoutes() {
  const location = useLocation();

  return (
    <main className="relative z-10 flex-1 w-full">
      <div key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidate" element={<JobSeekerDashboard />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
        </Routes>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        <AnimatedBackground />
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
