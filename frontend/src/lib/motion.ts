import { useReducedMotion } from 'framer-motion';

// Standardized easing curves
export const EASE_CUSTOM = [0.4, 0, 0.2, 1] as const;
export const EASE_SPRING = { type: 'spring', stiffness: 300, damping: 25 } as const;

// Transition presets
export const TRANSITION_FAST = { duration: 0.18, ease: EASE_CUSTOM };
export const TRANSITION_BASE = { duration: 0.28, ease: EASE_CUSTOM };
export const TRANSITION_SLOW = { duration: 0.38, ease: EASE_CUSTOM };

// Shared Animation Variants
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_BASE,
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: TRANSITION_FAST,
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: TRANSITION_BASE,
  },
  exit: {
    opacity: 0,
    transition: TRANSITION_FAST,
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: TRANSITION_BASE,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: TRANSITION_FAST,
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const wizardStepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: TRANSITION_BASE,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    transition: TRANSITION_FAST,
  }),
};

export const cardHoverVariants = {
  rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  hover: {
    y: -4,
    boxShadow: '0 12px 24px -4px rgba(79, 70, 229, 0.15)',
    transition: TRANSITION_FAST,
  },
};

export const shakeVariants = {
  shake: {
    x: [-8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

export const chipPopVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: EASE_SPRING },
  exit: { opacity: 0, scale: 0.8, transition: TRANSITION_FAST },
};

/** Hook wrapper to detect user reduced motion preferences */
export function useAppReducedMotion() {
  return useReducedMotion();
}
