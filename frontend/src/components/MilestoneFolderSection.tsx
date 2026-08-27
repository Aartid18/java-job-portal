import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, X, ArrowRight, FileText, Compass, TrendingUp } from 'lucide-react';
import Folder from './Folder';
import { ViewportReveal } from './ui';
import { useNavigate } from 'react-router-dom';

export interface MilestoneFolderSectionProps {
  applicationCount?: number;
  profileCompletion?: number;
  readinessScore?: number;
}

export const MilestoneFolderSection: React.FC<MilestoneFolderSectionProps> = ({
  applicationCount = 12,
  profileCompletion = 92,
  readinessScore = 88,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDetail, setActiveDetail] = useState<'30days' | 'apps' | 'profile' | null>(null);

  const handlePaperClick = (type: '30days' | 'apps' | 'profile', e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDetail(type);
  };

  const milestoneItems = [
    (
      <div
        key="paper-30days"
        onClick={(e) => handlePaperClick('30days', e)}
        className="milestone-paper-content group cursor-pointer w-full h-full flex flex-col items-center justify-center"
      >
        <strong className="text-brand font-display text-lg group-hover:scale-105 transition-transform">30 DAYS</strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">MILESTONE REACHED</span>
        <span className="mt-1 text-[9px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</span>
      </div>
    ),
    (
      <div
        key="paper-applications"
        onClick={(e) => handlePaperClick('apps', e)}
        className="milestone-paper-content group cursor-pointer w-full h-full flex flex-col items-center justify-center"
      >
        <strong className="text-violet-600 dark:text-violet-400 font-display text-lg group-hover:scale-105 transition-transform">
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
        className="milestone-paper-content group cursor-pointer w-full h-full flex flex-col items-center justify-center"
      >
        <strong className="text-emerald-600 dark:text-emerald-400 font-display text-lg group-hover:scale-105 transition-transform">
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
              <Award size={14} />
              <span>30-Day Milestone Achievement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight flex items-center gap-2">
              <span>Your 30-Day Career Journey</span>
              <Sparkles className="w-5 h-5 text-brand" />
            </h2>
            <p className="text-sm text-ink-muted">
              Interactive milestone achievement container. Hover or click paper cards to reveal detailed information.
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
                ? '✨ Milestone Unlocked! Hover cards to lift forward, click for full info'
                : isHovered
                ? '📂 Open milestone details'
                : 'Click the folder to explore your 30-day milestone'}
            </p>
            <p className="text-[11px] text-ink-muted font-sans">
              Contains Applications, Profile Strength & Learning Milestones
            </p>
          </div>
        </div>

        {/* Detail Modal Info Reveal Popup */}
        {activeDetail && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveDetail(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-3xl border border-line bg-[#12131A] text-[#F4F2ED] p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {activeDetail === '30days' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-brand/20 text-brand">
                      <Compass size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold">30-Day Milestone</span>
                      <h3 className="text-xl font-bold font-display text-white">Learning Journey Blueprint</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    You have successfully completed 4 out of 4 weekly milestones in your Spring Boot 3 & Microservices learning track.
                  </p>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between p-3 rounded-xl bg-surface-2/60 border border-line/40">
                      <span>Week 1: Spring Boot 3 Core</span>
                      <span className="text-emerald-400 font-bold">✓ 100% Passed</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-surface-2/60 border border-line/40">
                      <span>Week 2: Microservices Mesh</span>
                      <span className="text-emerald-400 font-bold">✓ 100% Passed</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-surface-2/60 border border-line/40">
                      <span>Week 3: Kafka Event Streams</span>
                      <span className="text-emerald-400 font-bold">✓ 100% Passed</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/career-roadmap')}
                    className="w-full py-3 rounded-xl bg-brand text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>View Complete Roadmap</span>
                    <ArrowRight size={14} />
                  </button>
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
