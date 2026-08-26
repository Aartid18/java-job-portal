import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useAppReducedMotion } from '../../lib/motion';

export interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, disabled, className = '', ...props }, ref) => {
    const shouldReduceMotion = useAppReducedMotion();

    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
    }[size];

    const variantClasses = {
      primary: 'bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20 active:bg-brand-hover',
      secondary: 'bg-surface-2 text-ink border border-line hover:bg-surface hover:border-brand/30',
      ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-2/70',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20',
      soft: 'bg-brand-muted/50 text-brand hover:bg-brand-muted',
    }[variant];

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={shouldReduceMotion || disabled || loading ? undefined : { scale: 1.03 }}
        whileTap={shouldReduceMotion || disabled || loading ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
