import { useEffect, useRef } from 'react';

export interface ObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Lightweight native IntersectionObserver hook (0 KB extra dependency).
 * Attaches the '.visible' CSS class when the element enters the viewport.
 */
export function useIntersectionObserverReveal<T extends HTMLElement = HTMLDivElement>(
  options: ObserverOptions = {}
) {
  const elementRef = useRef<T | null>(null);
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Honor prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      el.classList.add('visible');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return elementRef;
}

export default useIntersectionObserverReveal;
