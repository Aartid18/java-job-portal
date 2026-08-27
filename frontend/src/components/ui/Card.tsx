import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function Card({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4, scale: 1.015 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className={`ui-panel p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-[12px] bg-brand-muted text-brand flex items-center justify-center shadow-xs">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-ink-muted font-medium">{label}</p>
        <h3 className="text-2xl font-bold font-display text-ink">{value}</h3>
      </div>
    </Card>
  );
}
