import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Button, IconButton } from './ui';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const seekerLinks = [
    { to: '/candidate', label: 'Dashboard' },
    { to: '/career-roadmap', label: 'Roadmap' },
    { to: '/candidate/jobs', label: 'Jobs' },
    { to: '/candidate/applications', label: 'Applications' },
    { to: '/candidate/resume-builder', label: 'Resume' },
    { to: '/onboarding', label: 'Profile' },
  ];
  const recruiterLinks = [{ to: '/recruiter', label: 'Recruiter Hub' }];
  const adminLinks = [
    { to: '/admin', label: 'Admin' },
    { to: '/recruiter', label: 'Recruiter' },
    { to: '/candidate', label: 'Candidate' },
  ];
  const roleLinks =
    user?.role === 'JOB_SEEKER'
      ? seekerLinks
      : user?.role === 'RECRUITER'
        ? recruiterLinks
        : user?.role === 'ADMIN'
          ? adminLinks
          : [];

  const close = () => setOpen(false);

  return (
    <nav className="nav-shell sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-[4px]"
            onClick={close}
          >
            <span
              className="w-9 h-9 rounded-[12px] text-white flex items-center justify-center shadow-[var(--shadow-1)]"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Briefcase size={18} />
            </span>
            <span className="font-display text-xl font-bold text-ink">AIJobPortal</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated &&
              roleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${pathname === link.to ? 'is-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}

            <NotificationBell />

            <IconButton label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className={`nav-link ${pathname === '/login' ? 'is-active' : ''}`}>
                  Sign in
                </Link>
                <Button variant="primary" className="!min-h-10 !px-4 !py-2 text-sm" onClick={() => navigate('/register')}>
                  Join
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Avatar name={user?.fullName || user?.email} />
                <span className="hidden lg:inline text-sm text-ink-muted truncate max-w-[140px]">
                  {user?.fullName || user?.email}
                </span>
                <Button
                  variant="ghost"
                  className="!min-h-10 !px-4 !py-2 text-sm"
                  onClick={() => void logout().then(() => navigate('/'))}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <NotificationBell />
            <IconButton label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
            <IconButton label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </IconButton>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-line py-4 space-y-3">
            {isAuthenticated &&
              roleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block nav-link py-2 ${pathname === link.to ? 'is-active' : ''}`}
                  onClick={close}
                >
                  {link.label}
                </Link>
              ))}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block nav-link py-2" onClick={close}>
                  Sign in
                </Link>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    close();
                    navigate('/register');
                  }}
                >
                  Join
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  close();
                  void logout().then(() => navigate('/'));
                }}
              >
                Sign out
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
