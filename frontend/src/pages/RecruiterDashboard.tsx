import { useEffect, useMemo, useState } from 'react';
import { Briefcase, Search, Users } from 'lucide-react';
import PressButton from '../components/PressButton';
import LiveActivityFeed from '../components/LiveActivityFeed';
import LiveDot from '../components/LiveDot';
import { EmptyState, Skeleton, StatCard } from '../components/ui';
import { getErrorMessage } from '../lib/api';
import { applicationsApi, type Application } from '../lib/applicationsApi';
import { jobsApi, type Job } from '../lib/jobsApi';
import { api } from '../lib/api';
import { useLivePoll } from '../hooks/useLivePoll';

const STATUSES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'ASSESSMENT', 'OFFER', 'HIRED', 'REJECTED'];

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salaryRange: '',
    requiredSkills: '',
    requiredExperienceYears: 0,
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [j, a] = await Promise.all([jobsApi.listMine(), applicationsApi.listForRecruiter()]);
      setJobs(j.data);
      setApps(a.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Keep applicant list live without full-page reload
  useLivePoll(
    async () => {
      const a = await applicationsApi.listForRecruiter();
      setApps(a.data);
      return a.data;
    },
    15_000,
    !loading
  );

  const filteredApps = useMemo(() => {
    let list = apps;
    if (selectedJobId !== 'all') list = list.filter((a) => a.jobId === selectedJobId);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.candidateName?.toLowerCase().includes(q) ||
          a.jobTitle?.toLowerCase().includes(q) ||
          a.skillGapAnalysis?.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
  }, [apps, selectedJobId, query]);

  const createJob = async () => {
    setSaving(true);
    setError('');
    try {
      await jobsApi.create(form);
      setShowForm(false);
      setForm({
        title: '',
        description: '',
        location: '',
        salaryRange: '',
        requiredSkills: '',
        requiredExperienceYears: 0,
      });
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const { data } = await applicationsApi.updateStatus(id, status);
      setApps((list) => list.map((a) => (a.id === id ? data : a)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const scheduleInterview = async (applicationId: number) => {
    const when = new Date();
    when.setDate(when.getDate() + 3);
    when.setHours(10, 0, 0, 0);
    try {
      await api.post('/api/recruiter/interviews', {
        applicationId,
        scheduledAt: when.toISOString().slice(0, 19),
        meetingLink: 'https://meet.example.com/demo',
        notes: 'Intro call',
      });
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-h1 text-ink">Recruiter Hub</h1>
            <LiveDot />
          </div>
          <p className="text-ink-muted">Post roles and review ranked applicants — list auto-syncs.</p>
        </div>
        <PressButton variant="primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Post New Job'}
        </PressButton>
      </header>

      <LiveActivityFeed mode="recruiter" />

      {error && <p className="text-sm text-danger" role="alert">{error}</p>}

      {showForm && (
        <div className="ui-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {(
            [
              ['title', 'Title'],
              ['location', 'Location'],
              ['salaryRange', 'Salary range'],
              ['requiredSkills', 'Required skills (comma-separated)'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block space-y-1">
              <span className="text-sm font-medium">{label}</span>
              <input
                className="ui-input"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block space-y-1 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="ui-input !h-auto py-2 min-h-[96px]"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Years experience</span>
            <input
              type="number"
              min={0}
              className="ui-input"
              value={form.requiredExperienceYears}
              onChange={(e) => setForm((f) => ({ ...f, requiredExperienceYears: Number(e.target.value) }))}
            />
          </label>
          <div className="flex items-end">
            <PressButton variant="primary" disabled={saving} onClick={() => void createJob()}>
              {saving ? 'Publishing…' : 'Publish job'}
            </PressButton>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Briefcase size={22} />} label="Your jobs" value={String(jobs.length)} />
        <StatCard icon={<Users size={22} />} label="Applications" value={String(apps.length)} />
        <StatCard
          icon={<Users size={22} />}
          label="Avg match"
          value={
            apps.length
              ? `${Math.round(apps.reduce((s, a) => s + (a.compatibilityScore || 0), 0) / apps.length)}%`
              : '—'
          }
        />
      </div>

      <div className="ui-panel p-6 space-y-4">
        <h2 className="text-h2 text-ink">Your postings</h2>
        {jobs.length === 0 ? (
          <EmptyState title="No jobs yet" description="Publish your first role to start receiving applications." />
        ) : (
          <ul className="space-y-2">
            {jobs.map((j) => (
              <li key={j.id} className="flex flex-wrap justify-between gap-2 text-sm border-b border-line py-2">
                <span className="font-medium text-ink">{j.title}</span>
                <span className="text-ink-muted">
                  {j.status} · {j.location || 'Remote'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ui-panel p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-h2 text-ink">Ranked applicants</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              className="ui-input sm:w-48"
              value={selectedJobId === 'all' ? 'all' : String(selectedJobId)}
              onChange={(e) =>
                setSelectedJobId(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
            >
              <option value="all">All jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candidates…"
                className="ui-input ui-input--with-icon"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredApps.map((a) => (
            <div key={a.id} className="candidate-row p-5 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-h3 text-ink">{a.candidateName || 'Candidate'}</h4>
                  <p className="text-sm text-ink-muted">Applied for {a.jobTitle}</p>
                </div>
                <span className="ui-chip ui-chip--info shrink-0">
                  {a.compatibilityScore != null ? `${Math.round(a.compatibilityScore)}% match` : 'No score'}
                </span>
              </div>
              {a.skillGapAnalysis && (
                <p className="text-xs text-ink-faint whitespace-pre-wrap bg-surface-2 rounded-[12px] p-3 border border-line">
                  {a.skillGapAnalysis}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-ink-muted">Status:</span>
                <select
                  className="ui-input !h-9 !min-h-0 text-sm w-auto"
                  value={a.status}
                  onChange={(e) => void updateStatus(a.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <PressButton
                  variant="ghost"
                  className="!min-h-9 !px-3 !py-1 text-xs"
                  onClick={() => void scheduleInterview(a.id)}
                >
                  Schedule interview
                </PressButton>
              </div>
            </div>
          ))}
          {filteredApps.length === 0 && (
            <EmptyState
              title="No applications"
              description="Candidates who apply will appear here ranked by skill match."
              actionLabel="Clear filters"
              onAction={() => {
                setQuery('');
                setSelectedJobId('all');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
