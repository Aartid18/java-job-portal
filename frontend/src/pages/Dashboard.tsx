import { useNavigate } from 'react-router-dom';
import PressButton from '../components/PressButton';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full text-center py-16 sm:py-20">
        <p className="reveal brand-mark text-sm font-bold uppercase tracking-[0.22em] text-primary mb-5">
          AIJobPortal
        </p>

        <h1 className="reveal reveal-delay-1 hero-brand mb-6">
          AIJobPortal
        </h1>

        <p className="reveal reveal-delay-2 hero-headline max-w-2xl mx-auto mb-4">
          Match talent to roles with explainable AI.
        </p>

        <p className="reveal reveal-delay-3 text-base sm:text-lg text-ink/60 max-w-xl mx-auto mb-10 leading-relaxed">
          Skills analysis, compatibility scoring, and clear ranking reasons — built for seekers and recruiters.
        </p>

        <div className="reveal reveal-delay-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
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
