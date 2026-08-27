import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmptyState, Skeleton, AnimatedSection } from '../components/ui';
import { getErrorMessage } from '../lib/api';
import { applicationsApi, type Application } from '../lib/applicationsApi';

const STATUS_COLOR: Record<string, string> = {
  APPLIED: 'ui-chip--info',
  SHORTLISTED: 'ui-chip--success',
  INTERVIEW: 'ui-chip--brand',
  ASSESSMENT: 'ui-chip--warn',
  OFFER: 'ui-chip--success',
  HIRED: 'ui-chip--success',
  REJECTED: 'ui-chip--danger',
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await applicationsApi.listMine();
        if (!cancelled) setApps(data);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <AnimatedSection variant="fadeUp">
        <header>
          <p className="text-label">Pipeline</p>
          <h1 className="text-h1 text-ink">My applications</h1>
        </header>
      </AnimatedSection>

      {error && <p className="text-sm text-danger">{error}</p>}
      {loading ? (
        <Skeleton className="h-40" />
      ) : apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse open roles and apply with one click."
          actionLabel="Browse jobs"
          onAction={() => navigate('/candidate/jobs')}
        />
      ) : (
        <ul className="space-y-3">
          {apps.map((a, idx) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="ui-panel p-5 space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <button
                    type="button"
                    className="text-h3 text-ink hover:text-brand text-left"
                    onClick={() => navigate(`/candidate/jobs/${a.jobId}`)}
                  >
                    {a.jobTitle}
                  </button>
                  <p className="text-sm text-ink-muted">{a.companyOrPoster}</p>
                </div>
                <span className={`ui-chip ${STATUS_COLOR[a.status] || ''}`}>{a.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
                {a.compatibilityScore != null && <span>Match: {Math.round(a.compatibilityScore)}%</span>}
                {a.appliedAt && (
                  <span>
                    Applied {(() => {
                      const d = new Date(a.appliedAt);
                      return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString();
                    })()}
                  </span>
                )}
              </div>
              {a.skillGapAnalysis && (
                <p className="text-xs text-ink-faint whitespace-pre-wrap">{a.skillGapAnalysis}</p>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
