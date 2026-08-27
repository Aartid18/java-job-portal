import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`nav-shell sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-black/5 backdrop-blur-xl border-b border-line/80' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-[4px] group"
            onClick={close}
          >
            <motion.span
              whileHover={{ rotate: 12, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-9 h-9 rounded-[12px] text-white flex items-center justify-center shadow-[var(--shadow-1)]"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Briefcase size={18} />
            </motion.span>
            <span className="font-display text-xl font-bold text-ink">Java Job Portal</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated &&
              roleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link relative ${pathname === link.to ? 'is-active' : ''}`}
                >
                  {link.label}
                  {pathname === link.to && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
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

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden border-t border-line py-4 space-y-3 overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
