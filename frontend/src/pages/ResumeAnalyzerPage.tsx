import { useState } from 'react';
import PressButton from '../components/PressButton';
import { getErrorMessage } from '../lib/api';
import { resumeApi, type ResumeAnalysis } from '../lib/resumeApi';

export default function ResumeAnalyzerPage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (file?: File) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await resumeApi.analyze(file);
      setAnalysis(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const bars = analysis
    ? [
        ['Content', analysis.contentScore],
        ['Skills', analysis.skillsScore],
        ['Structure', analysis.structureScore],
        ['ATS-style', analysis.atsScore],
        ['Impact', analysis.impactScore],
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-label">Resume Analyzer</p>
        <h1 className="text-h1 text-ink">ATS-style compatibility analysis</h1>
        <p className="text-ink-muted text-sm">Heuristic scoring from your PDF — does not claim universal ATS coverage.</p>
      </header>

      <div className="ui-panel p-6 space-y-4">
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void run(f);
          }}
        />
        <PressButton variant="ghost" disabled={loading} onClick={() => void run()}>
          {loading ? 'Analyzing…' : 'Analyze stored resume'}
        </PressButton>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {analysis && (
        <div className="ui-panel p-6 space-y-5">
          <div className="flex items-end justify-between">
            <h2 className="text-h2 text-ink">Resume Score</h2>
            <span className="text-3xl font-display font-bold text-brand">{analysis.score}/100</span>
          </div>
          <div className="space-y-3">
            {bars.map(([label, score]) => (
              <div key={String(label)} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">{label}</span>
                  <span className="font-semibold">{score as number}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full" style={{ width: `${score}%`, background: 'var(--gradient-primary)' }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-h3 mb-2">Skills found</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsFound?.length
                ? analysis.skillsFound.map((s) => (
                    <span key={s} className="ui-chip ui-chip--info">{s}</span>
                  ))
                : <span className="text-sm text-ink-muted">None detected</span>}
            </div>
          </div>
          <div>
            <h3 className="text-h3 mb-2">Suggestions</h3>
            <ul className="space-y-1 text-sm text-ink-muted">
              {analysis.suggestions?.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
