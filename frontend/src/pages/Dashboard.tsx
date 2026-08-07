import { useNavigate } from 'react-router-dom';
import PressButton from '../components/PressButton';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full py-16 sm:py-24">
        <p className="reveal text-label mb-6">AIJobPortal</p>

        <h1 className="reveal reveal-delay-1 text-display mb-6">
          AIJobPortal
        </h1>

        <p className="reveal reveal-delay-2 font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-4 max-w-xl">
          Match talent to roles with explainable AI.
        </p>

        <p className="reveal reveal-delay-3 text-base sm:text-lg text-ink-muted max-w-lg mb-10 leading-relaxed">
          Skills analysis, compatibility scoring, and clear ranking reasons — built for seekers and recruiters.
        </p>

        <div className="reveal reveal-delay-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <PressButton variant="primary" onClick={() => navigate('/candidate')}>
            I am a Job Seeker
          </PressButton>
          <PressButton variant="ghost" onClick={() => navigate('/recruiter')}>
            I am a Recruiter
          </PressButton>
        </div>
      </div>
    </section>
  );
}
