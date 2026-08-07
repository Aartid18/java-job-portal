import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLivePoll } from '../hooks/useLivePoll';
import { applicationsApi, type Application } from '../lib/applicationsApi';
import { notificationsApi, type NotificationItem } from '../lib/notificationsApi';
import LiveDot from './LiveDot';

type Activity = {
  id: string;
  title: string;
  detail: string;
  at: string | null;
  href?: string;
};

export default function LiveActivityFeed({ mode }: { mode: 'seeker' | 'recruiter' }) {
  const { isAuthenticated } = useAuth();

  const { data, updatedAt, loading } = useLivePoll(
    async () => {
      if (mode === 'seeker') {
        const [apps, notes] = await Promise.all([
          applicationsApi.listMine(),
          notificationsApi.list(),
        ]);
        return { apps: apps.data, notes: notes.data };
      }
      const apps = await applicationsApi.listForRecruiter();
      const notes = await notificationsApi.list();
      return { apps: apps.data, notes: notes.data };
    },
    12_000,
    isAuthenticated
  );

  const activities: Activity[] = [];
  const apps: Application[] = data?.apps || [];
  const notes: NotificationItem[] = data?.notes || [];

  notes.slice(0, 4).forEach((n) => {
    activities.push({
      id: `n-${n.id}`,
      title: n.title,
      detail: n.message,
      at: n.createdAt,
      href: '/candidate/notifications',
    });
  });

  apps.slice(0, 4).forEach((a) => {
    activities.push({
      id: `a-${a.id}`,
      title: mode === 'recruiter' ? `${a.candidateName || 'Candidate'} · ${a.status}` : `${a.jobTitle} · ${a.status}`,
      detail:
        mode === 'recruiter'
          ? `Match ${a.compatibilityScore != null ? Math.round(a.compatibilityScore) + '%' : 'n/a'} for ${a.jobTitle}`
          : a.companyOrPoster || 'Application update',
      at: a.appliedAt,
      href: mode === 'recruiter' ? '/recruiter' : '/candidate/applications',
    });
  });

  activities.sort((a, b) => {
    const ta = a.at ? new Date(a.at).getTime() : 0;
    const tb = b.at ? new Date(b.at).getTime() : 0;
    return tb - ta;
  });

  return (
    <section className="ui-panel p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LiveDot label="Live feed" />
          <h2 className="text-h3 text-ink">Activity</h2>
        </div>
        {updatedAt && (
          <span className="text-[11px] text-ink-faint">Synced {updatedAt.toLocaleTimeString()}</span>
        )}
      </div>

      {loading && !data ? (
        <p className="text-sm text-ink-muted">Listening for updates…</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-ink-muted">
          {mode === 'recruiter'
            ? 'New applicants and status changes will stream here.'
            : 'Applications and alerts will appear here as they happen.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {activities.slice(0, 6).map((item) => (
            <li key={item.id} className="live-activity-row">
              <div className="live-activity-rail" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink truncate">{item.title}</p>
                <p className="text-xs text-ink-muted line-clamp-2">{item.detail}</p>
                {item.at && (
                  <p className="text-[11px] text-ink-faint mt-1">{new Date(item.at).toLocaleString()}</p>
                )}
              </div>
              {item.href && (
                <Link to={item.href} className="text-xs text-brand font-medium shrink-0">
                  Open
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
