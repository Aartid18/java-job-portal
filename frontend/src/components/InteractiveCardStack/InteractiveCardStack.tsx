import React, { useState } from 'react';
import {
  FileText,
  Award,
  TrendingUp,
  Compass,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import './InteractiveCardStack.css';

export interface CardItemData {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: string;
  accentGlow: string;
  accentMuted: string;
  detailsTitle: string;
  metrics: { label: string; value: string }[];
  ctaLabel?: string;
  ctaAction?: () => void;
}

export interface InteractiveCardStackProps {
  cards?: CardItemData[];
  className?: string;
  onCardClick?: (card: CardItemData) => void;
}

export const DEFAULT_STACK_CARDS: CardItemData[] = [
  {
    id: 'card-apps',
    icon: <FileText size={24} />,
    title: '12 Apps Submitted',
    subtitle: 'Active Candidate Pipeline',
    accent: '#8B5CF6',
    accentGlow: 'rgba(139, 92, 246, 0.4)',
    accentMuted: 'rgba(139, 92, 246, 0.15)',
    detailsTitle: 'Application Metrics',
    metrics: [
      { label: 'Shortlisted', value: '3 Companies' },
      { label: 'Interviews Scheduled', value: '2 Active' },
      { label: 'Average Jaccard Match', value: '94% Score' },
    ],
    ctaLabel: 'View Applications',
  },
  {
    id: 'card-milestones',
    icon: <Award size={24} />,
    title: '3 Milestones Complete',
    subtitle: '30-Day Learning Journey',
    accent: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    accentMuted: 'rgba(16, 185, 129, 0.15)',
    detailsTitle: 'Milestone Records',
    metrics: [
      { label: '30-Day Roadmap', value: '100% Done' },
      { label: 'Spring Boot 3 Mesh', value: 'Verified' },
      { label: 'Kafka Capstone', value: 'Passed' },
    ],
    ctaLabel: 'Open Roadmap',
  },
  {
    id: 'card-profile',
    icon: <TrendingUp size={24} />,
    title: 'Profile Strength 92%',
    subtitle: 'ATS & Readiness Index',
    accent: '#3B82F6',
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    accentMuted: 'rgba(59, 130, 246, 0.15)',
    detailsTitle: 'Profile Strength',
    metrics: [
      { label: 'ATS PDF Score', value: '98 / 100' },
      { label: 'Verified Skills', value: '8 Badges' },
      { label: 'Market Readiness', value: 'Top 5%' },
    ],
    ctaLabel: 'Edit Profile',
  },
  {
    id: 'card-learning',
    icon: <Compass size={24} />,
    title: 'Learning Milestones',
    subtitle: 'Java 21 & Systems Track',
    accent: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    accentMuted: 'rgba(245, 158, 11, 0.15)',
    detailsTitle: 'Skill Progress',
    metrics: [
      { label: 'Java 21 Concurrency', value: 'Mastered' },
      { label: 'Microservices Mesh', value: 'Completed' },
      { label: 'System Design', value: 'In Progress' },
    ],
    ctaLabel: 'View Skill Matrix',
  },
];

export const InteractiveCardStack: React.FC<InteractiveCardStackProps> = ({
  cards = DEFAULT_STACK_CARDS,
  className = '',
  onCardClick,
}) => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const handleCardClick = (card: CardItemData, e: React.MouseEvent) => {
    e.stopPropagation();

    const isCurrentlyFlipped = flippedCardId === card.id;
    setFlippedCardId(isCurrentlyFlipped ? null : card.id);

    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div className={`card-stack-container ${className}`}>
      {/* Header Info */}
      <div className="text-center space-y-1 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-semibold uppercase tracking-wider">
          <Sparkles size={13} />
          <span>Interactive Milestone Deck</span>
        </div>
        <p className="text-xs text-ink-muted font-sans">
          Hover to lift forward • Click to flip card and reveal details
        </p>
      </div>

      {/* Deck Wrapper */}
      <div className="card-stack-deck">
        {cards.map((card, index) => {
          const isFlipped = flippedCardId === card.id;
          const zIndexDefault = index + 1;

          return (
            <div
              key={card.id}
              onClick={(e) => handleCardClick(card, e)}
              className={`stack-card-wrapper ${isFlipped ? 'is-flipped' : ''}`}
              style={{
                zIndex: isFlipped ? 100 : zIndexDefault,
                '--card-accent': card.accent,
                '--card-accent-glow': card.accentGlow,
                '--accent-muted': card.accentMuted,
              } as React.CSSProperties}
            >
              <div className="stack-card-inner">
                {/* Front Side */}
                <div className="stack-card-front">
                  <div className="icon-badge">{card.icon}</div>

                  <div className="space-y-1">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-subtitle">{card.subtitle}</p>
                  </div>

                  <span className="hint-pill">
                    <span>Click to reveal</span>
                    <ArrowRight size={10} />
                  </span>
                </div>

                {/* Back Side (Revealed Info Panel) */}
                <div className="stack-card-back">
                  <div className="back-header">
                    <span className="back-title">{card.detailsTitle}</span>
                    <span className="back-close flex items-center gap-1">
                      <RotateCcw size={12} />
                      <span>Flip</span>
                    </span>
                  </div>

                  <div className="back-body">
                    {card.metrics.map((m, i) => (
                      <div key={i} className="metric-row">
                        <span>{m.label}</span>
                        <span className="metric-val">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cta-btn">{card.ctaLabel || 'Explore'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveCardStack;
