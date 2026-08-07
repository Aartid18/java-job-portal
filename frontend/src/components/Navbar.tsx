import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 rounded-none border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl">
            <Briefcase size={28} />
            <span>AIJobPortal</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/candidate" className="text-slate-600 hover:text-primary transition font-medium">For Candidates</Link>
            <Link to="/recruiter" className="text-slate-600 hover:text-primary transition font-medium">For Recruiters</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
