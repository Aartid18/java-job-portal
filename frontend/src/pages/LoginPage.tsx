import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { useAuth, getErrorMessage } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password, rememberMe);
      if (!user.onboardingCompleted) {
        navigate('/onboarding', { replace: true });
        return;
      }
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (user.role === 'RECRUITER') navigate('/recruiter', { replace: true });
      else if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else navigate('/candidate', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="ui-panel p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-label">Welcome back</p>
          <h1 className="text-h1 text-ink">Sign in</h1>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              className="ui-input !pl-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="ui-input !pl-4 pr-20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand font-medium"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-ink-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-line"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-brand font-semibold">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-[12px] px-3 py-2" role="alert">
              {error}
            </p>
          )}

          <PressButton type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Signing you in…' : 'Sign in'}
          </PressButton>
        </form>

        <p className="text-sm text-ink-muted text-center">
          New here?{' '}
          <Link to="/register" className="text-brand font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
