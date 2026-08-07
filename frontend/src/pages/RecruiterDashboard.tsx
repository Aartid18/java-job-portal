import { useState } from 'react';
import { Users, TrendingUp, Search, Briefcase } from 'lucide-react';
import PressButton from '../components/PressButton';

const candidates = [
  {
    name: 'Alex Johnson',
    role: 'Java Backend Developer',
    score: '94% AI Match',
    scoreClass: 'bg-teal-100 text-teal-800',
    positives: ['+ Strong Java experience', '+ 4/5 required technical skills', '+ Immediate availability'],
    negatives: ['- Missing Docker'],
  },
  {
    name: 'Sarah Williams',
    role: 'Java Backend Developer',
    score: '88% AI Match',
    scoreClass: 'bg-sky-100 text-sky-800',
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
      <header className="reveal flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="brand-mark text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Recruiter Hub
          </h1>
          <p className="text-ink/55 mt-1">Manage jobs and review AI-ranked candidates.</p>
        </div>
        <PressButton variant="primary" onClick={() => setPosted(true)}>
          {posted ? 'Job Draft Ready ✓' : 'Post New Job'}
        </PressButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Briefcase, label: 'Active Jobs', value: '12', tone: 'from-teal-500/15 to-teal-500/5 text-teal-700' },
          { icon: Users, label: 'Total Applications', value: '348', tone: 'from-sky-500/15 to-sky-500/5 text-sky-700' },
          { icon: TrendingUp, label: 'Time-to-Hire', value: '14 Days', tone: 'from-cyan-500/15 to-cyan-500/5 text-cyan-700' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`glass-panel p-6 flex items-center gap-4 reveal reveal-delay-${i + 1}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.tone} flex items-center justify-center`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-ink/50 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-ink brand-mark">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 reveal reveal-delay-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h3 className="font-bold text-xl text-ink">Explainable Candidate Ranking</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-ink/35" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidates…"
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-teal-900/10 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.name} className="candidate-row rounded-2xl p-4 bg-white/75">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h4 className="font-bold text-lg text-ink">{c.name}</h4>
                  <p className="text-sm text-ink/50">Applied for {c.role}</p>
                </div>
                <span className={`${c.scoreClass} font-bold px-3 py-1 rounded-full text-sm shrink-0`}>
                  {c.score}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-mist/80 p-3 rounded-xl">
                <div className="space-y-1">
                  {c.positives.map((p) => (
                    <span key={p} className="text-teal-700 font-semibold flex items-center gap-1">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  {c.negatives.map((n) => (
                    <span key={n} className="text-ink/45 font-medium flex items-center gap-1">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-ink/45 py-8">No candidates match that search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
