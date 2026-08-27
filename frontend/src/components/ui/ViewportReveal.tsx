import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ViewportRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  scaleIn?: boolean;
  once?: boolean;
  className?: string;
}

/**
 * Phase 2 Reusable Viewport Reveal Motion Component.
 * Animates sections & cards into view as they enter the viewport using Framer Motion.
 */
export function ViewportReveal({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 30,
  scaleIn = true,
  once = true,
  className = '',
}: ViewportRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        scale: scaleIn ? 0.98 : 1,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ViewportReveal;
