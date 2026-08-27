import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppReducedMotion } from '../../lib/motion';

export function Hero3DScene() {
  const shouldReduceMotion = useAppReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center p-4 overflow-visible">
      {/* Outer Glowing Ambient Orb */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-brand/20 to-blue-500/20 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.8, 0.5],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3D Interactive Isometric Card & Coffee Machine Illustration Platform */}
      <motion.div
        className="relative z-10 w-full h-full rounded-3xl bg-surface-2/40 backdrop-blur-xl border border-line/60 shadow-2xl p-6 flex flex-col items-center justify-between"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotateY: mousePos.x,
                rotateX: -mousePos.y,
              }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Floating Java Code Nodes */}
        <div className="w-full flex justify-between items-center text-xs font-mono text-ink-muted border-b border-line/40 pb-3">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            JVM 21.0.4 Online
          </span>
          <span className="text-brand font-semibold">Spring Boot 3.3</span>
        </div>

        {/* Central Stylized Java Coffee Machine & Globe SVG */}
        <div className="relative my-auto flex flex-col items-center justify-center">
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 text-white flex items-center justify-center shadow-xl shadow-amber-900/30"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-16 h-16 md:w-20 md:20 text-amber-200"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" strokeDasharray="2 2" className="animate-bounce" />
              <line x1="10" y1="1" x2="10" y2="4" strokeDasharray="2 2" className="animate-bounce delay-150" />
              <line x1="14" y1="1" x2="14" y2="4" strokeDasharray="2 2" className="animate-bounce delay-300" />
            </svg>
          </motion.div>

          {/* Floating Badge Chips around the model */}
          <motion.div
            className="absolute -top-4 -left-8 bg-surface border border-line rounded-xl px-3 py-1.5 shadow-lg text-xs font-semibold text-ink flex items-center gap-2"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -6, 0],
                  }
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            High Performance
          </motion.div>

          <motion.div
            className="absolute -bottom-2 -right-8 bg-surface border border-line rounded-xl px-3 py-1.5 shadow-lg text-xs font-semibold text-ink flex items-center gap-2"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, 6, 0],
                  }
            }
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Verified Recruiter Match
          </motion.div>
        </div>

        {/* Footer Stats Strip inside 3D Card */}
        <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-line/40 text-center">
          <div>
            <p className="text-xs text-ink-muted">Jobs</p>
            <p className="text-sm font-bold text-ink">1,400+</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Avg Salary</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">₹18 LPA</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Matched</p>
            <p className="text-sm font-bold text-brand">98%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Hero3DScene;
