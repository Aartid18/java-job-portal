import { Link } from 'react-router-dom';
import { useLivePoll } from '../hooks/useLivePoll';
import { jobsApi, type Job } from '../lib/jobsApi';
import LiveDot from './LiveDot';

export default function LiveMarketStrip() {
  const { data, updatedAt, loading } = useLivePoll(
    async () => {
      const { data: page } = await jobsApi.listOpen(0, 8);
      return page;
    },
    15_000,
    true
  );

  const jobs: Job[] = data?.content || [];
  const total = data?.totalElements ?? 0;

  return (
    <div className="live-market reveal reveal-delay-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <LiveDot />
          <p className="text-sm font-semibold text-ink">
            {loading && !data ? 'Connecting to market…' : `${total} open role${total === 1 ? '' : 's'} right now`}
          </p>
        </div>
        {updatedAt && (
          <span className="text-[11px] text-ink-faint tabular-nums">
            Updated {updatedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="live-ticker" aria-live="polite">
        <div className="live-ticker__track">
          {(jobs.length ? jobs : [{ id: 0, title: 'Waiting for open roles…', companyName: '', location: '' } as Job])
            .concat(jobs)
            .map((job, i) => (
              <span key={`${job.id}-${i}`} className="live-ticker__item">
                <strong className="text-ink">{job.title}</strong>
                <span className="text-ink-muted">
                  {' '}
                  · {job.companyName || job.location || 'Remote'}
                </span>
              </span>
            ))}
        </div>
      </div>

      <div className="mt-3">
        <Link to="/candidate/jobs" className="text-sm text-brand font-medium">
          Browse live jobs →
        </Link>
      </div>
    </div>
  );
}
