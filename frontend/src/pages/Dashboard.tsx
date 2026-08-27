import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import PressButton from '../components/PressButton';
import LiveMarketStrip from '../components/LiveMarketStrip';
import { useAuth } from '../context/AuthContext';
import { TiltCard, OrganicStatCard } from '../components/ui';
import { Hero3DScene } from '../components/backgrounds/Hero3DScene';
import { heroZoomIn, gridExplodeContainer, gridExplodeItem } from '../lib/motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'seeker' | 'recruiter' | 'admin'>('seeker');

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
    else if (user.role === 'ADMIN') navigate('/admin');
    else navigate('/candidate');
  };

  const featureCards = [
    {
      icon: <TrendingUp className="w-6 h-6 text-brand" />,
      title: 'Career Readiness Score',
      description: 'Algorithmic readiness metrics evaluating your technical skillset, project portfolio, and market competitiveness.',
      tag: 'Seeker',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-violet-500" />,
      title: 'ATS Resume Analyzer',
      description: 'Instant PDF parser and ATS analyzer evaluating keyword density, formatting compliance, and impact metrics.',
      tag: 'AI Diagnostics',
    },
    {
      icon: <Compass className="w-6 h-6 text-cyan-500" />,
      title: 'Career Roadmap & Skill Gap',
      description: 'Interactive visual progression tree pointing out missing skills and recommending precise learning milestones.',
      tag: 'Growth Engine',
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      title: 'Recruiter Candidate Match',
      description: 'Jaccard skill match scoring ranking applicants instantly so hiring teams connect with top talent faster.',
      tag: 'Recruiter Hub',
    },
  ];

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        {/* Hero Banner */}
        <div data-cursor-zone="hero" className="text-center space-y-6 max-w-4xl mx-auto pt-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-muted/70 text-brand text-xs font-semibold uppercase tracking-widest border border-brand/20 backdrop-blur-md"
          >
            <Zap className="w-3.5 h-3.5 text-brand" />
            <span>AI-Powered Java & Full-Stack Career Operating System</span>
          </motion.div>

          <div className="w-full my-4">
            <Hero3DScene />
          </div>

          <motion.h1
            variants={heroZoomIn}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-display-gradient tracking-tight leading-[1.1]"
          >
            Empowering Tech Careers & Modern Hiring
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed font-body"
          >
            Complete end-to-end platform for job seekers and recruiters — Jaccard skill matching, ATS resume scoring, career roadmap analysis, and interview scheduling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <PressButton variant="primary" onClick={primaryCta} className="!px-8 !py-3.5 text-base font-semibold shadow-lg shadow-brand/25">
              <span>{isAuthenticated ? 'Go to Workspace' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </PressButton>
            {!isAuthenticated && (
              <PressButton variant="ghost" onClick={() => navigate('/login')} className="!px-6 !py-3.5 text-base font-medium">
                Sign In
              </PressButton>
            )}
          </motion.div>
        </div>

        {/* Live Organic Statistics Grid */}
        <div data-cursor-zone="dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <OrganicStatCard label="Tech Jobs Analyzed" value="10,000+" variant="blob" gradient="brand" />
          <OrganicStatCard label="ATS Accuracy" value="98%" variant="hexagon" gradient="violet" />
          <OrganicStatCard label="Skill Matching" value="Jaccard" variant="blob" gradient="cyan" />
          <OrganicStatCard label="Portals" value="3 Roles" variant="hexagon" gradient="emerald" />
        </div>

        {/* Interactive Feature Grid */}
        <div data-cursor-zone="jobs" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink">Built for Complete Career Acceleration</h2>
            <p className="text-sm text-ink-muted">Explore intelligent features built with Spring Boot 3, React 19, and Tailwind.</p>
          </div>

          <motion.div
            variants={gridExplodeContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {featureCards.map((card) => (
              <motion.div key={card.title} variants={gridExplodeItem}>
                <TiltCard className="group relative rounded-2xl border border-line/80 bg-surface/80 p-6 backdrop-blur-xl shadow-md hover:shadow-xl hover:border-brand/40 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-surface-2 group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-muted/40 text-brand">
                      {card.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink font-display group-hover:text-brand transition-colors">{card.title}</h3>
                    <p className="text-sm text-ink-muted mt-1 leading-relaxed">{card.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Interactive Role Switcher Demo Preview */}
        <div className="rounded-2xl border border-line/90 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <h3 className="text-xl font-bold font-display text-ink">Interactive Role Preview</h3>
              <p className="text-xs text-ink-muted">Switch between roles to experience each dedicated portal.</p>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-2 border border-line">
              <button
                type="button"
                onClick={() => setActiveTab('seeker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'seeker' ? 'bg-brand text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'recruiter' ? 'bg-violet-600 text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin' ? 'bg-cyan-600 text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Admin Overview
              </button>
            </div>
          </div>

          {activeTab === 'seeker' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Readiness Score</span>
                  <p className="text-2xl font-bold font-display text-brand">92 / 100</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Active Applications</span>
                  <p className="text-2xl font-bold font-display text-violet-600 dark:text-violet-400">6 Pipeline</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">ATS Resume Match</span>
                  <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">89% Score</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-brand/20 bg-brand/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand" />
                  <span className="text-xs font-medium text-ink">Target Role: Senior Java Tech Lead & Spring Boot Specialist</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/candidate')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-brand rounded-lg shadow-xs hover:bg-brand-hover transition-colors cursor-pointer"
                >
                  Explore Seeker Workspace
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'recruiter' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Active Job Postings</span>
                  <p className="text-2xl font-bold font-display text-violet-600 dark:text-violet-400">12 Postings</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Ranked Applicants</span>
                  <p className="text-2xl font-bold font-display text-brand">48 Candidates</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Top Match Score</span>
                  <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">96% Overlap</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-violet-500" />
                  <span className="text-xs font-medium text-ink">Post new jobs, rank candidates by Jaccard score & schedule interviews.</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/recruiter')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 rounded-lg shadow-xs hover:bg-violet-700 transition-colors cursor-pointer"
                >
                  Open Recruiter Hub
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Total Registered Users</span>
                  <p className="text-2xl font-bold font-display text-cyan-600 dark:text-cyan-400">1,240 Users</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">System Health</span>
                  <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">99.9% Operational</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2/80 border border-line space-y-1">
                  <span className="text-xs text-ink-muted font-medium">Total Applications</span>
                  <p className="text-2xl font-bold font-display text-brand">3,890 Processed</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  <span className="text-xs font-medium text-ink">Platform metrics, user role governance, & system metrics.</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 rounded-lg shadow-xs hover:bg-cyan-700 transition-colors cursor-pointer"
                >
                  Access Admin Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Live Ticker */}
        <LiveMarketStrip />
      </div>
    </section>
  );
}

