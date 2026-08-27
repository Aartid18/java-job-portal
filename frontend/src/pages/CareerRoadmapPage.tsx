import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bot,
  RefreshCw,
  BookOpen,
  FolderGit2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  careerRoadmapApi,
  type RoadmapResponse,
  type RoadmapWeek,
} from '../lib/careerRoadmapApi';
import { CareerCopilotDrawer } from '../components/CareerCopilotDrawer';
import { AnimatedSection } from '../components/ui';
import { getErrorMessage } from '../lib/api';

export const CareerRoadmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedSkillParam = searchParams.get('skill');
  const jobIdParam = searchParams.get('jobId');

  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, [jobIdParam]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      let data: RoadmapResponse;
      if (jobIdParam) {
        const res = await careerRoadmapApi.generateRoadmap({ jobId: Number(jobIdParam) });
        data = res.data;
      } else {
        const res = await careerRoadmapApi.getRoadmap();
        data = res.data;
      }
      setRoadmap(data);

      // Auto-expand the week corresponding to selectedSkillParam if provided
      if (selectedSkillParam && data.weeks) {
        const matchingWeek = data.weeks.find((w) =>
          w.skillFocus.toLowerCase().includes(selectedSkillParam.toLowerCase())
        );
        if (matchingWeek) {
          setExpandedWeek(matchingWeek.weekNumber);
        }
      }
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to load personalized career roadmap.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await careerRoadmapApi.generateRoadmap({
        jobId: roadmap?.targetJobId || (jobIdParam ? Number(jobIdParam) : null),
        regenerate: true,
      });
      setRoadmap(res.data);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to regenerate roadmap'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    skillName: string,
    currentStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  ) => {
    try {
      setUpdatingSkill(skillName);
      let nextStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';
      let nextPercent = 50;

      if (currentStatus === 'NOT_STARTED') {
        nextStatus = 'IN_PROGRESS';
        nextPercent = 50;
      } else if (currentStatus === 'IN_PROGRESS') {
        nextStatus = 'COMPLETED';
        nextPercent = 100;
      } else {
        nextStatus = 'NOT_STARTED';
        nextPercent = 0;
      }

      const res = await careerRoadmapApi.updateProgress(skillName, nextStatus, nextPercent);
      setRoadmap(res.data);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to update milestone progress'));
    } finally {
      setUpdatingSkill(null);
    }
  };

  if (loading && !roadmap) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center animate-pulse">
          <Compass className="w-8 h-8 animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Generating Personalized Career Roadmap</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Analyzing your verified skills, project proof, and target role prerequisites...
          </p>
        </div>
      </div>
    );
  }

  const overallProgress = roadmap?.overallProgress ?? 0;
  const readiness = roadmap?.currentReadiness ?? 74;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <AnimatedSection variant="hero">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 text-white p-6 sm:p-10 border border-indigo-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-16 w-60 h-60 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Skill-Gap & 30-Day Learning Journey
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Personalized Career Roadmap
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Targeting{' '}
              <strong className="text-white underline decoration-indigo-400 underline-offset-4">
                {roadmap?.targetRole || 'Full Stack Developer'}
              </strong>
              {roadmap?.targetJobTitle && (
                <span> for {roadmap.targetJobTitle}</span>
              )}
              . Milestone-by-milestone practical blueprint with official documentation and containerized capstone projects.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCopilotOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                Ask Career Copilot
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Recalculate Roadmap
              </button>
              <button
                onClick={() => navigate('/candidate/skill-gap')}
                className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-all"
              >
                View Full Skill Gap Matrix →
              </button>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex flex-row sm:flex-col lg:flex-row gap-4 shrink-0">
            <div className="flex-1 min-w-[150px] bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                {readiness}%
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Weighted Profile Signal</span>
            </div>

            <div className="flex-1 min-w-[150px] bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Roadmap Progress</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mt-1">
                {overallProgress}%
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Main Skill Gaps Priority Matrix */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold">Prioritized Skill Gaps</h2>
            </div>
            <p className="text-sm text-[var(--ink-muted)] mt-1">
              Gaps ranked by job requirement frequency, target role dependencies, and current proficiency. Click to toggle progress!
            </p>
          </div>
          <span className="text-xs text-[var(--ink-muted)] bg-[var(--surface-2)] px-3 py-1.5 rounded-full font-medium border border-[var(--line)] self-start sm:self-auto">
            Click status pill to cycle: ⚪ Not Started → 🟡 In Progress → 🟢 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap?.mainSkillGaps?.map((gap, idx) => {
            const progressItem = roadmap.skillProgressList?.find(
              (p) => p.skillName.toLowerCase() === gap.skillName.toLowerCase()
            );
            const status = progressItem?.status || 'NOT_STARTED';
            const percent = progressItem?.progressPercent ?? (status === 'COMPLETED' ? 100 : (status === 'IN_PROGRESS' ? 50 : 0));

            return (
              <div
                key={idx}
                className="bg-[var(--surface-2)] border border-[var(--line)] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-base text-[var(--ink)]">{gap.skillName}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        gap.priority === 'HIGH'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                          : gap.priority === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {gap.priority === 'HIGH' ? '🔴 High Priority' : gap.priority === 'MEDIUM' ? '🟡 Medium' : '🟢 Foundational'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    {gap.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--line)]/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--ink-muted)]">Milestone Progress:</span>
                    <button
                      onClick={() => handleStatusChange(gap.skillName, status)}
                      disabled={updatingSkill === gap.skillName}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        status === 'COMPLETED'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : status === 'IN_PROGRESS'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-[var(--surface)] text-[var(--ink-muted)] border border-[var(--line)] hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                    >
                      {status === 'COMPLETED' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed (100%)
                        </>
                      ) : status === 'IN_PROGRESS' ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress ({percent}%)
                        </>
                      ) : (
                        '⚪ Not Started (0%)'
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                    <span>Target Impact: <strong>+8-12% Match</strong></span>
                    <button
                      onClick={() => {
                        setCopilotOpen(true);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Copilot Plan →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-Week / 30-Day Timeline Breakdown */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold">4-Week / 30-Day Milestone Journey</h2>
            </div>
            <p className="text-sm text-[var(--ink-muted)] mt-1">
              Structured day-by-day practical syllabus to take you from foundational understanding to production capstone deployment.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
            Practical Project Focus
          </span>
        </div>

        <div className="space-y-4">
          {roadmap?.weeks?.map((week: RoadmapWeek) => {
            const isExpanded = expandedWeek === week.weekNumber;
            return (
              <div
                key={week.weekNumber}
                className="border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--surface-2)] transition-all"
              >
                {/* Week Header Accordion Toggle */}
                <button
                  onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[var(--surface)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      W{week.weekNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-base text-[var(--ink)]">
                          Week {week.weekNumber}: {week.skillFocus}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            week.priority === 'HIGH'
                              ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                              : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                          }`}
                        >
                          {week.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">{week.weeklyGoal}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[var(--ink-muted)] hidden sm:block">
                      {week.days.length} Daily Milestones
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[var(--ink-muted)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--ink-muted)]" />
                    )}
                  </div>
                </button>

                {/* Week Body */}
                {isExpanded && (
                  <div className="p-6 border-t border-[var(--line)] bg-[var(--surface)] space-y-6">
                    {/* Days Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                        Daily Practical Syllabus
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {week.days.map((day) => (
                          <div
                            key={day.dayNumber}
                            className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex gap-3 text-xs leading-relaxed"
                          >
                            <div className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                              D{day.dayNumber}
                            </div>
                            <div className="space-y-1">
                              <div className="font-semibold text-[var(--ink)]">{day.title}</div>
                              <p className="text-[var(--ink-muted)]">{day.task}</p>
                              <div className="pt-1 text-[11px] text-indigo-600 dark:text-indigo-300 font-medium">
                                💡 <em>Practice: {day.practicePrompt}</em>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Curated Official Resources & Project */}
                    {week.learningResources && (
                      <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                              Curated Official Learning Resources for {week.learningResources.skillName}
                            </h4>
                          </div>
                          {week.learningResources.officialDocUrl && (
                            <a
                              href={week.learningResources.officialDocUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                            >
                              {week.learningResources.officialDocTitle} <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Free Guides */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--ink)]">
                          {week.learningResources.freeResources?.map((res, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{res}</span>
                            </div>
                          ))}
                        </div>

                        {/* Practical Project Card */}
                        {week.learningResources.practicalProjectIdea && (
                          <div className="pt-3 border-t border-indigo-200/60 dark:border-indigo-900/60 flex items-start gap-2.5 text-xs">
                            <FolderGit2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-indigo-950 dark:text-indigo-200">Suggested Milestone Capstone:</strong>{' '}
                              <span className="text-[var(--ink-muted)]">
                                {week.learningResources.practicalProjectIdea}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Project Recommendations Showcase */}
      {roadmap?.projectRecommendations && roadmap.projectRecommendations.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold">Practical Proof-of-Work Projects</h2>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Concrete project deliverables you can build and showcase on your profile to verify your newly acquired skills.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmap.projectRecommendations.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="bg-[var(--surface-2)] border border-[var(--line)] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                      {proj.skillName} Proof
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--ink)]">{proj.title}</h3>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">{proj.description}</p>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
                      Architecture:
                    </span>
                    <p className="text-xs font-mono bg-[var(--surface)] p-2 rounded-lg border border-[var(--line)] text-[var(--ink)]">
                      {proj.practicalArchitecture}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)]/60">
                  <span className="text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider block mb-1.5">
                    Deliverables:
                  </span>
                  <ul className="space-y-1 text-xs text-[var(--ink)]">
                    {proj.deliverables.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Copilot Drawer */}
      <CareerCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        contextJobId={roadmap?.targetJobId}
        contextJobTitle={roadmap?.targetJobTitle || roadmap?.targetRole}
      />
    </div>
  );
};
