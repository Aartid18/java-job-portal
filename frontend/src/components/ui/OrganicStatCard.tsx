import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useAppReducedMotion } from '../../lib/motion';

interface OrganicStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'blob' | 'hexagon';
  gradient?: 'brand' | 'violet' | 'cyan' | 'emerald';
}

function CountUpNumber({ target }: { target: number }) {
  const spring = useSpring(0, { duration: 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    spring.set(target);
    const unsubscribe = display.on('change', (v) => setCurrentVal(v));
    return () => unsubscribe();
  }, [target, spring, display]);

  return <span>{currentVal}</span>;
}

export function OrganicStatCard({
  label,
  value,
  subtitle,
  icon,
  variant = 'blob',
  gradient = 'brand',
}: OrganicStatCardProps) {
  const shouldReduceMotion = useAppReducedMotion();

  const gradientMap = {
    brand: 'from-brand/15 to-violet-500/10 border-brand/30 text-brand',
    violet: 'from-violet-500/15 to-pink-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400',
    cyan: 'from-cyan-500/15 to-brand/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
    emerald: 'from-emerald-500/15 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  }[gradient];

  const blobShape =
    variant === 'blob'
      ? 'rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%]'
      : 'rounded-2xl';

  const numValue = typeof value === 'number' ? value : parseInt(value, 10);
  const isNumeric = !isNaN(numValue);
  const suffix = typeof value === 'string' && value.endsWith('%') ? '%' : typeof value === 'string' && value.endsWith('+') ? '+' : '';

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { scale: 1.04, rotate: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative p-6 bg-gradient-to-br border backdrop-blur-xl shadow-lg space-y-2 text-center flex flex-col items-center justify-center transition-all ${blobShape} ${gradientMap}`}
    >
      {icon && <div className="p-2.5 rounded-2xl bg-surface/80 border border-line shadow-xs">{icon}</div>}
      <h3 className="text-3xl font-extrabold font-display tracking-tight">
        {isNumeric && !shouldReduceMotion ? (
          <>
            <CountUpNumber target={numValue} />
            {suffix}
          </>
        ) : (
          value
        )}
      </h3>
      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
      {subtitle && <p className="text-[11px] text-ink-faint">{subtitle}</p>}
    </motion.div>
  );
}
