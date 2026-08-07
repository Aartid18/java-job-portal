import { useEffect, useState } from 'react';
import { Skeleton, StatCard } from '../components/ui';
import { api, getErrorMessage } from '../lib/api';
import { Users, Briefcase, FileText, Shield } from 'lucide-react';

interface AdminOverview {
  users: number;
  candidates: number;
  recruiters: number;
  openJobs: number;
  applications: number;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: overview } = await api.get<AdminOverview>('/api/admin/overview');
        if (!cancelled) setData(overview);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header>
        <p className="text-label">Admin</p>
        <h1 className="text-h1 text-ink">Platform overview</h1>
      </header>
      {error && <p className="text-sm text-danger">{error}</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={<Users size={22} />} label="Users" value={String(data.users)} />
          <StatCard icon={<Shield size={22} />} label="Candidates" value={String(data.candidates)} />
          <StatCard icon={<Briefcase size={22} />} label="Open jobs" value={String(data.openJobs)} />
          <StatCard icon={<FileText size={22} />} label="Applications" value={String(data.applications)} />
        </div>
      )}
      {data && (
        <p className="text-sm text-ink-muted">Recruiters registered: {data.recruiters}</p>
      )}
    </div>
  );
}
