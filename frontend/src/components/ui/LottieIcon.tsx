import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppReducedMotion } from '../../lib/motion';

export interface LottieIconProps {
  /** Decorative SVG icon element or path fallback */
  icon?: ReactNode;
  /** Size in pixels or Tailwind classes */
  size?: number | string;
  /** Primary accent color class */
  className?: string;
  /** Animation preset style */
  animation?: 'bounce' | 'pulse' | 'spin' | 'jiggle' | 'float';
}

export function LottieIcon({
  icon,
  size = 24,
  className = '',
  animation = 'bounce',
}: LottieIconProps) {
  const shouldReduceMotion = useAppReducedMotion();

  const animationVariants = {
    bounce: {
      y: [0, -6, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.9, 1, 0.9],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    spin: {
      rotate: [0, 360],
      transition: { duration: 8, repeat: Infinity, ease: 'linear' as const },
    },
    jiggle: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    float: {
      y: [0, -4, 4, 0],
      x: [0, 2, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={shouldReduceMotion ? undefined : animationVariants[animation]}
      aria-hidden="true"
    >
      {icon || (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-brand"
        >
          {/* Default Java Coffee Cup Lottie Icon Representation */}
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      )}
    </motion.div>
  );
}

export default LottieIcon;
