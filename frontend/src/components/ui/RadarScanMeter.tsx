import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RadarScanMeterProps {
  score: number;
  loading?: boolean;
}

export function RadarScanMeter({ score, loading = false }: RadarScanMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (loading) {
      setAnimatedScore(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 800);
      setAnimatedScore(Math.round(score * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, loading]);

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = loading
    ? circumference * 0.75
    : circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center select-none">
      {/* Background Outer Ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="currentColor"
          strokeWidth="8"
          className="text-surface-2"
          fill="transparent"
        />
        {/* Animated Fill Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={loading ? { repeat: Infinity, duration: 1.2, ease: 'linear' } : { duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand, #4f46e5)" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Radar Scanning Sweep overlay if loading */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-brand/50"
        />
      )}

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {loading ? (
          <span className="text-xs font-bold text-brand uppercase tracking-wider animate-pulse">Scanning…</span>
        ) : (
          <>
            <span className="text-3xl font-extrabold font-display text-ink">{animatedScore}%</span>
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">ATS Score</span>
          </>
        )}
      </div>
    </div>
  );
}
