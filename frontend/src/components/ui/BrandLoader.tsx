import { motion } from 'framer-motion';
import { useAppReducedMotion } from '../../lib/motion';

export function BrandLoader({ label = 'Matching candidates & job requirements…', className = '' }: { label?: string; className?: string }) {
  const shouldReduceMotion = useAppReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center space-y-3 ${className}`}>
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-ink-muted">{label}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center space-y-5 select-none ${className}`}>
      {/* Constellation Orbit Canvas Container */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Pulsing Core */}
        <motion.div
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center"
        >
          <span className="w-3 h-3 rounded-full bg-brand" />
        </motion.div>

        {/* Orbiting Candidate Node (Circle) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-start justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-xs border border-white" />
        </motion.div>

        {/* Orbiting Job Node (Diamond) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-end justify-center"
        >
          <div className="w-3.5 h-3.5 rotate-45 bg-cyan-500 shadow-xs border border-white" />
        </motion.div>

        {/* Orbiting Skill Node (Violet Circle) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-start"
        >
          <div className="w-3 h-3 rounded-full bg-violet-500 shadow-xs" />
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="text-xs font-semibold uppercase tracking-widest text-ink-muted"
      >
        {label}
      </motion.p>
    </div>
  );
}
