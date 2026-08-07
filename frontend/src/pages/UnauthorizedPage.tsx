import { Link } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const home =
    user?.role === 'RECRUITER' ? '/recruiter' : user?.role === 'ADMIN' ? '/admin' : '/candidate';

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
      <p className="text-label">Access denied</p>
      <h1 className="text-h1 text-ink">You cannot open this area</h1>
      <p className="text-ink-muted">
        Your account role does not include permission for this page.
      </p>
      <Link to={user ? home : '/login'}>
        <PressButton variant="primary">{user ? 'Go to my dashboard' : 'Sign in'}</PressButton>
      </Link>
    </div>
  );
}
