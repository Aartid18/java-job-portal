import type { ReactNode } from 'react';
import Button from './Button';

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="text-center py-12 px-4 space-y-4">
      {icon && <div className="flex justify-center text-brand">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-h3 text-ink">{title}</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
