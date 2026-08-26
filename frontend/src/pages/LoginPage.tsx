import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, getErrorMessage } from '../context/AuthContext';
import FloatingInput from '../components/auth/FloatingInput';
import MagneticButton from '../components/auth/MagneticButton';
import { scaleIn, shakeVariants } from '../lib/motion';

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password, rememberMe);
      setSuccess(true);

      setTimeout(() => {
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
      }, 800);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in. Check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-muted/70 text-brand text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Welcome Back
          </div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">
            Sign In to Java Job Portal
          </h1>
          <p className="text-sm text-ink-muted">Access your candidate dashboard, job matches & applications.</p>
        </div>

        {/* Form Panel */}
        <motion.div
          variants={{ ...scaleIn, ...shakeVariants }}
          initial="hidden"
          animate={error ? 'shake' : 'visible'}
          className="rounded-2xl border border-line/80 bg-surface/85 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5 hover:shadow-2xl transition-all duration-300"
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <FloatingInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isValid={isEmailValid}
              required
              autoComplete="email"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <FloatingInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-semibold text-brand hover:text-brand-hover transition-colors px-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-ink-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-line text-brand focus:ring-brand/30"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-semibold text-brand hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-danger flex items-center gap-2"
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <MagneticButton type="submit" loading={loading} success={success} className="w-full">
              Sign In
            </MagneticButton>
          </form>

          {/* Social Sign-in simulator */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative bg-surface px-3 text-[11px] uppercase font-semibold text-ink-faint">
                Quick Demo Auth
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={async () => {
                  setEmail('candidate@example.com');
                  setPassword('Password123!');
                  setLoading(true);
                  setError('');
                  try {
                    await login('candidate@example.com', 'Password123!', true);
                    setSuccess(true);
                    setTimeout(() => navigate('/candidate', { replace: true }), 400);
                  } catch (err) {
                    setError(getErrorMessage(err, 'Demo login failed'));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-2.5 px-2 rounded-xl border border-brand/30 bg-brand/5 hover:bg-brand/15 text-[12px] font-semibold text-brand transition-all cursor-pointer text-center shadow-xs flex items-center justify-center gap-1"
              >
                <span>👤</span> Seeker
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEmail('recruiter@example.com');
                  setPassword('Password123!');
                  setLoading(true);
                  setError('');
                  try {
                    await login('recruiter@example.com', 'Password123!', true);
                    setSuccess(true);
                    setTimeout(() => navigate('/recruiter', { replace: true }), 400);
                  } catch (err) {
                    setError(getErrorMessage(err, 'Demo login failed'));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-2.5 px-2 rounded-xl border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/15 text-[12px] font-semibold text-violet-600 dark:text-violet-400 transition-all cursor-pointer text-center shadow-xs flex items-center justify-center gap-1"
              >
                <span>🏢</span> Recruiter
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEmail('admin@example.com');
                  setPassword('Password123!');
                  setLoading(true);
                  setError('');
                  try {
                    await login('admin@example.com', 'Password123!', true);
                    setSuccess(true);
                    setTimeout(() => navigate('/admin', { replace: true }), 400);
                  } catch (err) {
                    setError(getErrorMessage(err, 'Demo login failed'));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="py-2.5 px-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/15 text-[12px] font-semibold text-cyan-600 dark:text-cyan-400 transition-all cursor-pointer text-center shadow-xs flex items-center justify-center gap-1"
              >
                <span>⚡</span> Admin
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-ink-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
