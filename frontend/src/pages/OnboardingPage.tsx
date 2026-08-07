import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { useAuth, getErrorMessage } from '../context/AuthContext';
import { authApi } from '../lib/authApi';
import { tokenStorage } from '../lib/tokenStorage';

/** Phase 2 placeholder — full multi-step onboarding lands in Phase 3. */
export default function OnboardingPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const continueToApp = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.completeOnboarding();
      tokenStorage.updateUser(data);
      await refreshUser();
      if (data.role === 'RECRUITER') navigate('/recruiter', { replace: true });
      else if (data.role === 'ADMIN') navigate('/admin', { replace: true });
      else navigate('/candidate', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="ui-panel p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-label">Welcome{user?.fullName ? `, ${user.fullName}` : ''}</p>
          <h1 className="text-h1 text-ink">Let&apos;s build your career profile</h1>
          <p className="text-ink-muted">
            Multi-step onboarding (education, skills, experience, resume) arrives in Phase 3.
            Continue to your workspace for now.
          </p>
        </div>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <PressButton variant="primary" className="flex-1" onClick={() => void continueToApp()} disabled={loading}>
            {loading ? 'Opening…' : 'Continue to dashboard'}
          </PressButton>
          <PressButton variant="ghost" onClick={() => void logout()}>
            Sign out
          </PressButton>
        </div>
      </div>
    </div>
  );
}
