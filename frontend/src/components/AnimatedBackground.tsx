import type { CSSProperties } from 'react';

export default function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="animated-bg__mesh" />
      <div className="animated-bg__orb animated-bg__orb--a" />
      <div className="animated-bg__orb animated-bg__orb--b" />
      <div className="animated-bg__orb animated-bg__orb--c" />
      <div className="animated-bg__ring animated-bg__ring--1" />
      <div className="animated-bg__ring animated-bg__ring--2" />
      <div className="animated-bg__float animated-bg__float--1" />
      <div className="animated-bg__float animated-bg__float--2" />
      <div className="animated-bg__float animated-bg__float--3" />
      <div className="animated-bg__particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}
