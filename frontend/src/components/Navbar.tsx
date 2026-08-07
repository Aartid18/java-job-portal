import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="nav-shell sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center gap-3 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 rounded-[4px]"
          >
            <span className="w-9 h-9 rounded-[12px] bg-brand text-surface flex items-center justify-center shadow-[var(--shadow-1)] transition-transform duration-150 group-hover:scale-105">
              <Briefcase size={18} />
            </span>
            <span className="font-display text-xl font-bold text-ink">AIJobPortal</span>
          </Link>
          <div className="flex gap-6 sm:gap-8">
            <Link
              to="/candidate"
              className={`nav-link ${pathname === '/candidate' ? 'is-active' : ''}`}
            >
              For Candidates
            </Link>
            <Link
              to="/recruiter"
              className={`nav-link ${pathname === '/recruiter' ? 'is-active' : ''}`}
            >
              For Recruiters
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
