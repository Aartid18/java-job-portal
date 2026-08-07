import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { authApi } from '../lib/authApi';
import { getErrorMessage } from '../lib/api';
import { isPasswordValid, scorePassword } from '../lib/password';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'JOB_SEEKER' | 'RECRUITER'>('JOB_SEEKER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);

  const strength = useMemo(() => scorePassword(password), [password]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!isPasswordValid(password)) {
      setError('Password does not meet security requirements');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.register({
        fullName,
        email,
        password,
        confirmPassword,
        accountType,
      });
      if (data.devToken) setDevToken(data.devToken);
      navigate('/verify-email', {
        state: { email, message: data.message, devToken: data.devToken },
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="ui-panel p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-label">Create account</p>
          <h1 className="text-h1 text-ink">Join AIJobPortal</h1>
          <p className="text-sm text-ink-muted">Build your career operating system.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Full name</span>
            <input
              className="ui-input !pl-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </label>

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

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-ink">Account type</legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ['JOB_SEEKER', 'Job Seeker'],
                  ['RECRUITER', 'Recruiter'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAccountType(value)}
                  className={`rounded-[12px] border px-3 py-3 text-sm font-semibold transition ${
                    accountType === value
                      ? 'border-brand bg-brand-muted text-brand'
                      : 'border-line bg-surface text-ink-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="ui-input !pl-4 pr-20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand font-medium"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Strength</span>
                  <span className="font-semibold text-ink">{strength.label}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all duration-300"
                    style={{ width: `${(strength.score / 6) * 100}%` }}
                  />
                </div>
              </div>
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
              autoComplete="new-password"
            />
          </label>

          {error && (
            <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-[12px] px-3 py-2" role="alert">
              {error}
            </p>
          )}

          <PressButton type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </PressButton>
        </form>

        {devToken && (
          <p className="text-xs text-ink-muted break-all">Dev verification token: {devToken}</p>
        )}

        <p className="text-sm text-ink-muted text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
