import { useState } from 'react';
import { Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import PressButton from '../components/PressButton';

export default function JobSeekerDashboard() {
  const [applied, setApplied] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <header className="reveal space-y-2">
        <h1 className="text-h1 text-ink">Welcome back, Alex</h1>
        <p className="text-ink-muted">Your application health and top matches.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ui-panel p-6 flex flex-col items-center text-center gap-5 reveal reveal-delay-1">
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-brand-muted">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96" aria-hidden>
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgb(11 95 86 / 0.15)" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#0B5F56"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251"
                strokeDashoffset="37.65"
              />
            </svg>
            <span className="relative text-2xl font-bold font-display text-brand">85%</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-h3 text-ink">Application Health</h3>
            <p className="text-sm text-ink-muted">
              Looking strong. Add one more project to reach 90%.
            </p>
          </div>
        </div>

        <div className="ui-panel p-6 md:col-span-2 reveal reveal-delay-2 space-y-5">
          <h3 className="text-h2 text-ink flex items-center gap-2">
            <Briefcase className="text-brand" size={22} /> Top Job Match
          </h3>
          <div className="rounded-[12px] p-5 bg-surface-2/60 border border-line space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h4 className="text-h3 text-ink">Senior Java Backend Developer</h4>
                <p className="text-sm text-ink-muted">TechCorp Inc. · San Francisco, CA</p>
              </div>
              <span className="ui-chip ui-chip--success shrink-0">92% Match</span>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-ink-muted">Skill Gap Analysis</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-ink">
                  <CheckCircle2 className="text-success shrink-0" size={16} />
                  Matched: Java, Spring Boot, MySQL, REST APIs
                </div>
                <div className="flex items-center gap-2 text-sm text-ink">
                  <AlertCircle className="text-warning shrink-0" size={16} />
                  Missing Critical: Docker
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <AlertCircle className="text-ink-faint shrink-0" size={16} />
                  Missing Optional: Kubernetes
                </div>
              </div>
            </div>

            <PressButton variant="soft" onClick={() => setApplied(true)}>
              {applied ? 'Application Sent ✓' : 'Apply Now'}
            </PressButton>
          </div>
        </div>
      </div>

      <div className="ui-panel p-6 reveal reveal-delay-3 space-y-5">
        <h3 className="text-h2 text-ink">Application Journey</h3>
        <div className="relative">
          <div className="absolute top-4 left-4 h-[calc(100%-1rem)] w-px bg-line" />

          <div className="timeline-item flex items-start gap-4 mb-6 relative">
            <div className="timeline-dot w-8 h-8 rounded-full bg-brand text-surface flex items-center justify-center z-10">
              <CheckCircle2 size={16} />
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="font-semibold text-ink">Applied for Software Engineer at InnovateTech</h4>
              <p className="text-sm text-ink-muted">2 days ago</p>
            </div>
          </div>

          <div className="timeline-item flex items-start gap-4 mb-6 relative">
            <div className="timeline-dot w-8 h-8 rounded-full bg-brand text-surface flex items-center justify-center z-10">
              <FileText size={16} />
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="font-semibold text-ink">Resume Viewed</h4>
              <p className="text-sm text-ink-muted">1 day ago · Recruiter has seen your profile.</p>
            </div>
          </div>

          <div className="timeline-item flex items-start gap-4 relative">
            <div className="timeline-dot w-8 h-8 rounded-full bg-surface-2 text-ink-faint border border-line flex items-center justify-center z-10">
              <Briefcase size={16} />
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="font-semibold text-ink-faint">Interview</h4>
              <p className="text-sm text-ink-faint">Pending…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
