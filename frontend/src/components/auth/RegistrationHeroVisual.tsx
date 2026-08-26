import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function RegistrationHeroVisual() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Mouse Parallax & 3D Tilt values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers
  const tiltX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  const layer2X = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - left) / width - 0.5;
    const yVal = (e.clientY - top) / height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const skillTags = [
    { name: 'Java Developer', speed: 8, delay: 0, pos: 'top-[8%] left-[6%]', badge: 'Core' },
    { name: 'Spring Boot', speed: 10, delay: 1, pos: 'top-[16%] right-[8%]', badge: 'Backend' },
    { name: 'React', speed: 7, delay: 0.5, pos: 'top-[42%] left-[4%]', badge: 'Frontend' },
    { name: 'SQL', speed: 9, delay: 1.5, pos: 'top-[48%] right-[6%]', badge: 'Database' },
    { name: 'Backend', speed: 11, delay: 2, pos: 'bottom-[32%] left-[8%]', badge: 'API' },
    { name: 'Full Stack', speed: 8.5, delay: 0.8, pos: 'bottom-[22%] right-[10%]', badge: 'System' },
    { name: 'Data Structures', speed: 12, delay: 1.2, pos: 'bottom-[10%] left-[12%]', badge: 'DSA' },
    { name: 'Available for opportunities', speed: 9.5, delay: 0.3, pos: 'bottom-[6%] right-[16%]', highlight: true },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[580px] lg:min-h-[680px] rounded-3xl overflow-hidden flex items-center justify-center p-6 select-none bg-gradient-to-br from-slate-900/90 via-indigo-950/80 to-slate-950 border border-indigo-500/20 shadow-2xl backdrop-blur-xl"
    >
      {/* Background Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.2, 1],
                  x: [0, 40, 0],
                  y: [0, -30, 0],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-600/25 blur-3xl"
        />
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.25, 1],
                  x: [0, -50, 0],
                  y: [0, 40, 0],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
        {/* Fine Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#818cf80a_1px,transparent_1px),linear-gradient(to_bottom,#818cf80a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Skill Tags (Differential Motion) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {skillTags.map((tag) => (
          <motion.div
            key={tag.name}
            style={reducedMotion ? {} : { x: layer1X, y: layer1Y }}
            animate={
              reducedMotion
                ? {}
                : {
                    y: [0, -12, 0, 12, 0],
                    rotate: [0, 1.5, -1, 0],
                  }
            }
            transition={{
              duration: tag.speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: tag.delay,
            }}
            className={`absolute ${tag.pos} transition-transform`}
          >
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg ${
                tag.highlight
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
                  : 'bg-slate-800/80 border-indigo-500/30 text-indigo-200 hover:border-indigo-400/50'
              }`}
            >
              {tag.highlight && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
              {tag.badge && !tag.highlight && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {tag.badge}
                </span>
              )}
              <span>{tag.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main 3D Card Stack (Centered Composition) */}
      <motion.div
        style={reducedMotion ? {} : { rotateX: tiltX, rotateY: tiltY }}
        className="relative z-20 w-full max-w-md space-y-4 perspective-1000"
      >
        {/* Floating Job Card 1 - Senior Java Engineer */}
        <motion.div
          style={reducedMotion ? {} : { x: layer2X, y: layer2Y }}
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, -8, 0],
                  rotate: [0, 1, 0],
                }
          }
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-indigo-400/60 transition-colors"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                ☕
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  Senior Java Tech Lead
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </h4>
                <p className="text-xs text-indigo-200/70">Fintech Platform • Bengaluru / Remote</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              ₹18–28 LPA
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-indigo-500/15 text-indigo-300/80">
            <div className="flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>3 direct recruiter matches</span>
            </div>
            <span className="text-[11px] text-indigo-400/60 font-mono">Posted 1h ago</span>
          </div>
        </motion.div>

        {/* Floating Job Card 2 - Spring Boot Microservices Architect */}
        <motion.div
          style={reducedMotion ? {} : { x: layer1X, y: layer1Y }}
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, 10, 0],
                  rotate: [0, -1.5, 0],
                }
          }
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="p-5 rounded-2xl bg-indigo-950/80 border border-purple-500/30 shadow-2xl backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-purple-400/60 transition-colors"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md font-mono">
                SB
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Spring Boot Architect</h4>
                <p className="text-xs text-indigo-200/70">Enterprise Cloud SaaS • Hybrid</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span>96% Match</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Java 21', 'Spring Cloud', 'Kafka', 'Docker', 'PostgreSQL'].map((st) => (
              <span key={st} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/80 text-indigo-300 border border-indigo-500/20">
                {st}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Floating Job Card 3 - Full Stack Developer */}
        <motion.div
          style={reducedMotion ? {} : { x: layer2X, y: layer2Y }}
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, -6, 0],
                  rotate: [0, 0.8, 0],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="p-4 rounded-2xl bg-slate-900/85 border border-cyan-500/25 shadow-xl backdrop-blur-xl flex items-center justify-between gap-3 group hover:border-cyan-400/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
              FS
            </div>
            <div>
              <h5 className="font-semibold text-white text-xs">Full Stack Engineer (Java + React)</h5>
              <p className="text-[11px] text-indigo-200/60">New Opportunity • Fast Track Hiring</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
            Immediate Joiner
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
