import { useState, type InputHTMLAttributes, type ReactNode } from 'react';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  isValid?: boolean;
  isInvalid?: boolean;
}

export default function FloatingInput({
  label,
  icon,
  rightElement,
  isValid,
  isInvalid,
  value,
  onFocus,
  onBlur,
  className = '',
  id,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isFloating = isFocused || hasValue;
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`relative transition-all duration-200 ${isInvalid ? 'animate-shake' : ''}`}>
      <div
        className={`group relative flex items-center min-h-[56px] rounded-xl border transition-all duration-250 ease-out bg-surface/90 backdrop-blur-sm ${
          isInvalid
            ? 'border-danger/70 shadow-[0_0_0_3px_rgba(239,68,68,0.15)] bg-red-950/5'
            : isFocused
            ? 'border-brand shadow-[0_0_0_4px_rgba(79,70,229,0.18)] bg-surface'
            : isValid
            ? 'border-emerald-500/50 shadow-[0_0_0_2px_rgba(16,185,129,0.1)]'
            : 'border-line hover:border-ink-faint/60 hover:bg-surface'
        }`}
      >
        {/* Input Prefix Icon */}
        {icon && (
          <div
            className={`pl-4 pr-1 flex items-center justify-center transition-colors duration-200 ${
              isFocused ? 'text-brand scale-105' : isValid ? 'text-emerald-500' : 'text-ink-muted group-hover:text-ink'
            }`}
          >
            {icon}
          </div>
        )}

        {/* Label & Input Container */}
        <div className="relative flex-1 py-2 px-3">
          <label
            htmlFor={inputId}
            className={`absolute left-3 transition-all duration-200 ease-out pointer-events-none origin-left select-none ${
              isFloating
                ? 'top-1 text-[11px] font-semibold tracking-wide uppercase text-brand'
                : 'top-1/2 -translate-y-1/2 text-sm text-ink-muted font-normal'
            } ${isInvalid ? 'text-danger' : isValid && !isFocused ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
          >
            {label}
          </label>
          <input
            id={inputId}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className={`w-full bg-transparent border-none p-0 outline-none font-sans text-sm text-ink placeholder-transparent transition-all ${
              isFloating ? 'pt-4 pb-0' : 'pt-0'
            } ${className}`}
            {...props}
          />
        </div>

        {/* Right Element or Valid Icon */}
        <div className="pr-3 flex items-center gap-2">
          {rightElement}
          {isValid && !rightElement && (
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 animate-scale-in">
              <svg className="w-3.5 h-3.5 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
