import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export interface ChromaGridItem {
  id: string | number;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  salary?: string;
  image?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  skills?: string[];
  matchScore?: number;
  [key: string]: any;
}

export interface ChromaGridProps {
  items: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  onItemClick?: (item: ChromaGridItem) => void;
}

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
  radius = 280,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  onItemClick,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<any>(null);
  const setY = useRef<any>(null);
  const pos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const data = items || [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');

    const { width, height } = el.getBoundingClientRect();

    pos.current = {
      x: width / 2,
      y: height / 2,
    };

    if (setX.current) setX.current(pos.current.x);
    if (setY.current) setY.current(pos.current.y);

    // GSAP Entrance Stagger Animation
    const cards = el.querySelectorAll('.chroma-card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 25,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }
  }, [items]);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        if (setX.current) setX.current(pos.current.x);
        if (setY.current) setY.current(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;

    const r = root.getBoundingClientRect();

    moveTo(e.clientX - r.left, e.clientY - r.top);

    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 0,
        duration: 0.25,
        overwrite: true,
      });
    }
  };

  const handleLeave = () => {
    if (!fadeRef.current) return;

    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      ease,
      overwrite: true,
    });
  };

  const handleCardClick = (card: ChromaGridItem) => {
    if (onItemClick) {
      onItemClick(card);
      return;
    }

    if (!card.url) return;

    if (card.url.startsWith('/')) {
      window.location.href = card.url;
    } else {
      window.open(card.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows,
      } as React.CSSProperties}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((card, index) => (
        <article
          key={card.id || index}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(card)}
          style={{
            '--card-border': card.borderColor || 'rgba(59, 130, 246, 0.4)',
            '--card-gradient': card.gradient || 'linear-gradient(145deg, #181924, #0F1017)',
            cursor: card.url || onItemClick ? 'pointer' : 'default',
          } as React.CSSProperties}
        >
          {card.image && (
            <div className="chroma-img-wrapper">
              <img src={card.image} alt={card.title} loading="lazy" />
            </div>
          )}

          <footer className="chroma-info">
            <div className="chroma-info-header">
              <h3 className="name">{card.title}</h3>
              {card.handle && <span className="handle">{card.handle}</span>}
            </div>

            <p className="role">{card.subtitle}</p>

            {(card.location || card.salary) && (
              <div className="chroma-info-footer">
                {card.location && <span className="location">📍 {card.location}</span>}
                {card.salary && <span className="salary">{card.salary}</span>}
              </div>
            )}
          </footer>
        </article>
      ))}

      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
