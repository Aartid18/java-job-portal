import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ArtisticHeadingProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function ArtisticHeading({
  children,
  subtitle,
  className = '',
  align = 'center',
}: ArtisticHeadingProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div className={`flex flex-col space-y-2 ${alignClass} ${className}`}>
      <div className="relative inline-block">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-ink tracking-tight">
          {children}
        </h2>
        {/* Animated Swipe Underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="h-1 rounded-full bg-gradient-to-r from-brand via-violet-500 to-cyan-500 origin-left mt-1"
        />
      </div>
      {subtitle && <p className="text-sm text-ink-muted max-w-xl font-body">{subtitle}</p>}
    </div>
  );
}
