import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_CUSTOM, useAppReducedMotion } from '../../lib/motion';

export function OpeningSplash() {
  const shouldReduceMotion = useAppReducedMotion();
  const [hasSeen] = useState(() => !!sessionStorage.getItem('hasSeenPortalIntro'));

  // Stages: 'hold' (0-1.8s) -> 'split' (1.8s-2.7s) -> 'done'
  const [stage, setStage] = useState<'hold' | 'split' | 'done'>('hold');

  useEffect(() => {
    if (hasSeen) {
      setStage('done');
      return;
    }

    if (shouldReduceMotion) {
      sessionStorage.setItem('hasSeenPortalIntro', 'true');
      setStage('done');
      return;
    }

    // Step 1: Solid curtain hold for 1.8 seconds
    const timer1 = setTimeout(() => {
      setStage('split');
    }, 1800);

    // Step 2: Split curtain animation completes after 0.9s (at 2.7s total)
    const timer2 = setTimeout(() => {
      sessionStorage.setItem('hasSeenPortalIntro', 'true');
      setStage('done');
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [hasSeen, shouldReduceMotion]);

  if (stage === 'done' || hasSeen) return null;

  return (
    <AnimatePresence>
      {(stage === 'hold' || stage === 'split') && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {/* Left Panel: white -> lavender -> violet, translates UPWARD off-screen */}
          <motion.div
            initial={{ y: '0%' }}
            animate={stage === 'split' ? { y: '-100%' } : { y: '0%' }}
            transition={{ duration: 0.9, ease: EASE_CUSTOM }}
            className="absolute top-0 left-0 w-1/2 h-full pointer-events-auto"
            style={{
              background: 'linear-gradient(160deg, #ffffff, #c7d2fe 40%, #7c3aed)',
            }}
          />
          {/* Right Panel: violet -> lavender -> white, translates DOWNWARD off-screen */}
          <motion.div
            initial={{ y: '0%' }}
            animate={stage === 'split' ? { y: '100%' } : { y: '0%' }}
            transition={{ duration: 0.9, ease: EASE_CUSTOM }}
            className="absolute top-0 left-[50vw] w-1/2 h-full pointer-events-auto"
            style={{
              background: 'linear-gradient(160deg, #7c3aed, #c7d2fe 60%, #ffffff)',
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

export default OpeningSplash;
