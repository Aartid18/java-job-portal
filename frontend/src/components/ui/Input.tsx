import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  withIcon?: boolean;
};

export default function Input({ label, hint, error, withIcon, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <input
        id={inputId}
        className={`ui-input ${withIcon ? 'ui-input--with-icon' : ''} ${className}`}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      />
      {error ? (
        <span className="text-xs text-danger" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-ink-faint">{hint}</span>
      ) : null}
    </label>
  );
}
