import { useState } from 'react';
import { Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import PressButton from '../components/PressButton';

export default function JobSeekerDashboard() {
  const [applied, setApplied] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <header className="reveal mb-2">
        <h1 className="brand-mark text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Welcome back, Alex
        </h1>
        <p className="text-ink/55 mt-1">Your application health and top matches.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center text-center gap-4 reveal reveal-delay-1">
          <div className="relative score-pulse w-24 h-24 rounded-full flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96" aria-hidden>
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(15,118,110,0.12)" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251"
                strokeDashoffset="37.65"
                style={{ animation: 'score-ring 1.4s ease-out both' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>
            </svg>
            <span className="relative text-2xl font-extrabold text-primary brand-mark">85%</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-ink">Application Health</h3>
            <p className="text-sm text-ink/55 mt-1">
              Looking strong. Add one more project to reach 90%.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 md:col-span-2 reveal reveal-delay-2">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-ink">
            <Briefcase className="text-primary" size={22} /> Top Job Match
          </h3>
          <div className="rounded-2xl p-4 bg-white/70 border border-white/80">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h4 className="font-bold text-lg text-ink">Senior Java Backend Developer</h4>
                <p className="text-ink/50">TechCorp Inc. · San Francisco, CA</p>
              </div>
              <span className="shrink-0 bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">
                92% Match
              </span>
            </div>

            <div className="mt-4">
              <h5 className="font-semibold text-sm mb-2 text-ink/70">Skill Gap Analysis</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-ink/80">
                  <CheckCircle2 className="text-teal-600 shrink-0" size={16} />
                  Matched: Java, Spring Boot, MySQL, REST APIs
                </div>
                <div className="flex items-center gap-2 text-sm text-ink/80">
                  <AlertCircle className="text-amber-500 shrink-0" size={16} />
                  Missing Critical: Docker
                </div>
                <div className="flex items-center gap-2 text-sm text-ink/80">
                  <AlertCircle className="text-slate-400 shrink-0" size={16} />
                  Missing Optional: Kubernetes
                </div>
              </div>
            </div>

            <PressButton
              variant="soft"
              className="mt-6"
              onClick={() => setApplied(true)}
            >
              {applied ? 'Application Sent ✓' : 'Apply Now'}
            </PressButton>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 reveal reveal-delay-3">
        <h3 className="font-bold text-xl mb-5 text-ink">Application Journey</h3>
        <div className="relative">
          <div className="absolute top-4 left-4 h-[calc(100%-1rem)] w-0.5 bg-gradient-to-b from-teal-400 via-sky-400 to-slate-200" />

          <div className="timeline-item flex items-start gap-4 mb-6 relative">
            <div className="timeline-dot w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center z-10">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <h4 className="font-bold text-ink">Applied for Software Engineer at InnovateTech</h4>
              <p className="text-sm text-ink/50">2 days ago</p>
            </div>
          </div>

          <div className="timeline-item flex items-start gap-4 mb-6 relative">
            <div className="timeline-dot w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center z-10">
              <FileText size={16} />
            </div>
            <div>
              <h4 className="font-bold text-ink">Resume Viewed</h4>
              <p className="text-sm text-ink/50">1 day ago · Recruiter has seen your profile.</p>
            </div>
          </div>

          <div className="timeline-item flex items-start gap-4 relative">
            <div className="timeline-dot w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center z-10">
              <Briefcase size={16} />
            </div>
            <div>
              <h4 className="font-bold text-ink/40">Interview</h4>
              <p className="text-sm text-ink/35">Pending…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
