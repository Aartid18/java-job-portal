import React, { useState } from 'react';
import { Sparkles, CheckCircle2, X, ArrowRight, FileText, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import Folder from './Folder';
import { ViewportReveal } from './ui';
import { useNavigate } from 'react-router-dom';

export interface MilestoneFolderSectionProps {
  applicationCount?: number;
  profileCompletion?: number;
  readinessScore?: number;
}

const WEEK1_DAILY_SYLLABUS = [
  {
    day: 'D1',
    title: 'Virtual Threads vs Platform Threads',
    desc: 'Benchmark 100,000 concurrent Virtual Threads in Java 21 vs OS ThreadPool.',
    practice: 'Write a benchmark class comparing Executors.newVirtualThreadPerTaskExecutor() with ThreadPoolExecutor.',
  },
  {
    day: 'D2',
    title: 'Structured Concurrency API',
    desc: 'Implement StructuredTaskScope to coordinate async API calls with automatic cancellation.',
    practice: 'Create a payment gateway aggregator using StructuredTaskScope.ShutdownOnFailure.',
  },
  {
    day: 'D3',
    title: 'Scoped Values & Context',
    desc: 'Replace ThreadLocal with ScopedValue for thread-safe context propagation across Virtual Threads.',
    practice: 'Implement request tenant-id propagation using ScopedValue.',
  },
  {
    day: 'D4',
    title: 'Pattern Matching & Sealed Classes',
    desc: 'Design domain models using Sealed Interfaces and exhaustive switch pattern matching in Java 21.',
    practice: 'Refactor PaymentResult sealed interface using record patterns.',
  },
  {
    day: 'D5',
    title: 'Java 21 JVM Tuning',
    desc: 'Profile GC pauses with ZGC (Z Garbage Collector) under high memory allocation.',
    practice: 'Tune JVM flags -XX:+UseZGC -XX:+ZGenerational for sub-1ms pauses.',
  },
];

export const MilestoneFolderSection: React.FC<MilestoneFolderSectionProps> = ({
  applicationCount = 12,
  profileCompletion = 92,
  readinessScore = 88,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDetail, setActiveDetail] = useState<'30days' | 'apps' | 'profile' | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const handlePaperClick = (type: '30days' | 'apps' | 'profile', e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDetail(type);
  };

  const milestoneItems = [
    (
      <div
        key="paper-30days"
        onClick={(e) => handlePaperClick('30days', e)}
        className="milestone-paper-content group cursor-pointer w-full h-full flex flex-col items-center justify-center p-2 text-center"
      >
        <strong className="text-brand font-display text-base sm:text-lg group-hover:scale-105 transition-transform">
          30-DAY SYLLABUS
        </strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">JAVA 21 & SPRING 3</span>
        <span className="mt-1 text-[9px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">Click for syllabus →</span>
      </div>
    ),
    (
      <div
        key="paper-applications"
        onClick={(e) => handlePaperClick('apps', e)}
        className="milestone-paper-content group cursor-pointer w-full h-full flex flex-col items-center justify-center p-2 text-center"
      >
        <strong className="text-violet-600 dark:text-violet-400 font-display text-base sm:text-lg group-hover:scale-105 transition-transform">
          {applicationCount} APPS
        </strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">SUBMITTED</span>
        <span className="mt-1 text-[9px] font-semibold text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</span>
      </div>
    ),
    (
      <div
        key="paper-profile"
        onClick={(e) => handlePaperClick('profile', e)}
        className="milestone-paper-content group cursor-pointer w-full h-full flex flex-col items-center justify-center p-2 text-center"
      >
        <strong className="text-emerald-600 dark:text-emerald-400 font-display text-base sm:text-lg group-hover:scale-105 transition-transform">
          {profileCompletion}%
        </strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">PROFILE COMPLETE</span>
        <span className="mt-1 text-[9px] font-semibold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</span>
      </div>
    ),
  ];

  return (
    <ViewportReveal delay={0.1} yOffset={25} className="w-full my-8">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-3xl border border-line/90 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6 overflow-visible"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-semibold uppercase tracking-wider">
              <Calendar size={14} />
              <span>4-Week / 30-Day Milestone Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight flex items-center gap-2">
              <span>Structured Day-by-Day Practical Syllabus</span>
              <Sparkles className="w-5 h-5 text-brand" />
            </h2>
            <p className="text-sm text-ink-muted">
              From foundational Java 21 concurrency to production capstone microservices deployment.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-2/80 border border-line text-xs font-mono">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Readiness Index: <strong className="text-brand font-bold">{readinessScore}/100</strong></span>
          </div>
        </div>

        {/* Center Folder Container */}
        <div className="relative py-12 flex flex-col items-center justify-center space-y-4 overflow-visible">
          <Folder
            size={1.3}
            color="#4F46E5"
            items={milestoneItems}
            onToggle={(open) => setIsOpen(open)}
          />

          {/* Interactive Hint Label */}
          <div className="text-center space-y-1 z-10">
            <p className="text-xs font-mono font-semibold text-brand transition-colors">
              {isOpen
                ? '✨ Milestone Unlocked! Hover cards to lift forward, click for daily syllabus'
                : isHovered
                ? '📂 Open 30-Day Milestone syllabus'
                : 'Click the folder to explore your 30-day milestone'}
            </p>
            <p className="text-[11px] text-ink-muted font-sans">
              Contains Java 21 Concurrency, Spring Boot 3, Kafka & Production Capstone
            </p>
          </div>
        </div>

        {/* Full Modal Info Reveal Popup */}
        {activeDetail && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveDetail(null)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-[#0B0D14] text-[#F4F2ED] p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {activeDetail === '30days' && (
                <div className="space-y-6">
                  {/* Modal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-semibold uppercase tracking-wider">
                        <Calendar size={14} />
                        <span>4-Week / 30-Day Milestone Journey</span>
                      </div>
                      <h3 className="text-2xl font-bold font-display text-white">Structured Day-by-Day Practical Syllabus</h3>
                      <p className="text-xs text-slate-400">
                        Structured day-by-day practical syllabus to take you from foundational understanding to production capstone deployment.
                      </p>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-semibold self-start sm:self-auto">
                      Practical Project Focus
                    </div>
                  </div>

                  {/* Week Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line/40">
                    {[
                      { id: 1, label: 'W1: Java 21 Concurrency', tag: 'HIGH PRIORITY' },
                      { id: 2, label: 'W2: Spring Boot 3 Mesh', tag: 'CORE' },
                      { id: 3, label: 'W3: Kafka Streams', tag: 'ADVANCED' },
                      { id: 4, label: 'W4: K8s & System Capstone', tag: 'DEPLOYMENT' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setActiveWeek(w.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                          activeWeek === w.id
                            ? 'bg-brand text-white shadow-md'
                            : 'bg-surface-2/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{w.label}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 font-mono">{w.tag}</span>
                      </button>
                    ))}
                  </div>

                  {/* Week 1 Detailed Daily Syllabus Cards */}
                  {activeWeek === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand/20 text-brand flex items-center justify-center font-extrabold font-mono">
                            W1
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base">Week 1: Java 21 Virtual Threads & Concurrency</h4>
                            <p className="text-xs text-slate-400">Master Java 21 Loom Virtual Threads, Structured Concurrency, and Low-Latency Performance.</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400">5 Daily Milestones</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {WEEK1_DAILY_SYLLABUS.map((item) => (
                          <div key={item.day} className="p-4 rounded-2xl bg-surface-2/60 border border-line/60 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-brand/20 text-brand font-mono text-xs font-extrabold">
                                {item.day}
                              </span>
                              <h5 className="font-bold text-white text-sm">{item.title}</h5>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                            <div className="pt-2 border-t border-line/40 text-xs italic text-indigo-300 space-y-1">
                              <span className="font-semibold not-italic text-brand flex items-center gap-1">
                                💡 Practice:
                              </span>
                              <p className="font-mono text-[11px] text-slate-300">{item.practice}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeWeek > 1 && (
                    <div className="p-8 text-center space-y-3 bg-surface-2/40 rounded-2xl border border-line/40">
                      <BookOpen size={32} className="mx-auto text-brand" />
                      <h4 className="font-bold text-white text-base">Week {activeWeek} Syllabus Ready</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Complete Week 1 Virtual Threads milestones to unlock interactive benchmark suites for Week {activeWeek}.
                      </p>
                      <button
                        onClick={() => navigate('/career-roadmap')}
                        className="px-4 py-2 rounded-xl bg-brand text-white font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>Open Complete Roadmap</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Bottom Modal CTA */}
                  <div className="pt-4 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400 font-mono">
                      Synced with target job requirement: <strong className="text-white">Senior Java Tech Lead</strong>
                    </p>
                    <button
                      onClick={() => navigate('/career-roadmap')}
                      className="px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2"
                    >
                      <span>Open Interactive Roadmap</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {activeDetail === 'apps' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-violet-500/20 text-violet-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">Application Pipeline</span>
                      <h3 className="text-xl font-bold font-display text-white">{applicationCount} Applications Submitted</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    Your application status across top enterprise Java recruiter postings over the last 30 days.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 rounded-xl bg-surface-2/60 border border-line/40 space-y-1">
                      <span className="text-ink-muted">In Review</span>
                      <p className="text-lg font-bold text-violet-400">6</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2/60 border border-line/40 space-y-1">
                      <span className="text-ink-muted">Shortlisted</span>
                      <p className="text-lg font-bold text-emerald-400">3</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2/60 border border-line/40 space-y-1">
                      <span className="text-ink-muted">Interviews</span>
                      <p className="text-lg font-bold text-brand">3</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/candidate/jobs')}
                    className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Explore More Jobs</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {activeDetail === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Profile Strength</span>
                      <h3 className="text-xl font-bold font-display text-white">{profileCompletion}% Complete</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    Your profile metrics, ATS resume score, and verified skills index are performing exceptionally well.
                  </p>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between p-3 rounded-xl bg-surface-2/60 border border-line/40">
                      <span>ATS Resume Optimization</span>
                      <span className="text-emerald-400 font-bold">98 / 100</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-surface-2/60 border border-line/40">
                      <span>Jaccard Skill Overlap</span>
                      <span className="text-brand font-bold">94% Score</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-surface-2/60 border border-line/40">
                      <span>Verified Tech Badges</span>
                      <span className="text-violet-400 font-bold">8 Skills</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Refine Profile & Skills</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ViewportReveal>
  );
};

export default MilestoneFolderSection;
