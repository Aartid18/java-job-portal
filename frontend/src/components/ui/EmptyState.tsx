import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppReducedMotion, fadeUp } from '../../lib/motion';
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
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="text-center py-12 px-4 space-y-4"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center text-brand"
        >
          {icon}
        </motion.div>
      )}
      <div className="space-y-2">
        <h3 className="text-h3 text-ink">{title}</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">{description}</p>
      </div>
      {actionLabel && onAction && (
        <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
