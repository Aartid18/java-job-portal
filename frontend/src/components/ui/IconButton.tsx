import type { ButtonHTMLAttributes, ReactNode } from 'react';

export default function IconButton({
  children,
  className = '',
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; label: string }) {
  return (
    <button type="button" className={`icon-btn ${className}`} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
