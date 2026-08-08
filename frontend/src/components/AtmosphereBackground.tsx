import { useEffect } from 'react';

/** Continuous live background: Floating ambient glowing orbs + network mesh + flowing neural SVG lines */
export default function AtmosphereBackground() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--scroll-y', String(window.scrollY));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="atmosphere" aria-hidden="true">
      {/* Dynamic Background Mesh Gradient */}
      <div className="atmosphere__mesh" />

      {/* Floating Animated Ambient Glowing Orbs */}
      <div className="atmosphere__orb-1" />
      <div className="atmosphere__orb-2" />
      <div className="atmosphere__orb-3" />

      {/* Subtle Precision Grid Overlay */}
      <div className="atmosphere__grid" />

      {/* Subtle Noise Texture */}
      <div className="atmosphere__grain" />

      {/* Continuous Animated Neural Match Network SVG */}
      <svg
        className="atmosphere__svg"
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Candidate-to-job matching network</title>
        <defs>
          <linearGradient id="gradLine1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="gradLine2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Candidate Source Nodes */}
        <circle cx="88" cy="120" r="28" fill="#4F46E5" fillOpacity="0.12" stroke="#4F46E5" strokeWidth="1.5" />
        <circle cx="88" cy="120" r="8" fill="#4F46E5" className="atmosphere__pulse-node" />
        <circle cx="72" cy="210" r="22" fill="#4F46E5" fillOpacity="0.1" stroke="#4F46E5" strokeWidth="1.5" />
        <circle cx="72" cy="210" r="6" fill="#4F46E5" />
        <circle cx="110" cy="290" r="24" fill="#7C3AED" fillOpacity="0.1" stroke="#7C3AED" strokeWidth="1.5" />
        <circle cx="110" cy="290" r="7" fill="#7C3AED" className="atmosphere__pulse-node" />

        {/* Job Requirement Target Nodes */}
        <rect x="360" y="88" width="56" height="56" rx="12" fill="#06B6D4" fillOpacity="0.12" stroke="#06B6D4" strokeWidth="1.5" />
        <rect x="378" y="106" width="20" height="20" rx="4" fill="#06B6D4" />
        <rect x="380" y="190" width="48" height="48" rx="12" fill="#4F46E5" fillOpacity="0.1" stroke="#4F46E5" strokeWidth="1.5" />
        <rect x="394" y="204" width="20" height="20" rx="4" fill="#4F46E5" />
        <rect x="350" y="278" width="52" height="52" rx="12" fill="#7C3AED" fillOpacity="0.1" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="366" y="294" width="20" height="20" rx="4" fill="#7C3AED" />

        {/* Continuous Flowing Signal Lines */}
        <path d="M116 120 C210 110, 280 100, 360 116" stroke="url(#gradLine1)" strokeWidth="2" className="atmosphere__flow-line" />
        <path d="M94 210 C200 200, 290 200, 380 214" stroke="#4F46E5" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M134 290 C220 300, 290 300, 350 304" stroke="url(#gradLine2)" strokeWidth="2" className="atmosphere__flow-line" />
        <path d="M116 128 C190 180, 250 220, 380 238" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.35" className="atmosphere__flow-line" />

        {/* Central Matching Nexus Core */}
        <circle cx="250" cy="210" r="22" fill="var(--color-surface)" stroke="#4F46E5" strokeWidth="2" />
        <circle cx="250" cy="210" r="10" fill="#06B6D4" className="atmosphere__pulse-node" />
      </svg>
    </div>
  );
}
