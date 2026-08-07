import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PressButton from './PressButton';

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="nav-shell sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-[4px]"
          >
            <span className="w-9 h-9 rounded-[12px] bg-brand text-surface flex items-center justify-center shadow-[var(--shadow-1)]">
              <Briefcase size={18} />
            </span>
            <span className="font-display text-xl font-bold text-ink">AIJobPortal</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {isAuthenticated && user?.role === 'JOB_SEEKER' && (
              <Link to="/candidate" className={`nav-link ${pathname === '/candidate' ? 'is-active' : ''}`}>
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'RECRUITER' && (
              <Link to="/recruiter" className={`nav-link ${pathname === '/recruiter' ? 'is-active' : ''}`}>
                Recruiter Hub
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link to="/login" className={`nav-link ${pathname === '/login' ? 'is-active' : ''}`}>
                  Sign in
                </Link>
                <PressButton variant="primary" className="!min-h-10 !px-4 !py-2 text-sm" onClick={() => navigate('/register')}>
                  Join
                </PressButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-ink-muted truncate max-w-[140px]">
                  {user?.fullName || user?.email}
                </span>
                <PressButton variant="ghost" className="!min-h-10 !px-4 !py-2 text-sm" onClick={() => void logout().then(() => navigate('/'))}>
                  Sign out
                </PressButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
