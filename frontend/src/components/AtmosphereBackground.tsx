import { useEffect } from 'react';

/** Subtle canvas: warm mesh + grain + static job-match SVG (no looping particles). */
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
      <div className="atmosphere__mesh" />
      <div className="atmosphere__grain" />
      <svg
        className="atmosphere__svg"
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Candidate-to-job matching network</title>
        {/* Candidate cluster */}
        <circle cx="88" cy="120" r="28" fill="#0B5F56" fillOpacity="0.12" stroke="#0B5F56" strokeWidth="1.5" />
        <circle cx="88" cy="120" r="8" fill="#0B5F56" />
        <circle cx="72" cy="210" r="22" fill="#0B5F56" fillOpacity="0.1" stroke="#0B5F56" strokeWidth="1.5" />
        <circle cx="72" cy="210" r="6" fill="#0B5F56" />
        <circle cx="110" cy="290" r="24" fill="#0B5F56" fillOpacity="0.1" stroke="#0B5F56" strokeWidth="1.5" />
        <circle cx="110" cy="290" r="7" fill="#0B5F56" />

        {/* Job cluster */}
        <rect x="360" y="88" width="56" height="56" rx="12" fill="#E08A1E" fillOpacity="0.12" stroke="#E08A1E" strokeWidth="1.5" />
        <rect x="378" y="106" width="20" height="20" rx="4" fill="#E08A1E" />
        <rect x="380" y="190" width="48" height="48" rx="12" fill="#0B5F56" fillOpacity="0.1" stroke="#0B5F56" strokeWidth="1.5" />
        <rect x="394" y="204" width="20" height="20" rx="4" fill="#0B5F56" />
        <rect x="350" y="278" width="52" height="52" rx="12" fill="#E08A1E" fillOpacity="0.1" stroke="#E08A1E" strokeWidth="1.5" />
        <rect x="366" y="294" width="20" height="20" rx="4" fill="#E08A1E" />

        {/* Match edges */}
        <path d="M116 120 C210 110, 280 100, 360 116" stroke="#0B5F56" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="5 6" />
        <path d="M94 210 C200 200, 290 200, 380 214" stroke="#0B5F56" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M134 290 C220 300, 290 300, 350 304" stroke="#E08A1E" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="5 6" />
        <path d="M116 128 C190 180, 250 220, 380 238" stroke="#0B5F56" strokeWidth="1" strokeOpacity="0.2" />

        {/* Center match node */}
        <circle cx="250" cy="210" r="18" fill="#FFFDF9" stroke="#0B5F56" strokeWidth="1.5" />
        <circle cx="250" cy="210" r="5" fill="#E08A1E" />
      </svg>
    </div>
  );
}
