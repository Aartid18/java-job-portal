import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Folder from './Folder';
import { ViewportReveal } from './ui';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const milestoneItems = [
    (
      <div key="paper-30days" className="milestone-paper-content">
        <strong className="text-brand font-display text-lg">30 DAYS</strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">MILESTONE REACHED</span>
      </div>
    ),
    (
      <div key="paper-applications" className="milestone-paper-content">
        <strong className="text-violet-600 dark:text-violet-400 font-display text-lg">
          {applicationCount} APPS
        </strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">SUBMITTED</span>
      </div>
    ),
    (
      <div key="paper-profile" className="milestone-paper-content">
        <strong className="text-emerald-600 dark:text-emerald-400 font-display text-lg">
          {profileCompletion}%
        </strong>
        <span className="text-ink-muted text-[10px] font-mono tracking-wider">PROFILE COMPLETE</span>
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
              Interactive milestone achievement container. Click the folder to expand your progress summary.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-2/80 border border-line text-xs font-mono">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Readiness Index: <strong className="text-brand font-bold">{readinessScore}/100</strong></span>
          </div>
        </div>

        {/* Center Folder Container (Ensured overflow visible so expanded papers never clip!) */}
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
                ? '✨ Milestone Unlocked! Click again to close folder'
                : isHovered
                ? '📂 Open milestone details'
                : 'Click the folder to explore your 30-day milestone'}
            </p>
            <p className="text-[11px] text-ink-muted font-sans">
              Contains Applications, Profile Strength & Learning Milestones
            </p>
          </div>
        </div>
      </div>
    </ViewportReveal>
  );
};

export default MilestoneFolderSection;
