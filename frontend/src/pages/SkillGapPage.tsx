import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, Skeleton } from '../components/ui';
import { getErrorMessage } from '../lib/api';
import { jobsApi, type Job } from '../lib/jobsApi';
import { onboardingApi } from '../lib/onboardingApi';

function tokenize(s?: string | null): Set<string> {
  return new Set(
    (s || '')
      .toLowerCase()
      .split(/[,;|/]+/)
      .map((x) => x.trim())
      .filter(Boolean)
  );
}

export default function SkillGapPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mySkills, setMySkills] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [jobsRes, profileRes] = await Promise.all([
          jobsApi.listOpen(0, 50),
          onboardingApi.getState().catch(() => null),
        ]);
        if (cancelled) return;
        setJobs(jobsRes.data.content || []);
        const skills =
          profileRes?.data.skills?.map((s) => s.name).filter(Boolean).join(', ') || '';
        setMySkills(skills);
        if (jobsRes.data.content?.[0]) setSelectedId(jobsRes.data.content[0].id);
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

  const selected = jobs.find((j) => j.id === selectedId) || null;

  const analysis = useMemo(() => {
    if (!selected) return null;
    const mine = tokenize(mySkills);
    const required = tokenize(selected.requiredSkills);
    const matched = [...required].filter((s) => mine.has(s));
    const missing = [...required].filter((s) => !mine.has(s));
    const score = required.size ? Math.round((matched.length / required.size) * 100) : 0;
    return { matched, missing, score };
  }, [selected, mySkills]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-label">Skill gap</p>
        <h1 className="text-h1 text-ink">Compare your skills to a role</h1>
      </header>

      {error && <p className="text-sm text-danger">{error}</p>}

      <label className="block space-y-1">
        <span className="text-sm font-medium">Your skills (editable)</span>
        <textarea
          className="ui-input !h-auto py-2 min-h-[64px]"
          value={mySkills}
          onChange={(e) => setMySkills(e.target.value)}
          placeholder="java, spring, react…"
        />
      </label>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs to compare" description="Open roles will appear here." />
      ) : (
        <>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Target job</span>
            <select
              className="ui-input"
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.companyName || j.location}
                </option>
              ))}
            </select>
          </label>

          {analysis && selected && (
            <div className="ui-panel p-6 space-y-4">
              <div className="flex items-end justify-between">
                <h2 className="text-h3">Match estimate</h2>
                <span className="text-3xl font-display font-bold text-brand">{analysis.score}%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-success mb-1">Matched</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.matched.length ? (
                    analysis.matched.map((s) => (
                      <span key={s} className="ui-chip ui-chip--success">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-ink-muted">None</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-warn mb-1">Gaps to close</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing.length ? (
                    analysis.missing.map((s) => (
                      <span key={s} className="ui-chip ui-chip--warn">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-ink-muted">No gaps detected</span>
                  )}
                </div>
              </div>
              <Link
                to={`/candidate/jobs/${selected.id}`}
                className="press-btn press-btn--soft inline-flex text-sm px-4 py-2 rounded-[12px]"
              >
                View job
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
