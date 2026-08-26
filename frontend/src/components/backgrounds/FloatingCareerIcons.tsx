import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, GraduationCap, Users, Search, TrendingUp, Building2, MessageSquare } from 'lucide-react';
import { useAppReducedMotion } from '../../lib/motion';

const ICONS = [
  Briefcase,
  FileText,
  GraduationCap,
  Users,
  Search,
  TrendingUp,
  Building2,
  MessageSquare,
];

export function FloatingCareerIcons() {
  const shouldReduceMotion = useAppReducedMotion();

  const floaters = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const Icon = ICONS[i % ICONS.length];
      const left = 5 + (i * 12) + (Math.random() * 5);
      const size = 20 + (i % 3) * 8; // 20px, 28px, 36px depth sizes
      const duration = 18 + (i % 4) * 6; // 18s to 36s slow drift
      const delay = i * 2.2;
      const blur = (i % 3) * 0.8; // 0px to 1.6px blur for depth
      const rotation = (i % 2 === 0 ? 1 : -1) * (15 + i * 5);

      return { Icon, left, size, duration, delay, blur, rotation, id: i };
    });
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {floaters.map(({ Icon, left, size, duration, delay, blur, rotation, id }) => (
        <motion.div
          key={id}
          initial={{ y: '110vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-15vh',
            opacity: [0, 0.07, 0.07, 0],
            rotate: rotation,
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${left}%`,
            filter: `blur(${blur}px)`,
          }}
          className="text-brand dark:text-violet-400"
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
