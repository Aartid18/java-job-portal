import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MatchConstellationBackground } from './backgrounds/MatchConstellationBackground';
import { FloatingCareerIcons } from './backgrounds/FloatingCareerIcons';
import { SkillConstellationBackground } from './backgrounds/SkillConstellationBackground';

export default function AtmosphereBackground() {
  const { pathname } = useLocation();

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

  const isAuthOrWizard = ['/login', '/register', '/onboarding', '/forgot-password', '/reset-password'].includes(pathname);
  const isSkillGap = pathname === '/candidate/skill-gap';

  return (
    <div className="atmosphere" aria-hidden="true">
      {/* Signature Background Selection */}
      {isAuthOrWizard ? (
        <FloatingCareerIcons />
      ) : isSkillGap ? (
        <SkillConstellationBackground />
      ) : (
        <MatchConstellationBackground />
      )}

      {/* Dynamic Background Mesh Gradient */}
      <div className="atmosphere__mesh" />

      {/* Floating Animated Ambient Glowing Orbs */}
      <div className="atmosphere__orb-1" />
      <div className="atmosphere__orb-2" />
      <div className="atmosphere__orb-3" />

      {/* Precision Grid Overlay */}
      <div className="atmosphere__grid" />

      {/* Noise Grain Texture */}
      <div className="atmosphere__grain" />
    </div>
  );
}
