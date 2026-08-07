import { useEffect, useMemo, useState } from 'react';
import PressButton from '../components/PressButton';
import { EmptyState, Skeleton } from '../components/ui';
import { getErrorMessage } from '../lib/api';
import { resumeApi, type ResumeVersion } from '../lib/resumeApi';

const TEMPLATES = ['Modern', 'Professional', 'Minimal', 'Technical', 'ATS-friendly'];

type Content = {
  summary: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
};

const emptyContent = (): Content => ({
  summary: '',
  skills: '',
  experience: '',
  education: '',
  projects: '',
});

function parseContent(json?: string): Content {
  try {
    return { ...emptyContent(), ...(json ? JSON.parse(json) : {}) };
  } catch {
    return emptyContent();
  }
}

export default function ResumeBuilderPage() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [title, setTitle] = useState('My Resume');
  const [templateName, setTemplateName] = useState('Modern');
  const [content, setContent] = useState<Content>(emptyContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [enhanceMsg, setEnhanceMsg] = useState('');

  const previewClass = useMemo(() => {
    switch (templateName) {
      case 'Minimal':
        return 'font-body';
      case 'Technical':
        return 'font-mono text-sm';
      case 'ATS-friendly':
        return 'font-body leading-snug';
      default:
        return 'font-display';
    }
  }, [templateName]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await resumeApi.list();
      setVersions(data);
      if (data[0]) selectVersion(data[0]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const selectVersion = (v: ResumeVersion) => {
    setActiveId(v.id);
    setTitle(v.title);
    setTemplateName(v.templateName || 'Modern');
    setContent(parseContent(v.contentJson));
  };

  const save = async () => {
    setSaving(true);
    setError('');
    const body = { title, templateName, contentJson: JSON.stringify(content) };
    try {
      if (activeId) {
        const { data } = await resumeApi.update(activeId, body);
        setVersions((list) => list.map((v) => (v.id === data.id ? data : v)));
      } else {
        const { data } = await resumeApi.create(body);
        setVersions((list) => [data, ...list]);
        setActiveId(data.id);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const enhanceExperience = async () => {
    if (!content.experience.trim()) return;
    setEnhanceMsg('');
    try {
      const firstLine = content.experience.split('\n').find((l) => l.trim()) || content.experience;
      const { data } = await resumeApi.enhanceBullet(firstLine.trim());
      setContent((c) => ({
        ...c,
        experience: c.experience.replace(firstLine.trim(), data.enhanced),
      }));
      setEnhanceMsg('First bullet enhanced (no invented metrics).');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-label">Resume Builder</p>
          <h1 className="text-h1 text-ink">Craft your resume</h1>
        </div>
        <div className="flex gap-2">
          <PressButton variant="ghost" onClick={() => { setActiveId(null); setTitle('New Resume'); setContent(emptyContent()); }}>
            New
          </PressButton>
          <PressButton variant="primary" onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </PressButton>
        </div>
      </header>

      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      {enhanceMsg && <p className="text-sm text-success">{enhanceMsg}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="ui-panel p-4 space-y-2 lg:col-span-1">
          <h2 className="text-h3 text-ink mb-2">Versions</h2>
          {versions.length === 0 && <EmptyState title="No resumes" description="Create your first version." />}
          {versions.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => selectVersion(v)}
              className={`w-full text-left rounded-[12px] px-3 py-2 text-sm border ${
                activeId === v.id ? 'border-brand bg-brand-muted text-brand' : 'border-line text-ink'
              }`}
            >
              {v.title}
            </button>
          ))}
        </aside>

        <section className="ui-panel p-5 space-y-3 lg:col-span-1">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Title</span>
            <input className="ui-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Template</span>
            <select className="ui-input" value={templateName} onChange={(e) => setTemplateName(e.target.value)}>
              {TEMPLATES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          {(['summary', 'skills', 'experience', 'education', 'projects'] as const).map((key) => (
            <label key={key} className="block space-y-1">
              <span className="text-sm font-medium capitalize">{key}</span>
              <textarea
                className="ui-input !h-auto py-2 min-h-[72px]"
                value={content[key]}
                onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
              />
            </label>
          ))}
          <PressButton variant="soft" onClick={() => void enhanceExperience()}>
            Improve experience bullet
          </PressButton>
        </section>

        <section className="ui-panel p-6 lg:col-span-2 space-y-4">
          <h2 className="text-h3 text-ink">Live preview · {templateName}</h2>
          <div className={`rounded-[12px] border border-line bg-surface p-6 space-y-4 ${previewClass}`}>
            <h3 className="text-2xl font-bold text-ink">{title}</h3>
            {content.summary && (
              <div>
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">Summary</p>
                <p className="text-sm text-ink-muted whitespace-pre-wrap">{content.summary}</p>
              </div>
            )}
            {content.skills && (
              <div>
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">Skills</p>
                <p className="text-sm text-ink">{content.skills}</p>
              </div>
            )}
            {content.experience && (
              <div>
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">Experience</p>
                <p className="text-sm text-ink-muted whitespace-pre-wrap">{content.experience}</p>
              </div>
            )}
            {content.education && (
              <div>
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">Education</p>
                <p className="text-sm text-ink-muted whitespace-pre-wrap">{content.education}</p>
              </div>
            )}
            {content.projects && (
              <div>
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">Projects</p>
                <p className="text-sm text-ink-muted whitespace-pre-wrap">{content.projects}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
