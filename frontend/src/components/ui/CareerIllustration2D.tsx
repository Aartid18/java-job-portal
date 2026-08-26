import { motion } from 'framer-motion';
import { FileCheck, Award, MessageSquare, Compass, Rocket } from 'lucide-react';
import { useAppReducedMotion } from '../../lib/motion';

interface CareerIllustrationProps {
  type?: 'hero' | 'resume' | 'interview' | 'roadmap' | 'success';
  className?: string;
}

export function CareerIllustration2D({ type = 'hero', className = '' }: CareerIllustrationProps) {
  const shouldReduceMotion = useAppReducedMotion();

  const illustrationMap = {
    hero: (
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand/20 via-violet-500/10 to-cyan-500/20 filter blur-2xl" />
        <Rocket className="w-24 h-24 sm:w-32 sm:h-32 text-brand drop-shadow-xl" strokeWidth={1.2} />
      </div>
    ),
    resume: (
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/15 filter blur-xl" />
        <FileCheck className="w-20 h-20 text-emerald-500 drop-shadow-md" strokeWidth={1.2} />
      </div>
    ),
    interview: (
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-violet-500/15 filter blur-xl" />
        <MessageSquare className="w-20 h-20 text-violet-500 drop-shadow-md" strokeWidth={1.2} />
      </div>
    ),
    roadmap: (
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/15 filter blur-xl" />
        <Compass className="w-20 h-20 text-cyan-500 drop-shadow-md" strokeWidth={1.2} />
      </div>
    ),
    success: (
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-brand/15 filter blur-xl" />
        <Award className="w-20 h-20 text-brand drop-shadow-md" strokeWidth={1.2} />
      </div>
    ),
  };

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? undefined
          : {
              y: [-6, 6, -6],
            }
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`inline-flex items-center justify-center select-none ${className}`}
    >
      {illustrationMap[type]}
    </motion.div>
  );
}
