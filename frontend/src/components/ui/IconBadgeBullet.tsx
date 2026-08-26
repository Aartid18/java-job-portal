import type { ReactNode } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface IconBadgeBulletProps {
  children: ReactNode;
  icon?: 'check' | 'sparkle' | 'alert' | 'arrow';
  variant?: 'brand' | 'success' | 'warning' | 'violet';
  className?: string;
}

export function IconBadgeBullet({
  children,
  icon = 'check',
  variant = 'brand',
  className = '',
}: IconBadgeBulletProps) {
  const iconMap = {
    check: <CheckCircle2 className="w-4 h-4" />,
    sparkle: <Sparkles className="w-4 h-4" />,
    alert: <AlertCircle className="w-4 h-4" />,
    arrow: <ArrowRight className="w-4 h-4" />,
  };

  const badgeStyles = {
    brand: 'bg-brand/10 text-brand border-brand/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  }[variant];

  return (
    <div className={`flex items-start gap-3 text-sm text-ink ${className}`}>
      <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${badgeStyles}`}>
        {iconMap[icon]}
      </div>
      <div className="leading-relaxed pt-0.5">{children}</div>
    </div>
  );
}
