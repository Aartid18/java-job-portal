import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useCursorZone } from '../../context/CursorZoneContext';
import { useAppReducedMotion } from '../../lib/motion';

const ZONE_COLORS = {
  hero: 'rgba(99, 102, 241, 0.22)',      // Indigo
  jobs: 'rgba(6, 182, 212, 0.22)',        // Cyan
  dashboard: 'rgba(124, 58, 237, 0.22)',   // Violet
  forms: 'rgba(16, 185, 129, 0.20)',      // Emerald
  default: 'rgba(79, 70, 229, 0.18)',
};

export function ReactiveCursor() {
  const { activeZone, hoveredElement } = useCursorZone();
  const shouldReduceMotion = useAppReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Only enable custom cursor on non-touch desktop screens (>768px)
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isTouch || shouldReduceMotion) {
      setEnabled(false);
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [cursorX, cursorY, shouldReduceMotion]);

  if (!enabled) return null;

  const glowColor = ZONE_COLORS[activeZone] || ZONE_COLORS.default;
  const isHovered = Boolean(hoveredElement);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
      {/* Trailing Radial Glow */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          opacity: isHovered ? 0.9 : 0.6,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-36 h-36 rounded-full filter blur-xl"
      />

      {/* Custom Spring Pointer Arrow */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: hoveredElement === 'button' ? 1.35 : hoveredElement === 'card' ? 1.15 : 1,
          rotate: hoveredElement === 'button' ? -15 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="fixed top-0 left-0 -ml-1 -mt-1 text-brand dark:text-violet-400 drop-shadow-md"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="currentColor"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
