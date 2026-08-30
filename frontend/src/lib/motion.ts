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
    transition: { duration: 0.35, ease: 'easeInOut' as const },
  },
};

export const chipPopVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: EASE_SPRING },
  exit: { opacity: 0, scale: 0.8, transition: TRANSITION_FAST },
};

/* ==========================================================================
   Section-Entrance Choreography (Addendum 2 B)
   Mapping Guidelines:
   - heroZoomIn: Main page hero headlines, primary hero CTA banners
   - heroZoomOutSettle: Hero background illustrations and ambient showcase frames
   - gridExplode: Feature bento grids, why-choose-us icon cards, recruiter stats
   - converge: Onboarding profile summary cards & success verification modals
   - listLinearReveal: Job marketplace lists, notifications feed, applicant rankings
   - statsCircularReveal: Metric badges, skill readiness score rings, admin highlights
   ========================================================================== */

export const heroZoomIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_CUSTOM },
  },
};

/** Coordinated Hero Entrance Timeline Variants */
export const heroSequenceContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const heroSceneScaleEntrance = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: EASE_CUSTOM },
  },
};

export const heroFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_CUSTOM },
  },
};

export const heroZoomOutSettle = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_CUSTOM },
  },
};

export const gridExplodeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const gridExplodeItem = {
  hidden: { opacity: 0, scale: 0.4, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: EASE_SPRING,
  },
};

export const convergeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const convergeItemLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITION_BASE,
  },
};

export const convergeItemRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITION_BASE,
  },
};

export const listLinearReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      delay: i * 0.06,
      ease: EASE_CUSTOM,
    },
  }),
};

export const statsCircularReveal = {
  hidden: { opacity: 0, scale: 0.7, rotate: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: EASE_SPRING,
  },
};

/** Hook wrapper to detect user reduced motion preferences */
export function useAppReducedMotion() {
  return useReducedMotion();
}
