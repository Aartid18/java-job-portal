import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { authApi } from '../lib/authApi';
import { getErrorMessage } from '../lib/api';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const state = location.state as { email?: string; message?: string; devToken?: string } | null;

  const [email, setEmail] = useState(state?.email ?? '');
  const [token, setToken] = useState(params.get('token') ?? state?.devToken ?? '');
  const [message, setMessage] = useState(state?.message ?? 'Check your email to verify your account.');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      void verify(urlToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (value: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.verifyEmail(value);
      setSuccess(true);
      setMessage(data.message);
    } catch (err) {
      setError(getErrorMessage(err, 'Verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e: FormEvent) => {
    e.preventDefault();
    await verify(token);
  };

  const onResend = async () => {
    if (!email) {
      setError('Enter your email to resend verification');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.resendVerification(email);
      setMessage(data.message);
      if (data.devToken) setToken(data.devToken);
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
          <p className="text-label">Email verification</p>
          <h1 className="text-h1 text-ink">{success ? 'Verified' : 'Verify your email'}</h1>
          <p className="text-sm text-ink-muted">{message}</p>
        </div>

        {!success && (
          <form className="space-y-4" onSubmit={onVerify}>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Verification token</span>
              <input
                className="ui-input !pl-4"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </label>
            <PressButton type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify email'}
            </PressButton>
          </form>
        )}

        {success && (
          <Link to="/login" className="block">
            <PressButton variant="primary" className="w-full">
              Continue to sign in
            </PressButton>
          </Link>
        )}

        {!success && (
          <div className="space-y-3 border-t border-line pt-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Email for resend</span>
              <input
                type="email"
                className="ui-input !pl-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <PressButton type="button" variant="ghost" className="w-full" onClick={onResend} disabled={loading}>
              Resend verification email
            </PressButton>
          </div>
        )}

        {error && (
          <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-[12px] px-3 py-2" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
