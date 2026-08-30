import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_CUSTOM, useAppReducedMotion } from '../../lib/motion';

export function OpeningSplash() {
  const shouldReduceMotion = useAppReducedMotion();

  // Curtain appears every time the page loads/refreshed
  const [stage, setStage] = useState<'hold' | 'split' | 'done'>('hold');

  useEffect(() => {
    // If user prefers reduced motion, skip the animation
    if (shouldReduceMotion) {
      setStage('done');
      return;
    }

    // Step 1: Hold curtain for 1.8 seconds
    const timer1 = setTimeout(() => {
      setStage('split');
    }, 1800);

    // Step 2: Finish curtain animation after 0.9 seconds
    const timer2 = setTimeout(() => {
      setStage('done');
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [shouldReduceMotion]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      {(stage === 'hold' || stage === 'split') && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ y: '0%' }}
            animate={stage === 'split' ? { y: '-100%' } : { y: '0%' }}
            transition={{
              duration: 0.9,
              ease: EASE_CUSTOM,
            }}
            className="absolute top-0 left-0 w-1/2 h-full pointer-events-auto"
            style={{
              background:
                'linear-gradient(160deg, #ffffff, #c7d2fe 40%, #7c3aed)',
            }}
          >
            {/* WEL */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                letterSpacing: '0.12em',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                letterSpacing: '0.04em',
              }}
              transition={{
                duration: 0.8,
                ease: EASE_CUSTOM,
              }}
              className="absolute inset-0 flex items-center justify-center select-none"
            >
              <span
                className="font-black italic whitespace-nowrap"
                style={{
                  fontFamily:
                    '"Playfair Display", "Times New Roman", serif',
                  fontSize: 'clamp(5rem, 12vw, 12rem)',
                  lineHeight: 0.8,
                  color: '#000000ff',
                  textShadow:
                    '0 10px 35px rgba(76, 29, 149, 0.25)',
                }}
              >
                WEL
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ y: '0%' }}
            animate={stage === 'split' ? { y: '100%' } : { y: '0%' }}
            transition={{
              duration: 0.9,
              ease: EASE_CUSTOM,
            }}
            className="absolute top-0 left-[50vw] w-1/2 h-full pointer-events-auto"
            style={{
              background:
                'linear-gradient(160deg, #7c3aed, #c7d2fe 60%, #ffffff)',
            }}
          >
            {/* COME */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                letterSpacing: '0.12em',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                letterSpacing: '0.04em',
              }}
              transition={{
                duration: 0.8,
                ease: EASE_CUSTOM,
              }}
              className="absolute inset-0 flex items-center justify-center select-none"
            >
              <span
                className="font-black italic whitespace-nowrap"
                style={{
                  fontFamily:
                    '"Playfair Display", "Times New Roman", serif',
                  fontSize: 'clamp(4rem, 10vw, 10rem)',
                  lineHeight: 0.8,
                  color: '#000000ff',
                  textShadow:
                    '0 10px 35px rgba(76, 29, 149, 0.25)',
                }}
              >
                COME
              </span>
            </motion.div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}

export default OpeningSplash;