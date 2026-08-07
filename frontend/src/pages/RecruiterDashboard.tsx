import { useState } from 'react';
import { Users, TrendingUp, Search, Briefcase } from 'lucide-react';
import PressButton from '../components/PressButton';

const candidates = [
  {
    name: 'Alex Johnson',
    role: 'Java Backend Developer',
    score: '94% AI Match',
    chip: 'ui-chip--success',
    positives: ['+ Strong Java experience', '+ 4/5 required technical skills', '+ Immediate availability'],
    negatives: ['- Missing Docker'],
  },
  {
    name: 'Sarah Williams',
    role: 'Java Backend Developer',
    score: '88% AI Match',
    chip: 'ui-chip--info',
    positives: ['+ Excellent technical match'],
    negatives: ['- 60-day notice period'],
  },
];

export default function RecruiterDashboard() {
  const [posted, setPosted] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <header className="reveal flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
        <div className="space-y-2">
          <h1 className="text-h1 text-ink">Recruiter Hub</h1>
          <p className="text-ink-muted">Manage jobs and review AI-ranked candidates.</p>
        </div>
        <PressButton variant="primary" onClick={() => setPosted(true)}>
          {posted ? 'Job Draft Ready ✓' : 'Post New Job'}
        </PressButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Briefcase, label: 'Active Jobs', value: '12', tone: 'bg-brand-muted text-brand' },
          { icon: Users, label: 'Total Applications', value: '348', tone: 'bg-surface-2 text-ink' },
          { icon: TrendingUp, label: 'Time-to-Hire', value: '14 Days', tone: 'bg-brand-muted text-brand' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`ui-panel p-6 flex items-center gap-4 reveal reveal-delay-${i + 1}`}
          >
            <div className={`w-12 h-12 rounded-[12px] ${stat.tone} flex items-center justify-center`}>
              <stat.icon size={22} />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-ink-muted font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold font-display text-ink">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="ui-panel p-6 reveal reveal-delay-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-h2 text-ink">Explainable Candidate Ranking</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidates…"
              className="ui-input"
              aria-label="Search candidates"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.name} className="candidate-row p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="text-h3 text-ink">{c.name}</h4>
                  <p className="text-sm text-ink-muted">Applied for {c.role}</p>
                </div>
                <span className={`ui-chip ${c.chip} shrink-0`}>{c.score}</span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-surface-2 rounded-[12px] p-4 border border-line">
                <div className="space-y-2">
                  {c.positives.map((p) => (
                    <span key={p} className="text-success font-semibold flex items-center gap-1">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  {c.negatives.map((n) => (
                    <span key={n} className="text-ink-muted font-medium flex items-center gap-1">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="font-display text-lg font-semibold text-ink">No candidates match</p>
              <p className="text-sm text-ink-muted">Try a different skill or name.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
