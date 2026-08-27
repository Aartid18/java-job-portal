import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppReducedMotion } from '../../lib/motion';
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
  const shouldReduceMotion = useAppReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="text-center py-12 px-4 space-y-4"
    >
      {icon && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center text-brand"
        >
          {icon}
        </motion.div>
      )}
      <div className="space-y-1.5">
        <motion.h3
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-h3 text-ink"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm text-ink-muted max-w-md mx-auto"
        >
          {description}
        </motion.p>
      </div>
      {actionLabel && onAction && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
