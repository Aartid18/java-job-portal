import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { useAppReducedMotion, heroSceneScaleEntrance, heroFadeUp } from '../../lib/motion';
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

  const entranceVariant = shouldReduceMotion ? heroFadeUp : heroSceneScaleEntrance;

  return (
    <motion.div
      variants={entranceVariant}
      className="relative w-full max-w-xl mx-auto min-h-[380px] sm:min-h-[420px] flex items-center justify-center p-4 overflow-hidden rounded-3xl border border-line/60 bg-surface-2/30 backdrop-blur-xl shadow-2xl"
    >

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

        {/* Center Element: Gentle floating Coffee Cup / Java Icon */}
        <div className="relative my-auto flex flex-col items-center justify-center w-full py-6">
          <motion.div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 shadow-2xl flex items-center justify-center border border-amber-300/30"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Coffee className="w-14 h-14 sm:w-16 sm:h-16 text-amber-100 drop-shadow-md stroke-[1.5]" />
          </motion.div>

          {/* Floating Badge Chips around the model */}
          <motion.div
            className="absolute top-2 -left-4 sm:-left-8 bg-surface border border-line rounded-xl px-3 py-1.5 shadow-lg text-xs font-semibold text-ink flex items-center gap-2"
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
            className="absolute bottom-2 -right-4 sm:-right-8 bg-surface border border-line rounded-xl px-3 py-1.5 shadow-lg text-xs font-semibold text-ink flex items-center gap-2"
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
    </motion.div>
  );
}

export default Hero3DScene;
