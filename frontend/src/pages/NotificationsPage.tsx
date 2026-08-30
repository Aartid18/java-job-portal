import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PressButton from '../components/PressButton';
import LiveDot from '../components/LiveDot';
import { EmptyState, Skeleton, AnimatedSection } from '../components/ui';
import { getErrorMessage } from '../lib/api';
import { notificationsApi, type NotificationItem } from '../lib/notificationsApi';
import { useLivePoll } from '../hooks/useLivePoll';

export default function NotificationsPage() {
  const [error, setError] = useState('');

  const { data, loading, updatedAt, refresh } = useLivePoll(
    async () => {
      const { data: items } = await notificationsApi.list();
      return items;
    },
    8_000,
    true
  );

  const items: NotificationItem[] = data || [];

  const markRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      await refresh(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <AnimatedSection>
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-label">Inbox</p>
              <LiveDot />
            </div>
            <h1 className="text-h1 text-ink">Notifications</h1>
            {updatedAt && (
              <p className="text-xs text-ink-faint mt-1">Live · synced {updatedAt.toLocaleTimeString()}</p>
            )}
          </div>
          <motion.div whileTap={{ scale: 0.96 }}>
            <PressButton variant="ghost" onClick={() => void refresh(false)}>
              Refresh
            </PressButton>
          </motion.div>
        </header>
      </AnimatedSection>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-danger"
        >
          {error}
        </motion.p>
      )}
      {loading && !data ? (
        <Skeleton className="h-40" />
      ) : items.length === 0 ? (
        <AnimatedSection variant="hero">
          <EmptyState title="All caught up" description="Status changes and interview invites will show here." />
        </AnimatedSection>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((n, idx) => (
              <motion.li
                key={n.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className={`ui-panel p-4 space-y-2 ${n.read ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between gap-3">
                  <h3 className="text-h3 text-ink">{n.title}</h3>
                  {!n.read && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <PressButton
                        variant="ghost"
                        className="!min-h-8 !px-3 !py-1 text-xs"
                        onClick={() => void markRead(n.id)}
                      >
                        Mark read
                      </PressButton>
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-ink-muted">{n.message}</p>
                <p className="text-xs text-ink-faint">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
