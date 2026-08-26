import { motion } from 'framer-motion';
import { Bot, Sparkles, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';

interface SpeechBubbleCalloutProps {
  children: ReactNode;
  title?: string;
  type?: 'ai' | 'tip' | 'warning';
  className?: string;
}

export function SpeechBubbleCallout({
  children,
  title = 'AI Career Copilot Suggestion',
  type = 'ai',
  className = '',
}: SpeechBubbleCalloutProps) {
  const typeConfig = {
    ai: {
      icon: <Bot className="w-4 h-4 text-brand" />,
      badge: 'AI Insight',
      badgeClass: 'bg-brand/10 text-brand border-brand/20',
      bgClass: 'bg-surface border-brand/30',
    },
    tip: {
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      badge: 'Pro Tip',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      bgClass: 'bg-surface border-amber-500/30',
    },
    warning: {
      icon: <Sparkles className="w-4 h-4 text-violet-500" />,
      badge: 'ATS Signal',
      badgeClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      bgClass: 'bg-surface border-violet-500/30',
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`relative p-5 rounded-2xl border shadow-md ${typeConfig.bgClass} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {typeConfig.icon}
          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-ink">{title}</h4>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeConfig.badgeClass}`}>
          {typeConfig.badge}
        </span>
      </div>

      <div className="text-sm text-ink-muted leading-relaxed font-body">{children}</div>

      {/* Speech Bubble Pointer Tail */}
      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-surface border-b border-r border-line rotate-45" />
    </motion.div>
  );
}
