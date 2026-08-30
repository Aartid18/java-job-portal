import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useCursorZone } from '../../context/CursorZoneContext';
import { useAppReducedMotion } from '../../lib/motion';

const ZONE_COLORS = {
  hero: 'rgba(99, 102, 241, 0.18)',
  jobs: 'rgba(6, 182, 212, 0.18)',
  dashboard: 'rgba(124, 58, 237, 0.18)',
  forms: 'rgba(16, 185, 129, 0.16)',
  default: 'rgba(79, 70, 229, 0.14)',
};

export function ReactiveCursor() {
  const { activeZone } = useCursorZone();
  const shouldReduceMotion = useAppReducedMotion();

  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useSpring(-100, {
    damping: 25,
    stiffness: 300,
  });

  const mouseY = useSpring(-100, {
    damping: 25,
    stiffness: 300,
  });

  const ringX = useSpring(-100, {
    damping: 35,
    stiffness: 180,
  });

  const ringY = useSpring(-100, {
    damping: 35,
    stiffness: 180,
  });

  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 768;

    if (isTouch || shouldReduceMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);

      ringX.set(event.clientX);
      ringY.set(event.clientY);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [
    mouseX,
    mouseY,
    ringX,
    ringY,
    shouldReduceMotion,
  ]);

  if (!enabled) {
    return null;
  }

  const glowColor =
    ZONE_COLORS[activeZone as keyof typeof ZONE_COLORS] ||
    ZONE_COLORS.default;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
        }}
        className="fixed top-0 left-0 w-[380px] h-[380px] rounded-full blur-3xl"
      />

      {/* Outer cursor ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: glowColor,
        }}
        animate={{
          width: hovering ? 60 : 34,
          height: hovering ? 60 : 34,
          opacity: hovering ? 0.9 : 0.55,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        className="fixed top-0 left-0 rounded-full border"
      />

      {/* Inner glowing dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: glowColor.replace(
            /[\d.]+\)$/,
            '1)'
          ),
        }}
        animate={{
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
          scale: hovering ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 20,
        }}
        className="fixed top-0 left-0 rounded-full"
      />
    </div>
  );
}

export default ReactiveCursor;
