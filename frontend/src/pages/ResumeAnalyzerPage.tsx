import { useState } from 'react';
import { motion } from 'framer-motion';
import PressButton from '../components/PressButton';
import { getErrorMessage } from '../lib/api';
import { resumeApi, type ResumeAnalysis } from '../lib/resumeApi';
import { RadarScanMeter, SpeechBubbleCallout, IconBadgeBullet } from '../components/ui';

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
        <p className="text-ink-muted text-sm">Heuristic scoring from your PDF — evaluates keywords, layout structure, and impact metrics.</p>
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

      {loading && (
        <div className="ui-panel p-8 flex flex-col items-center justify-center space-y-4 text-center">
          <RadarScanMeter score={0} loading={true} />
          <p className="text-sm font-semibold uppercase tracking-widest text-ink-muted animate-pulse">
            Scanning resume PDF structure & extracting skills…
          </p>
        </div>
      )}

      {analysis && !loading && (
        <div className="ui-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-line pb-6">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-h2 text-ink font-bold font-display">ATS Diagnostics Report</h2>
              <p className="text-xs text-ink-muted">Automated breakdown based on industry recruitment heuristics.</p>
            </div>
            <RadarScanMeter score={analysis.score} loading={false} />
          </div>

          <div className="space-y-3">
            {bars.map(([label, score]) => (
              <div key={String(label)} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">{label}</span>
                  <span className="font-semibold">{score as number}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score as number}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-h3 mb-2">Skills Found</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsFound?.length
                ? analysis.skillsFound.map((s) => (
                    <span key={s} className="ui-chip ui-chip--info">{s}</span>
                  ))
                : <span className="text-sm text-ink-muted">None detected</span>}
            </div>
          </div>

          <div>
            <h3 className="text-h3 mb-3">AI Suggestions</h3>
            <div className="space-y-3">
              {analysis.suggestions?.map((s) => (
                <SpeechBubbleCallout key={s} type="ai" title="AI Recommendation">
                  <IconBadgeBullet icon="sparkle" variant="brand">
                    {s}
                  </IconBadgeBullet>
                </SpeechBubbleCallout>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
