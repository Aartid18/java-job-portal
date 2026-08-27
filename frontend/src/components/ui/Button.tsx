import { useRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'soft';
  loading?: boolean;
};

/** Primary design-system button with Framer Motion tactile micro-interactions & smooth loading transitions. */
export default function Button({
  variant = 'primary',
  className = '',
  onClick,
  children,
  type = 'button',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (el && !loading) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }
    if (!loading) onClick?.(e);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={loading ? undefined : { scale: 1.025, y: -1 }}
      whileTap={loading ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`press-btn press-btn--${variant} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...(props as any)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Processing…</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="press-btn__label"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
