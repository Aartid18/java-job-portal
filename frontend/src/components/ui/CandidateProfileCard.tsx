import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface CandidateProfileCardProps {
  readinessScore?: number;
  skills?: string[];
  roleTitle?: string;
  onEditProfile?: () => void;
}

export function CandidateProfileCard({
  readinessScore = 85,
  skills = ['Java 21', 'Spring Boot 3', 'Microservices', 'Kafka', 'Docker'],
  roleTitle = 'Senior Java Engineer Candidate',
  onEditProfile,
}: CandidateProfileCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const displayName = user?.fullName || 'Java Developer Candidate';
  const displayEmail = user?.email || 'candidate@javajobportal.com';
  const layoutId = 'candidate-welcome-profile-card';

  // Generated gradient avatar fallback
  const avatarGradient = 'from-brand/80 via-violet-600/80 to-cyan-500/80';

  return (
    <>
      {/* Closed State Card with Phase 1 Motion Proof Test */}
      <motion.div
        layoutId={layoutId}
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative min-h-[220px] sm:min-h-[250px] w-full overflow-hidden rounded-3xl border border-line/80 bg-surface/85 backdrop-blur-xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-shadow group flex flex-col justify-between"
        whileHover={{ y: -3, scale: 1.008 }}
      >
        {/* Subtle Ambient Background Orbs */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand/10 blur-3xl group-hover:bg-brand/20 transition-colors pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-violet-500/10 blur-3xl group-hover:bg-violet-500/20 transition-colors pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              layoutId={`avatar-${layoutId}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xl sm:text-2xl font-bold font-display shadow-lg border border-white/20 shrink-0`}
            >
              {displayName.charAt(0).toUpperCase()}
            </motion.div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-muted/70 text-brand text-[11px] font-bold uppercase tracking-wider">
                Candidate Profile
              </span>
              <motion.h2 layoutId={`title-${layoutId}`} className="text-xl sm:text-2xl font-extrabold font-display text-ink tracking-tight">
                {displayName}
              </motion.h2>
              <motion.p layoutId={`subtitle-${layoutId}`} className="text-xs sm:text-sm font-medium text-ink-muted">
                {roleTitle}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider block">Readiness</span>
              <span className="text-xl font-extrabold text-brand font-display">{readinessScore}%</span>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-surface border border-line text-xs font-semibold text-ink group-hover:border-brand/50 transition-colors">
              Click to Expand →
            </span>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-line/50 flex flex-wrap items-center justify-between gap-2 mt-4">
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((s) => (
              <span key={s} className="px-2.5 py-0.5 rounded-lg bg-surface-2 text-ink-muted text-[11px] font-medium border border-line/40">
                {s}
              </span>
            ))}
          </div>
          <span className="text-xs text-brand font-semibold group-hover:underline">
            View Career Details & Setup
          </span>
        </div>
      </motion.div>

      {/* Expanded State Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/75"
            />

            {/* Expanded Modal Box */}
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-3xl max-h-[85vh] bg-surface rounded-3xl overflow-hidden border border-line/80 z-10 p-6 sm:p-8 shadow-2xl flex flex-col overflow-y-auto custom-scrollbar"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center bg-surface-2 hover:bg-line rounded-full border border-line text-ink transition-colors cursor-pointer z-20"
                aria-label="Close profile modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-line">
                <motion.div
                  layoutId={`avatar-${layoutId}`}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-3xl font-bold font-display shadow-xl border border-white/20 shrink-0`}
                >
                  {displayName.charAt(0).toUpperCase()}
                </motion.div>

                <div className="space-y-1.5 grow">
                  <span className="px-3 py-1 rounded-full bg-brand-muted text-brand text-xs font-bold uppercase tracking-wider">
                    Verified Candidate Account
                  </span>
                  <motion.h2 layoutId={`title-${layoutId}`} className="text-2xl sm:text-3xl font-extrabold font-display text-ink tracking-tight">
                    {displayName}
                  </motion.h2>
                  <motion.p layoutId={`subtitle-${layoutId}`} className="text-sm font-medium text-ink-muted">
                    {roleTitle} · {displayEmail}
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.15 }}
                className="py-6 space-y-6 text-sm text-ink-muted grow"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-2 border border-line/60">
                  <div>
                    <span className="text-xs text-ink-faint uppercase font-bold block mb-1">Career Readiness</span>
                    <span className="text-2xl font-extrabold font-display text-brand">{readinessScore}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink-faint uppercase font-bold block mb-1">ATS Score</span>
                    <span className="text-2xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">92/100</span>
                  </div>
                  <div>
                    <span className="text-xs text-ink-faint uppercase font-bold block mb-1">Status</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md bg-emerald-500/10 inline-block mt-1">
                      Ready to Apply
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-ink tracking-tight uppercase">Verified Technical Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-brand-muted/50 text-brand text-xs font-semibold border border-brand/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-ink tracking-tight uppercase">Career Goals & Setup</h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Targeting High-Throughput Java 21, Spring Boot Microservices, and Cloud Native Backend roles across Enterprise Tech Companies.
                  </p>
                </div>
              </motion.div>

              <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onEditProfile) onEditProfile();
                    else navigate('/onboarding');
                  }}
                  className="px-6 py-2.5 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand/90 transition-all shadow-md cursor-pointer"
                >
                  Edit Career Profile & Setup →
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 bg-surface-2 text-ink-muted hover:text-ink text-xs font-semibold rounded-xl border border-line transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
