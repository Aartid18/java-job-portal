import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bot, Compass, Sparkles } from 'lucide-react';
import PressButton from '../components/PressButton';
import { Skeleton } from '../components/ui';
import { CareerCopilotDrawer } from '../components/CareerCopilotDrawer';
import { getErrorMessage } from '../lib/api';
import { applicationsApi } from '../lib/applicationsApi';
import { jobsApi, type Job } from '../lib/jobsApi';
import { careerRoadmapApi, type SkillGapDetail } from '../lib/careerRoadmapApi';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const jobId = Number(id);
    if (!jobId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [jobRes, gapRes] = await Promise.all([
          jobsApi.get(jobId),
          careerRoadmapApi.getSkillGap(jobId).catch(() => ({ data: null })),
        ]);
        if (!cancelled) {
          setJob(jobRes.data);
          if (gapRes.data) setSkillGap(gapRes.data);
        }
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
      <div className="max-w-4xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-danger">{error || 'Job not found'}</p>
        <Link to="/candidate/jobs" className="text-brand text-sm">
          ← Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/candidate/jobs" className="text-sm text-brand flex items-center gap-1">
          ← All jobs
        </Link>
        <button
          onClick={() => setCopilotOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
        >
          <Bot className="w-3.5 h-3.5" />
          Analyze with Copilot
        </button>
      </div>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-h1 text-ink">{job.title}</h1>
          {skillGap && (
            <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-center">
              <span className="text-[10px] uppercase font-bold text-[var(--ink-muted)] block">
                Match Readiness
              </span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {skillGap.overallReadiness}%
              </span>
            </div>
          )}
        </div>
        <p className="text-ink-muted">
          {job.companyName || job.recruiterName} · {job.location} · {job.salaryRange || 'Salary TBD'}
        </p>
        {job.jobQualityScore != null && (
          <p className="text-xs text-ink-faint">Posting quality score: {job.jobQualityScore}/100</p>
        )}
      </header>

      {/* AI Copilot & Skill Gap Quick Insights Banner */}
      {skillGap && (
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 border border-indigo-800/50 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Job Match Breakdown
              </div>
              <h3 className="text-lg font-bold">
                Match Score: {skillGap.overallReadiness}% for your candidate profile
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCopilotOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                Ask Copilot Why
              </button>
              <Link
                to={`/career-roadmap?jobId=${job.id}`}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                30-Day Plan for This Role
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-emerald-400 font-semibold block mb-1">
                ✓ Matched Skills ({skillGap.matchedSkills.length})
              </span>
              <p className="text-slate-300 truncate">
                {skillGap.matchedSkills.length > 0 ? skillGap.matchedSkills.join(', ') : 'None yet'}
              </p>
            </div>
            <div>
              <span className="text-amber-400 font-semibold block mb-1">
                ⚠ Missing Skills ({skillGap.missingSkills.length})
              </span>
              <p className="text-slate-300 truncate">
                {skillGap.missingSkills.length > 0 ? skillGap.missingSkills.join(', ') : 'None!'}
              </p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold block mb-1">Estimated Gain</span>
              <p className="text-slate-300">
                Close gaps to reach <strong>85–95% match</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="ui-panel p-6 space-y-4">
        <div>
          <h2 className="text-h3 mb-2">Description</h2>
          <p className="text-sm text-ink-muted whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>
        <div>
          <h2 className="text-h3 mb-2">Required skills</h2>
          <p className="text-sm text-ink font-medium">{job.requiredSkills}</p>
        </div>
        <p className="text-sm text-ink-muted">Experience: {job.requiredExperienceYears ?? 0}+ years</p>
      </section>

      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-success font-semibold">{success}</p>}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <PressButton variant="primary" disabled={applying} onClick={() => void apply()}>
          {applying ? 'Applying…' : 'Apply now'}
        </PressButton>
        <Link
          to={`/career-roadmap?jobId=${job.id}`}
          className="press-btn press-btn--soft !min-h-10 !px-4 !py-2 text-sm flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4 text-indigo-600" />
          View Learning Roadmap for this Job
        </Link>
      </div>

      {/* Floating Copilot Drawer */}
      <CareerCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        contextJobId={job.id}
        contextJobTitle={job.title}
      />
    </div>
  );
}
