import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PressButton from '../components/PressButton';
import LiveDot from '../components/LiveDot';
import { EmptyState, Skeleton } from '../components/ui';
import { useLivePoll } from '../hooks/useLivePoll';
import { jobsApi, type Job } from '../lib/jobsApi';

export default function JobBrowsePage() {
  const [page, setPage] = useState(0);
  const [q, setQ] = useState('');

  const { data, loading, error, updatedAt, refresh } = useLivePoll(
    async () => {
      const res = await jobsApi.listOpen(page, 20);
      return res.data;
    },
    20_000,
    true
  );

  useEffect(() => {
    void refresh(false);
  }, [page, refresh]);

  const jobs: Job[] = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const filtered = q.trim()
    ? jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q.toLowerCase()) ||
          j.requiredSkills?.toLowerCase().includes(q.toLowerCase()) ||
          j.location?.toLowerCase().includes(q.toLowerCase())
      )
    : jobs;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-label">Jobs</p>
            <LiveDot />
          </div>
          <h1 className="text-h1 text-ink">Open roles</h1>
          {updatedAt && (
            <p className="text-xs text-ink-faint">Auto-refreshes · last sync {updatedAt.toLocaleTimeString()}</p>
          )}
        </div>
        <PressButton variant="ghost" onClick={() => void refresh(false)}>
          Refresh now
        </PressButton>
      </header>

      <input
        className="ui-input max-w-md"
        placeholder="Filter by title, skill, location…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {error && <p className="text-sm text-danger">{error}</p>}
      {loading && !data ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No open jobs" description="Check back soon or adjust your filter." />
      ) : (
        <ul className="space-y-3">
          {filtered.map((job) => (
            <li key={job.id} className="ui-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <Link to={`/candidate/jobs/${job.id}`} className="text-h3 text-ink hover:text-brand">
                  {job.title}
                </Link>
                <p className="text-sm text-ink-muted mt-1">
                  {job.companyName || job.recruiterName || 'Company'} · {job.location || 'Remote'} ·{' '}
                  {job.salaryRange || 'Salary TBD'}
                </p>
                <p className="text-xs text-ink-faint mt-1 line-clamp-1">{job.requiredSkills}</p>
              </div>
              <Link
                to={`/candidate/jobs/${job.id}`}
                className="press-btn press-btn--soft text-sm px-4 py-2 rounded-[12px]"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex gap-2">
          <PressButton variant="ghost" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
            Prev
          </PressButton>
          <span className="text-sm text-ink-muted self-center">
            Page {page + 1} / {totalPages}
          </span>
          <PressButton variant="ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </PressButton>
        </div>
      )}
    </div>
  );
}
