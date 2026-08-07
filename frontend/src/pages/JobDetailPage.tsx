import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PressButton from '../components/PressButton';
import { Skeleton } from '../components/ui';
import { getErrorMessage } from '../lib/api';
import { applicationsApi } from '../lib/applicationsApi';
import { jobsApi, type Job } from '../lib/jobsApi';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const jobId = Number(id);
    if (!jobId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await jobsApi.get(jobId);
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const apply = async () => {
    if (!job) return;
    setApplying(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await applicationsApi.apply(job.id);
      setSuccess(
        `Applied! Match score: ${data.compatibilityScore != null ? Math.round(data.compatibilityScore) + '%' : 'n/a'}`
      );
      setTimeout(() => navigate('/candidate/applications'), 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-danger">{error || 'Job not found'}</p>
        <Link to="/candidate/jobs" className="text-brand text-sm">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link to="/candidate/jobs" className="text-sm text-brand">
        ← All jobs
      </Link>
      <header className="space-y-2">
        <h1 className="text-h1 text-ink">{job.title}</h1>
        <p className="text-ink-muted">
          {job.companyName || job.recruiterName} · {job.location} · {job.salaryRange || 'Salary TBD'}
        </p>
        {job.jobQualityScore != null && (
          <p className="text-xs text-ink-faint">Posting quality score: {job.jobQualityScore}/100</p>
        )}
      </header>

      <section className="ui-panel p-6 space-y-4">
        <div>
          <h2 className="text-h3 mb-2">Description</h2>
          <p className="text-sm text-ink-muted whitespace-pre-wrap">{job.description}</p>
        </div>
        <div>
          <h2 className="text-h3 mb-2">Required skills</h2>
          <p className="text-sm text-ink">{job.requiredSkills}</p>
        </div>
        <p className="text-sm text-ink-muted">Experience: {job.requiredExperienceYears ?? 0}+ years</p>
      </section>

      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}

      <PressButton variant="primary" disabled={applying} onClick={() => void apply()}>
        {applying ? 'Applying…' : 'Apply now'}
      </PressButton>
    </div>
  );
}
