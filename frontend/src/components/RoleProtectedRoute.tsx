import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth';
import ProtectedRoute from './ProtectedRoute';

export default function RoleProtectedRoute({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  return (
    <ProtectedRoute>
      {loading || !user ? (
        <div className="min-h-[50vh] flex items-center justify-center text-ink-muted">Loading…</div>
      ) : roles.includes(user.role) ? (
        <>{children}</>
      ) : (
        <Navigate to="/unauthorized" replace />
      )}
    </ProtectedRoute>
  );
}
