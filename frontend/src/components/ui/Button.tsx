import { useRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'soft';
  loading?: boolean;
};

/** Primary design-system button (alias of PressButton behavior). */
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
    <button
      ref={ref}
      type={type}
      className={`press-btn press-btn--${variant} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="press-btn__label">{loading ? 'Loading…' : children}</span>
    </button>
  );
}
