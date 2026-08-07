import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLivePoll } from '../hooks/useLivePoll';
import { getErrorMessage } from '../lib/api';
import { notificationsApi, type NotificationItem } from '../lib/notificationsApi';
import { IconButton } from './ui';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const prevUnread = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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
      const t = window.setTimeout(() => setToast(null), 4200);
      return () => window.clearTimeout(t);
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
      <IconButton
        label={unread ? `${unread} unread notifications` : 'Notifications'}
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="notif-badge" aria-hidden>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </IconButton>

      {open && (
        <div className="notif-panel" role="dialog" aria-label="Notifications">
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
        </div>
      )}

      {toast && (
        <div className="live-toast" role="status">
          <span className="live-dot" aria-hidden />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
