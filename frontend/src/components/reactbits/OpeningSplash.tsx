import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import Ballpit from './Ballpit';
import MaskedHeading from './MaskedHeading';

export function OpeningSplash() {
  const [visible, setVisible] = useState(() => {
    // Show opening splash once per browser session
    const seen = sessionStorage.getItem('hasSeenPortalIntro');
    return !seen;
  });
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          dismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  const dismiss = () => {
    sessionStorage.setItem('hasSeenPortalIntro', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 bg-slate-950 text-white overflow-hidden"
        >
          {/* Background Interactive Ballpit */}
          <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
            <Ballpit
              count={160}
              gravity={0.5}
              friction={0.99}
              wallBounce={0.95}
              followCursor={true}
              colors={[0x4f46e5, 0x7c3aed, 0x06b6d4, 0xd97706]}
              lightIntensity={220}
            />
          </div>

          {/* Top Header Tag */}
          <div className="relative z-10 w-full max-w-5xl flex justify-between items-center pt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Next-Gen Java Career Operating System</span>
            </div>

            {/* Countdown Badge & Skip Button */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                Intro: <strong className="text-brand font-bold">{timeLeft}s</strong>
              </span>
              <button
                type="button"
                onClick={dismiss}
                className="px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 shadow-lg backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Skip Intro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Masked Heading Title */}
          <div className="relative z-10 my-auto text-center space-y-4 max-w-4xl px-4 pointer-events-none">
            <MaskedHeading
              text="Java Job Portal"
              tag="h1"
              mediaType="image"
              fillScale={1.3}
              parallax={32}
              reveal="rise"
              duration={1.2}
              align="center"
              textScale={0.11}
              className="drop-shadow-2xl"
            />
            <p className="text-base sm:text-xl text-slate-300 font-medium max-w-xl mx-auto backdrop-blur-sm bg-black/20 p-2 rounded-xl">
              Empowering Tech Careers with AI Skill-Matching, ATS Diagnostics, & Interactive Roadmaps
            </p>
          </div>

          {/* Progress Bar & Footer */}
          <div className="relative z-10 w-full max-w-md pb-6 space-y-3 text-center">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 10, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-brand via-violet-500 to-amber-400 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Interact with the 3D physics ballpit or move pointer for glowing effects
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OpeningSplash;
