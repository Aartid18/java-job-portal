import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CursorZone = 'hero' | 'jobs' | 'dashboard' | 'forms' | 'default';

interface CursorZoneContextType {
  activeZone: CursorZone;
  setZone: (zone: CursorZone) => void;
  hoveredElement: 'button' | 'card' | 'link' | null;
  setHoveredElement: (el: 'button' | 'card' | 'link' | null) => void;
}

const CursorZoneContext = createContext<CursorZoneContextType>({
  activeZone: 'default',
  setZone: () => {},
  hoveredElement: null,
  setHoveredElement: () => {},
});

export function CursorZoneProvider({ children }: { children: ReactNode }) {
  const [activeZone, setActiveZone] = useState<CursorZone>('default');
  const [hoveredElement, setHoveredElement] = useState<'button' | 'card' | 'link' | null>(null);

  useEffect(() => {
    // Listen for mousemove over elements with data-cursor-zone attribute
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const zoneEl = target.closest('[data-cursor-zone]') as HTMLElement | null;
      if (zoneEl) {
        const zone = zoneEl.getAttribute('data-cursor-zone') as CursorZone;
        if (zone && zone !== activeZone) {
          setActiveZone(zone);
        }
      }

      // Check interactive hover elements for cursor morph
      if (target.closest('button, .press-btn, [role="button"]')) {
        setHoveredElement('button');
      } else if (target.closest('a, [href]')) {
        setHoveredElement('link');
      } else if (target.closest('.ui-panel, .candidate-row, [data-tilt]')) {
        setHoveredElement('card');
      } else {
        setHoveredElement(null);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [activeZone]);

  return (
    <CursorZoneContext.Provider value={{ activeZone, setZone: setActiveZone, hoveredElement, setHoveredElement }}>
      {children}
    </CursorZoneContext.Provider>
  );
}

export function useCursorZone() {
  return useContext(CursorZoneContext);
}
