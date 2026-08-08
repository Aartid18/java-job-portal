import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Compass, Sparkles, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { EmptyState, Skeleton } from '../components/ui';
import { CareerCopilotDrawer } from '../components/CareerCopilotDrawer';
import { getErrorMessage } from '../lib/api';
import { jobsApi, type Job } from '../lib/jobsApi';
import { careerRoadmapApi, type SkillGapDetail } from '../lib/careerRoadmapApi';

export default function SkillGapPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const jobsRes = await jobsApi.listOpen(0, 50);
        if (cancelled) return;
        const jobList = jobsRes.data.content || [];
        setJobs(jobList);
        if (jobList.length > 0) {
          const firstId = jobList[0].id;
          setSelectedId(firstId);
          loadGapDetail(firstId);
        } else {
          loadGapDetail(null);
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
  }, []);

  const loadGapDetail = async (jobId: number | null) => {
    try {
      setAnalyzing(true);
      setError('');
      const res = await careerRoadmapApi.getSkillGap(jobId);
      setSkillGap(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to calculate skill gap breakdown'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectJob = (id: number) => {
    setSelectedId(id);
    loadGapDetail(id);
  };

  const selectedJob = jobs.find((j) => j.id === selectedId) || null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-label">Skill Gap Intelligence</p>
          <h1 className="text-h1 text-ink">Explainable Skill Match & Gaps</h1>
          <p className="text-sm text-ink-muted">
            Compare your verified candidate profile against real role requirements with canonical synonym normalization.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCopilotOpen(true)}
            className="press-btn press-btn--primary !min-h-10 !px-4 !py-2 text-sm flex items-center gap-2 cursor-pointer"
          >
            <Bot size={16} />
            Ask Copilot
          </button>
          <Link
            to={`/career-roadmap${selectedId ? `?jobId=${selectedId}` : ''}`}
            className="press-btn press-btn--soft !min-h-10 !px-4 !py-2 text-sm flex items-center gap-2"
          >
            <Compass size={16} />
            30-Day Roadmap
          </Link>
        </div>
      </header>

      {error && <p className="text-sm text-danger">{error}</p>}

      {jobs.length === 0 ? (
        <EmptyState title="No open roles to compare" description="Check back once recruiters post active positions." />
      ) : (
        <div className="space-y-6">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-ink">Select Target Role to Analyze:</span>
            <select
              className="ui-input font-medium"
              value={selectedId ?? ''}
              onChange={(e) => handleSelectJob(Number(e.target.value))}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.companyName || j.location || 'Remote'} (Req: {j.requiredSkills})
                </option>
              ))}
            </select>
          </label>

          {analyzing ? (
            <div className="ui-panel p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
              <p className="text-sm text-ink-muted">Analyzing canonical skill ontology and required tool compatibility...</p>
            </div>
          ) : skillGap && (
            <div className="space-y-6">
              {/* Top Score Matrix */}
              <div className="ui-panel p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-ink-muted tracking-wider">Overall Match Readiness</span>
                    <h2 className="text-2xl font-bold text-ink mt-1">
                      {skillGap.targetRole}
                    </h2>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Company / Poster: <strong>{skillGap.companyOrPoster}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900">
                      <span className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                        {skillGap.overallReadiness}%
                      </span>
                      <span className="text-[10px] text-ink-muted block uppercase font-bold">Readiness Score</span>
                    </div>
                  </div>
                </div>

                {/* 4 Score Breakdown Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-surface-2 border border-line">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Technical Skills</span>
                      <span>{skillGap.technicalSkillsScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${skillGap.technicalSkillsScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-surface-2 border border-line">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Required Tools</span>
                      <span>{skillGap.requiredToolsScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="bg-violet-600 h-full rounded-full" style={{ width: `${skillGap.requiredToolsScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-surface-2 border border-line">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Experience Proof</span>
                      <span>{skillGap.experienceScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${skillGap.experienceScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-surface-2 border border-line">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Resume Evidence</span>
                      <span>{skillGap.resumeEvidenceScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${skillGap.resumeEvidenceScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* Categorized Skills Breakdown */}
                <div className="space-y-4 pt-2">
                  {/* Strong Matches */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Strong Verified Matches ({skillGap.matchedSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.matchedSkills.length > 0 ? (
                        skillGap.matchedSkills.map((s) => (
                          <span key={s} className="ui-chip ui-chip--success text-xs font-medium">
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-ink-muted">No direct skill matches detected yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Partial / Related */}
                  {skillGap.partialSkills && skillGap.partialSkills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-4 h-4" /> Partial / Related Foundations ({skillGap.partialSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.partialSkills.map((s) => (
                          <span key={s} className="ui-chip ui-chip--warn text-xs font-medium">
                            ⚠ {s} (Foundational skills present)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-red-500 dark:text-red-400">
                      <XCircle className="w-4 h-4" /> Missing Technical Skills ({skillGap.missingSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.missingSkills.length > 0 ? (
                        skillGap.missingSkills.map((s) => (
                          <span key={s} className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            ✗ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold">Zero critical technical gaps detected!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Steps CTA */}
                <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-ink-muted">
                    Estimated Match Potential: <strong>{Math.min(96, skillGap.overallReadiness + 18)}%</strong> after completing milestone project.
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedJob && (
                      <Link
                        to={`/candidate/jobs/${selectedJob.id}`}
                        className="press-btn press-btn--ghost !min-h-9 !px-3 !py-1 text-xs"
                      >
                        View Job Details
                      </Link>
                    )}
                    <Link
                      to={`/career-roadmap?jobId=${selectedId}`}
                      className="press-btn press-btn--primary !min-h-9 !px-3.5 !py-1 text-xs flex items-center gap-1.5"
                    >
                      <Compass size={14} />
                      Start 30-Day Roadmap →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Copilot Drawer */}
      <CareerCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        contextJobId={selectedId}
        contextJobTitle={selectedJob?.title}
      />
    </div>
  );
}
