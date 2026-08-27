import { type ReactNode } from 'react';
import useIntersectionObserverReveal from '../../hooks/useIntersectionObserverReveal';

export type RevealEffect =
  | 'zoom-in'
  | 'zoom-out'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'circle'
  | 'spread';

export interface SectionRevealContainerProps {
  children: ReactNode;
  effect?: RevealEffect;
  delayMs?: number;
  className?: string;
  triggerOnce?: boolean;
}

const EFFECT_CLASS_MAP: Record<RevealEffect, string> = {
  'zoom-in': 'zoom-in',
  'zoom-out': 'zoom-out',
  'slide-up': 'slide-in-up',
  'slide-left': 'slide-in-left',
  'slide-right': 'slide-in-right',
  circle: 'circle-reveal',
  spread: 'spread-reveal',
};

/**
 * Reusable Section Container utilizing hardware-accelerated CSS transforms & clip-paths
 * triggered by native IntersectionObserver. Zero heavy library overhead!
 */
export function SectionRevealContainer({
  children,
  effect = 'zoom-in',
  delayMs = 0,
  className = '',
  triggerOnce = true,
}: SectionRevealContainerProps) {
  const ref = useIntersectionObserverReveal<HTMLDivElement>({ triggerOnce });
  const effectClass = EFFECT_CLASS_MAP[effect] || 'zoom-in';

  return (
    <div
      ref={ref}
      className={`section-reveal ${effectClass} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export default SectionRevealContainer;
