import { useRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';

type PressButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'soft';
};

export default function PressButton({
  variant = 'primary',
  className = '',
  onClick,
  children,
  ...props
}: PressButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (el) {
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
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`press-btn press-btn--${variant} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="press-btn__label">{children}</span>
    </button>
  );
}
