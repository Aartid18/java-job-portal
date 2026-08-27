import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useCursorZone } from '../../context/CursorZoneContext';
import { useAppReducedMotion } from '../../lib/motion';

const ZONE_COLORS = {
  hero: 'rgba(99, 102, 241, 0.12)',      // Soft Indigo
  jobs: 'rgba(6, 182, 212, 0.12)',        // Soft Cyan
  dashboard: 'rgba(124, 58, 237, 0.12)',   // Soft Violet
  forms: 'rgba(16, 185, 129, 0.10)',      // Soft Emerald
  default: 'rgba(79, 70, 229, 0.09)',
};

/**
 * Phase 17 — Subtle Pointer Atmosphere
 * Provides a lightweight, pointer-following ambient background glow on desktop
 * without hiding or modifying the native OS browser cursor.
 */
export function ReactiveCursor() {
  const { activeZone } = useCursorZone();
  const shouldReduceMotion = useAppReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const glowX = useSpring(-200, springConfig);
  const glowY = useSpring(-200, springConfig);

  useEffect(() => {
    // Disable on touch devices or under reduced-motion preference
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isTouch || shouldReduceMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      glowX.set(e.clientX);
      glowY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [glowX, glowY, shouldReduceMotion]);

  if (!enabled) return null;

  const glowColor = ZONE_COLORS[activeZone] || ZONE_COLORS.default;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background Soft Pointer Radial Atmosphere */}
      <motion.div
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
        }}
        className="fixed top-0 left-0 w-[420px] h-[420px] rounded-full filter blur-2xl pointer-events-none"
      />
    </div>
  );
}

export default ReactiveCursor;
