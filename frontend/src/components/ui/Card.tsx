import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return <div className={`ui-panel p-6 ${hover ? '' : 'hover:shadow-[var(--shadow-1)]'} ${className}`}>{children}</div>;
}

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-[12px] bg-brand-muted text-brand flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-ink-muted font-medium">{label}</p>
        <h3 className="text-2xl font-bold font-display text-ink">{value}</h3>
      </div>
    </Card>
  );
}
