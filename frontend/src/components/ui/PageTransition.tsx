import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppReducedMotion, fadeUp, staggerContainer, heroZoomIn, EASE_CUSTOM } from '../../lib/motion';

export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Full page wrapper animating route changes every time a user navigates
 * between tabs (Dashboard, Roadmap, Jobs, Applications, Resume, Profile).
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const shouldReduceMotion = useAppReducedMotion();

  const pageVariants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: EASE_CUSTOM,
      },
    },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: -8,
          transition: { duration: 0.15, ease: EASE_CUSTOM },
        },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-full ${className}`}
    >
      {/* Top Sweep Progress Line on Page Load */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-amber-500 to-indigo-500 origin-left z-[100] pointer-events-none"
        />
      )}
      {children}
    </motion.div>
  );
}

export interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: 'fadeUp' | 'hero' | 'stagger';
}

/**
 * Individual section container animating every time it loads or mounts.
 */
export function AnimatedSection({
  children,
  delay = 0,
  className = '',
  variant = 'fadeUp',
}: AnimatedSectionProps) {
  const shouldReduceMotion = useAppReducedMotion();

  const selectedVariants =
    variant === 'hero'
      ? heroZoomIn
      : variant === 'stagger'
      ? staggerContainer(0.08, delay)
      : fadeUp;

  return (
    <motion.div
      variants={selectedVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
