import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function IconButton({
  children,
  className = '',
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; label: string }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`icon-btn ${className}`}
      aria-label={label}
      title={label}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}
