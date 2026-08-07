import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { authApi } from '../lib/authApi';
import { getErrorMessage } from '../lib/api';
import { isPasswordValid, scorePassword } from '../lib/password';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(params.get('token') ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => scorePassword(newPassword), [newPassword]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!isPasswordValid(newPassword)) {
      setError('Password does not meet security requirements');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword, confirmPassword });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to reset password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="ui-panel p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-label">Account recovery</p>
          <h1 className="text-h1 text-ink">Reset password</h1>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Reset token</span>
            <input className="ui-input !pl-4" value={token} onChange={(e) => setToken(e.target.value)} required />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">New password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="ui-input !pl-4 pr-20"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand font-medium"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {newPassword && (
              <p className="text-xs text-ink-muted">Strength: {strength.label}</p>
            )}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Confirm password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="ui-input !pl-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <PressButton type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </PressButton>
        </form>

        <p className="text-sm text-center">
          <Link to="/login" className="text-brand font-semibold">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
