import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="nav-shell sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5 text-ink group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
              <Briefcase size={18} />
            </span>
            <span className="brand-mark text-xl font-bold tracking-tight">
              AIJobPortal
            </span>
          </Link>
          <div className="flex gap-6 sm:gap-8">
            <Link
              to="/candidate"
              className={`nav-link text-sm sm:text-base ${pathname === '/candidate' ? 'is-active' : ''}`}
            >
              For Candidates
            </Link>
            <Link
              to="/recruiter"
              className={`nav-link text-sm sm:text-base ${pathname === '/recruiter' ? 'is-active' : ''}`}
            >
              For Recruiters
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
