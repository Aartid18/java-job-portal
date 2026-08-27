import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  Bot,
  Compass,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PressButton from '../components/PressButton';
import LiveActivityFeed from '../components/LiveActivityFeed';
import LiveDot from '../components/LiveDot';
import { EmptyState, Skeleton, StatCard, AnimatedSection, ErrorBoundary, CandidateProfileCard, ViewportReveal } from '../components/ui';
import MaskedHeading from '../components/reactbits/MaskedHeading';
import { CareerCopilotDrawer } from '../components/CareerCopilotDrawer';
import { getErrorMessage } from '../lib/api';
import { candidateApi, type CandidateDashboard } from '../lib/candidateApi';

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const start = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);
  return value;
}

function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const animated = useCountUp(percent, true);
  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96" aria-hidden>
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgb(79 70 229 / 0.15)" strokeWidth="8" />
          <circle
            cx="48"
            cy="48"
            r={r}
            fill="none"
            stroke="url(#readinessGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.2s linear' }}
          />
          <defs>
            <linearGradient id="readinessGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <span className="relative text-2xl font-bold font-display text-brand">{animated}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-h3 text-ink">{label}</h3>
      </div>
    </div>
  );
}

export default function JobSeekerDashboard() {
  const [data, setData] = useState<CandidateDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await candidateApi.getDashboard();
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Failed to load dashboard'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const readinessChart = useMemo(() => {
    if (!data?.readinessBreakdown) return [];
    return Object.entries(data.readinessBreakdown).map(([name, score]) => ({ name, score }));
  }, [data]);

  const statusChart = useMemo(() => {
    if (!data?.applicationsByStatus) return [];
    return Object.entries(data.applicationsByStatus).map(([status, count]) => ({ status, count }));
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Dashboard unavailable"
          description={error || 'Could not load your career metrics.'}
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Candidate Start Experience — Authenticated Expandable Profile Card */}
      <AnimatedSection variant="fadeUp" delay={0.02}>
        <CandidateProfileCard
          readinessScore={data.careerReadinessScore || 85}
          roleTitle={data.preferredRole || 'Java Developer Candidate'}
          skills={data.skills?.map((s) => s.name) || ['Java 21', 'Spring Boot 3', 'Microservices', 'Kafka']}
        />
      </AnimatedSection>

      {/* Dashboard Welcome/Hero Section Reveal */}
      <ViewportReveal delay={0.05} yOffset={30}>
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-label">Career workspace</p>
            <div className="flex items-center gap-3">
              <ErrorBoundary fallback={<h1 className="text-3xl font-extrabold font-display text-ink">Welcome back{data.fullName ? `, ${data.fullName.split(' ')[0]}` : ''}</h1>}>
                <MaskedHeading
                  text={`Welcome back${data.fullName ? `, ${data.fullName.split(' ')[0]}` : ''}`}
                  tag="h1"
                  reveal="rise"
                  trigger="view"
                  duration={0.9}
                  stagger={0.08}
                  align="left"
                  textScale={0.075}
                />
              </ErrorBoundary>
              <LiveDot />
            </div>
            <p className="text-ink-muted">
              {data.preferredRole
                ? `Targeting ${data.preferredRole}${data.location ? ` · ${data.location}` : ''}`
                : 'Your live career readiness and application signal.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCopilotOpen(true)}
              className="press-btn press-btn--primary !min-h-10 !px-4 !py-2 text-sm flex items-center gap-2"
            >
              <Bot size={16} />
              Career Copilot
            </button>
            <Link to="/onboarding">
              <PressButton variant="ghost">Edit profile</PressButton>
            </Link>
          </div>
        </header>
      </ViewportReveal>

      {/* Dashboard Statistics Section — Phase 3 Staggered Entrance */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 1 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.05,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 25, scale: 0.96 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          whileHover={{ y: -5, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        >
          <StatCard
            icon={<Target size={22} />}
            label="Career Readiness"
            value={`${data.careerReadinessScore}`}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 25, scale: 0.96 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          whileHover={{ y: -5, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        >
          <StatCard
            icon={<TrendingUp size={22} />}
            label="Profile Strength"
            value={`${data.profileCompletionPercent}%`}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 25, scale: 0.96 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          whileHover={{ y: -5, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        >
          <StatCard
            icon={<FileText size={22} />}
            label="Resume Score"
            value={`${data.resumeScore}`}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 25, scale: 0.96 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          whileHover={{ y: -5, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        >
          <StatCard
            icon={<Briefcase size={22} />}
            label="Applications"
            value={`${data.applicationCount}`}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="ui-panel p-6 reveal space-y-4">
          <ProgressRing percent={data.careerReadinessScore} label="Career Readiness" />
          <p className="text-xs text-ink-faint text-center">{data.readinessNote}</p>
          <div className="space-y-2">
            {Object.entries(data.readinessBreakdown).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">{key}</span>
                  <span className="font-semibold text-ink">{val}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${val}%`,
                      background: 'var(--gradient-primary)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-line flex flex-col gap-2">
            <Link
              to="/career-roadmap"
              className="w-full text-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Compass size={14} />
              Open 30-Day Learning Roadmap
            </Link>
            <button
              onClick={() => setCopilotOpen(true)}
              className="w-full text-center px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface text-ink font-semibold text-xs border border-line transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bot size={14} className="text-indigo-600" />
              Ask Copilot to Analyze Gaps
            </button>
          </div>
        </div>

        <div className="ui-panel p-6 lg:col-span-2 reveal reveal-delay-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand" size={20} />
            <h2 className="text-h2 text-ink">Your next best action</h2>
          </div>
          {data.nextActions.length === 0 ? (
            <p className="text-sm text-ink-muted">You&apos;re in good shape. Keep applying and refining.</p>
          ) : (
            <div className="space-y-3">
              {data.nextActions.map((action) => (
                <div
                  key={action.title}
                  className="rounded-[12px] border border-line bg-surface-2/50 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`ui-chip text-xs ${
                          action.priority === 'high'
                            ? 'ui-chip--warn'
                            : action.priority === 'medium'
                              ? 'ui-chip--info'
                              : 'bg-surface text-ink-muted'
                        }`}
                      >
                        {action.priority}
                      </span>
                      <h3 className="font-semibold text-ink">{action.title}</h3>
                    </div>
                    <p className="text-sm text-ink-muted">{action.description}</p>
                  </div>
                  <Link to={action.ctaPath}>
                    <PressButton variant="primary" className="!min-h-10 !px-4 !py-2 text-sm whitespace-nowrap">
                      {action.ctaLabel}
                    </PressButton>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ui-panel p-6 reveal space-y-4">
          <h2 className="text-h2 text-ink">Readiness breakdown</h2>
          {readinessChart.length === 0 ? (
            <EmptyState title="No readiness data" description="Complete onboarding to populate this chart." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readinessChart} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-line)',
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="score" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="ui-panel p-6 reveal reveal-delay-1 space-y-4">
          <h2 className="text-h2 text-ink">Application funnel</h2>
          {statusChart.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Your career journey starts here. Applications will appear as you apply to roles."
              actionLabel="Improve profile"
              onAction={() => {
                window.location.href = '/onboarding';
              }}
              icon={<Briefcase size={28} />}
            />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                  <XAxis dataKey="status" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-line)',
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex gap-4 text-sm text-ink-muted">
            <span>Interviews: <strong className="text-ink">{data.interviewCount}</strong></span>
            <span>Offers: <strong className="text-ink">{data.offerCount}</strong></span>
            <span>Open jobs: <strong className="text-ink">{data.openJobsCount}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ui-panel p-6 reveal space-y-4">
          <h2 className="text-h2 text-ink">Skills ({data.skillCount})</h2>
          {data.skills.length === 0 ? (
            <EmptyState
              title="No skills yet"
              description="Add skills during onboarding to power matching."
              actionLabel="Add skills"
              onAction={() => {
                window.location.href = '/onboarding';
              }}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span key={s.name} className="ui-chip ui-chip--info">
                  {s.name} · {s.level}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="ui-panel p-6 reveal reveal-delay-1 space-y-5">
          <h2 className="text-h2 text-ink">Application journey</h2>
          {data.recentApplications.length === 0 ? (
            <div className="space-y-3 text-sm text-ink-muted">
              <p>No application history yet.</p>
              <div className="flex items-start gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <p className="font-medium text-ink-faint">Applied</p>
                  <p className="text-xs">Waiting for your first application</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative space-y-5">
              <div className="absolute top-4 left-4 h-[calc(100%-1rem)] w-px bg-line" />
              {data.recentApplications.map((app) => (
                <div key={app.id} className="timeline-item flex items-start gap-4 relative">
                  <div className="timeline-dot w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center z-10">
                    <FileText size={14} />
                  </div>
                  <div className="space-y-1 pt-0.5">
                    <h4 className="font-semibold text-ink">{app.jobTitle}</h4>
                    <p className="text-sm text-ink-muted">
                      {app.companyOrPoster} · {app.status}
                      {app.matchScore != null ? ` · ${Math.round(app.matchScore)}% match` : ''}
                    </p>
                    {app.appliedAt && <p className="text-xs text-ink-faint">{app.appliedAt}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        <div className="flex flex-wrap gap-2 reveal">
          {[
            ['/career-roadmap', '🎯 30-Day Roadmap'],
            ['/candidate/jobs', 'Browse jobs'],
            ['/candidate/applications', 'Applications'],
            ['/candidate/resume-builder', 'Resume builder'],
            ['/candidate/resume-analyzer', 'Analyzer'],
            ['/candidate/skill-gap', 'Skill gap matrix'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="press-btn press-btn--soft !min-h-10 !px-4 !py-2 text-sm">
              {label}
            </Link>
          ))}
        </div>

      <div className="reveal">
        <LiveActivityFeed mode="seeker" />
      </div>

      {data.profileMissing.length > 0 && (
        <div className="ui-panel p-6 reveal space-y-3">
          <h2 className="text-h2 text-ink">Profile gaps</h2>
          <ul className="space-y-2">
            {data.profileMissing.map((item) => (
              <li key={item} className="text-sm text-ink-muted flex gap-2">
                <span className="text-warning">○</span> {item}
              </li>
            ))}
          </ul>
          <Link to="/onboarding">
            <PressButton variant="soft">Complete missing sections</PressButton>
          </Link>
        </div>
      )}

      {/* Persistent Floating Career Copilot Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setCopilotOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-semibold text-sm shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300 cursor-pointer border border-indigo-400/30"
          title="Open AI Career Copilot"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
          <span>Career Copilot</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold rounded-md bg-white/20 text-white">
            AI
          </span>
        </button>
      </div>

      {/* Floating Copilot Drawer */}
      <CareerCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </div>
  );
}
