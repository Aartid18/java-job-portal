import { useEffect, useState } from 'react';
import PressButton from '../components/PressButton';
import { EmptyState, Skeleton } from '../components/ui';
import { api, getErrorMessage } from '../lib/api';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<NotificationItem[]>('/api/notifications');
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const markRead = async (id: number) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <p className="text-label">Inbox</p>
        <h1 className="text-h1 text-ink">Notifications</h1>
      </header>
      {error && <p className="text-sm text-danger">{error}</p>}
      {loading ? (
        <Skeleton className="h-40" />
      ) : items.length === 0 ? (
        <EmptyState title="All caught up" description="Status changes and interview invites will show here." />
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`ui-panel p-4 space-y-2 ${n.read ? 'opacity-70' : ''}`}
            >
              <div className="flex justify-between gap-3">
                <h3 className="text-h3 text-ink">{n.title}</h3>
                {!n.read && (
                  <PressButton variant="ghost" className="!min-h-8 !px-3 !py-1 text-xs" onClick={() => void markRead(n.id)}>
                    Mark read
                  </PressButton>
                )}
              </div>
              <p className="text-sm text-ink-muted">{n.message}</p>
              <p className="text-xs text-ink-faint">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
