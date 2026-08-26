import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import { authApi } from '../lib/authApi';
import { getErrorMessage } from '../context/AuthContext';
import { isPasswordValid } from '../lib/password';
import FloatingInput from '../components/auth/FloatingInput';
import PasswordStrengthCheck from '../components/auth/PasswordStrengthCheck';
import MagneticButton from '../components/auth/MagneticButton';
import RegistrationHeroVisual from '../components/auth/RegistrationHeroVisual';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'JOB_SEEKER' | 'RECRUITER'>('JOB_SEEKER');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);

  // Field Validations
  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPassValid = isPasswordValid(password);
  const isConfirmValid = confirmPassword.length > 0 && confirmPassword === password;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981'],
      });
    } catch {
      // ignore if canvas is disabled
    }
  };

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
      setSuccess(true);
      triggerConfetti();

      // Automatically log the user in fallback session mode or navigate
      setTimeout(() => {
        navigate('/verify-email', {
          state: { email, message: data.message, devToken: data.devToken },
        });
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  // Cinematic Entry Stagger Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Premium SaaS Registration Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 xl:col-span-5 space-y-6"
        >
          {/* Header Reveal */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-muted/70 text-brand text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Developer Ecosystem
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink">
              Create Your Account
            </h1>
            <p className="text-sm text-ink-muted leading-relaxed">
              Join thousands of Java developers, engineers, and top tech recruiters on the leading recruitment platform.
            </p>
          </motion.div>

          {/* Registration Form Panel */}
          <motion.div
            variants={itemVariants}
            className="group relative rounded-2xl border border-line/80 bg-surface/85 backdrop-blur-xl p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-brand/30"
          >
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Account Type Selector (Job Seeker / Recruiter) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  I am registering as
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-2/80 border border-line/60">
                  <button
                    type="button"
                    onClick={() => setAccountType('JOB_SEEKER')}
                    className={`relative py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-250 cursor-pointer ${
                      accountType === 'JOB_SEEKER'
                        ? 'bg-surface text-brand shadow-sm border border-line/80'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('RECRUITER')}
                    className={`relative py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-250 cursor-pointer ${
                      accountType === 'RECRUITER'
                        ? 'bg-surface text-brand shadow-sm border border-line/80'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Recruiter / Employer
                  </button>
                </div>
              </div>

              {/* Full Name Field */}
              <FloatingInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isValid={isNameValid}
                required
                autoComplete="name"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              {/* Email Address Field */}
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

              {/* Password Field */}
              <div className="space-y-1">
                <FloatingInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  isValid={isPassValid}
                  required
                  autoComplete="new-password"
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
                <PasswordStrengthCheck password={password} isVisible={isPasswordFocused} />
              </div>

              {/* Confirm Password Field */}
              <FloatingInput
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isValid={isConfirmValid}
                isInvalid={confirmPassword.length > 0 && confirmPassword !== password}
                required
                autoComplete="new-password"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
              />

              {/* Error Alert */}
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

              {/* Magnetic Submit Button */}
              <div className="pt-2">
                <MagneticButton
                  type="submit"
                  loading={loading}
                  success={success}
                  className="w-full"
                >
                  Create Account
                </MagneticButton>
              </div>
            </form>

            {/* Dev verification token indicator if applicable */}
            {devToken && (
              <div className="mt-3 p-2 rounded-lg bg-surface-2 text-[11px] font-mono text-ink-muted break-all">
                Dev Verification Token: {devToken}
              </div>
            )}

            {/* Social / Clerk Auth Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-line/80" />
              <span className="text-[11px] uppercase tracking-wider text-ink-faint font-semibold">Or continue with</span>
              <div className="h-px flex-1 bg-line/80" />
            </div>

            {/* Social / Clerk Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  // Fallback social sign-in simulator
                  setFullName('Developer');
                  setEmail('developer@example.com');
                  setPassword('DevPassword123!');
                  setConfirmPassword('DevPassword123!');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-line bg-surface hover:bg-surface-2 text-xs font-semibold text-ink transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFullName('Java Engineer');
                  setEmail('engineer@github.com');
                  setPassword('DevPassword123!');
                  setConfirmPassword('DevPassword123!');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-line bg-surface hover:bg-surface-2 text-xs font-semibold text-ink transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </motion.div>

          {/* Already registered Footer link */}
          <motion.p variants={itemVariants} className="text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Sign in here
            </Link>
          </motion.p>
        </motion.div>

        {/* Right Side: Dynamic Animated Visual Composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 xl:col-span-7 h-full flex items-center"
        >
          <RegistrationHeroVisual />
        </motion.div>
      </div>
    </div>
  );
}
