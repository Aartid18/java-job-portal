import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { authApi } from '../lib/authApi';
import { getErrorMessage } from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.forgotPassword(email);
      setMessage(data.message);
      setDevToken(data.devToken ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="ui-panel p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-label">Account recovery</p>
          <h1 className="text-h1 text-ink">Forgot password</h1>
          <p className="text-sm text-ink-muted">We will send a reset link if the email exists.</p>
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
            />
          </label>
          {message && <p className="text-sm text-success">{message}</p>}
          {devToken && (
            <p className="text-xs text-ink-muted break-all">
              Dev reset token: {devToken}.{' '}
              <Link className="text-brand font-semibold" to={`/reset-password?token=${devToken}`}>
                Open reset page
              </Link>
            </p>
          )}
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <PressButton type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
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
