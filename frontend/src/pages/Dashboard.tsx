import { useNavigate } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const primaryCta = () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    if (!user?.onboardingCompleted) {
      navigate('/onboarding');
      return;
    }
    if (user.role === 'RECRUITER') navigate('/recruiter');
    else navigate('/candidate');
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full py-16 sm:py-24">
        <p className="reveal text-label mb-6">AIJobPortal</p>

        <h1 className="reveal reveal-delay-1 text-display mb-6">Your Career Operating System</h1>

        <p className="reveal reveal-delay-2 font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-4 max-w-xl">
          Understand where you stand. Know which roles fit. Improve with clarity.
        </p>

        <p className="reveal reveal-delay-3 text-base sm:text-lg text-ink-muted max-w-lg mb-10 leading-relaxed">
          AI-powered career intelligence for job seekers and recruiters — matching, skill gaps, and
          resume insight in one platform.
        </p>

        <div className="reveal reveal-delay-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <PressButton variant="primary" onClick={primaryCta}>
            {isAuthenticated ? 'Open workspace' : 'Get started'}
          </PressButton>
          {!isAuthenticated && (
            <PressButton variant="ghost" onClick={() => navigate('/login')}>
              Sign in
            </PressButton>
          )}
        </div>
      </div>
    </section>
  );
}
