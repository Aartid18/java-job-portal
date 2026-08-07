import type { ReactNode } from 'react';

export default function Badge({
  children,
  tone = 'info',
  className = '',
}: {
  children: ReactNode;
  tone?: 'info' | 'success' | 'warn';
  className?: string;
}) {
  return <span className={`ui-chip ui-chip--${tone} ${className}`}>{children}</span>;
}
