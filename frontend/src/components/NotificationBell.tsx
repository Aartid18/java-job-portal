import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLivePoll } from '../hooks/useLivePoll';
import { getErrorMessage } from '../lib/api';
import { notificationsApi, type NotificationItem } from '../lib/notificationsApi';
import { useAppReducedMotion, shakeVariants, scaleIn } from '../lib/motion';
import { IconButton } from './ui';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const prevUnread = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useAppReducedMotion();

  const { data, refresh } = useLivePoll<NotificationItem[]>(
    async () => {
      const { data: items } = await notificationsApi.list();
      return items;
    },
    10_000,
    isAuthenticated
  );

  const items = data || [];
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (prevUnread.current !== null && unread > prevUnread.current) {
      const newest = items.find((n) => !n.read);
      setToast(newest?.title || 'New notification');
      setShaking(true);
      const timer = window.setTimeout(() => setShaking(false), 500);
      const t = window.setTimeout(() => setToast(null), 4200);
      return () => {
        window.clearTimeout(timer);
        window.clearTimeout(t);
      };
    }
    prevUnread.current = unread;
  }, [unread, items]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!isAuthenticated) return null;

  const markRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      await refresh(true);
    } catch (err) {
      setToast(getErrorMessage(err));
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <motion.div animate={shaking && !shouldReduceMotion ? shakeVariants.shake : undefined}>
        <IconButton
          label={unread ? `${unread} unread notifications` : 'Notifications'}
          onClick={() => setOpen((v) => !v)}
          className="relative"
        >
          <Bell size={18} />
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="notif-badge"
              aria-hidden
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </IconButton>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="notif-panel origin-top-right"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <p className="text-sm font-semibold text-ink">Live alerts</p>
              <Link
                to="/candidate/notifications"
                className="text-xs text-brand font-medium"
                onClick={() => setOpen(false)}
              >
                View all
              </Link>
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {items.length === 0 && (
                <li className="px-4 py-8 text-sm text-ink-muted text-center">No alerts yet</li>
              )}
              {items.slice(0, 6).map((n) => (
                <li key={n.id} className={`px-4 py-3 border-b border-line last:border-0 ${n.read ? 'opacity-60' : ''}`}>
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] text-ink-faint">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </span>
                    {!n.read && (
                      <button
                        type="button"
                        className="text-[11px] text-brand font-medium"
                        onClick={() => void markRead(n.id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="live-toast"
            role="status"
          >
            <span className="live-dot" aria-hidden />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
