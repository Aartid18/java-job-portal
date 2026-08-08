import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Trash2,
  Maximize2,
  Minimize2,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Compass,
  FileText,
  Lightbulb,
  Code2,
  ChevronDown,
  User,
} from 'lucide-react';
import { copilotApi, type ChatMessage } from '../lib/copilotApi';
import { jobsApi, type Job } from '../lib/jobsApi';
import { getErrorMessage } from '../lib/api';

interface CareerCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextJobId?: number | null;
  contextJobTitle?: string | null;
}

interface PromptCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompts: string[];
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: 'readiness',
    label: 'Job Readiness',
    icon: <Compass className="w-3.5 h-3.5" />,
    prompts: [
      'How job-ready am I for my target roles?',
      'What are my biggest skill weaknesses?',
      'Why is my career readiness score at its current level?',
      'What 3 high-impact skills should I learn first?',
    ],
  },
  {
    id: 'matching',
    label: 'Job Matching',
    icon: <Briefcase className="w-3.5 h-3.5" />,
    prompts: [
      'Why am I a partial match for this job?',
      'What missing skills are lowering my compatibility score?',
      'How can I bridge the gap for backend engineer roles?',
      'Analyze job description requirements vs my profile',
    ],
  },
  {
    id: 'roadmap',
    label: '14/30-Day Plan',
    icon: <Layers className="w-3.5 h-3.5" />,
    prompts: [
      'Create a 14-day study plan for Docker & Kubernetes',
      'Generate a 30-day learning roadmap for Spring Boot Microservices',
      'What practical capstone project should I build to prove AWS skills?',
      'Give me daily milestones for SQL query optimization',
    ],
  },
  {
    id: 'resume',
    label: 'Resume Tuning',
    icon: <FileText className="w-3.5 h-3.5" />,
    prompts: [
      'Rewrite bullet: Responsible for developing backend APIs',
      'Rewrite bullet: Fixed bugs and improved system performance',
      'How can I improve my resume ATS score without keyword stuffing?',
      'Make my project accomplishment bullets use strong action verbs',
    ],
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    prompts: [
      'What technical interview questions can I expect for this role?',
      'Ask me 3 mock interview questions on Java concurrency',
      'How do I answer "Tell me about a time you optimized a slow query"?',
      'System design mock: Design a scalable job notification queue',
    ],
  },
];

export const CareerCopilotDrawer: React.FC<CareerCopilotDrawerProps> = ({
  isOpen,
  onClose,
  contextJobId,
  contextJobTitle,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeJobId, setActiveJobId] = useState<number | null>(contextJobId || null);
  const [activeJobName, setActiveJobName] = useState<string | null>(contextJobTitle || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('readiness');
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [showJobSelector, setShowJobSelector] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (contextJobId) {
      setActiveJobId(contextJobId);
      setActiveJobName(contextJobTitle || `Job #${contextJobId}`);
    }
  }, [contextJobId, contextJobTitle]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      loadAvailableJobs();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadAvailableJobs = async () => {
    try {
      const res = await jobsApi.listOpen(0, 10);
      if (res.data?.content) {
        setAvailableJobs(res.data.content);
      }
    } catch {
      // Non-blocking fallback
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      setErrorMsg(null);
      const { data } = await copilotApi.getHistory();
      if (data && data.length > 0) {
        setMessages(data);
      } else {
        setMessages([
          {
            sender: 'ASSISTANT',
            message: `## 👋 Welcome to your AI Career Copilot!\n\nI am connected directly to your **live profile, skills, verified projects, and application pipeline**.\n\n### What I can help you with:\n- **🎯 Job Match Deep-Dive:** Explain match percentages & exact skill gaps\n- **⚡ 14 / 30-Day Roadmaps:** Milestone-by-milestone practical learning plans\n- **📝 Resume Bullet Rewriter:** Transform weak bullets into punchy, metric-driven achievements\n- **💼 Technical Mock Interviews:** Realistic questions and feedback grounded in your tech stack\n\n*Choose a suggested prompt below or type your career question to begin!*`,
            suggestedQuestions: PROMPT_CATEGORIES[0].prompts,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages([
        {
          sender: 'ASSISTANT',
          message: `## 👋 Welcome to your AI Career Copilot!\n\nI am connected to your candidate profile.\n\nAsk me about your **Career Readiness**, **Job Match Analysis**, **Skill Gaps**, or **Interview Preparation**!`,
          suggestedQuestions: PROMPT_CATEGORIES[0].prompts,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setInputMessage('');
    setErrorMsg(null);

    const userMsg: ChatMessage = {
      sender: 'USER',
      message: text,
      jobId: activeJobId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await copilotApi.chat(text, activeJobId);
      const botMsg: ChatMessage = {
        sender: 'ASSISTANT',
        message: data.message,
        jobId: data.jobId,
        actionLink: data.actionLink,
        actionLabel: data.actionLabel,
        createdAt: data.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errText = getErrorMessage(err, 'Failed to connect to Career Copilot. Please try again.');
      setErrorMsg(errText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ASSISTANT',
          message: `⚠️ **Connection Error:** ${errText}\n\nPlease check your network connection and try again.`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your conversation history with Career Copilot?')) return;
    try {
      await copilotApi.clearHistory();
      setMessages([
        {
          sender: 'ASSISTANT',
          message: `### Conversation Cleared\n\nHow can I help you advance your career today? Pick a topic or ask a question below.`,
          suggestedQuestions: PROMPT_CATEGORIES[0].prompts,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to clear history'));
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const currentCategoryObj = PROMPT_CATEGORIES.find((c) => c.id === selectedCategory) || PROMPT_CATEGORIES[0];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs transition-opacity flex justify-end animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex flex-col h-screen max-h-screen bg-[var(--surface)] text-[var(--ink)] shadow-2xl transition-all duration-300 border-l border-[var(--line)] overflow-hidden ${
          isFullScreen
            ? 'w-full max-w-full'
            : 'w-full md:w-[680px] lg:w-[740px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= Fixed Header ================= */}
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0 ring-2 ring-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base tracking-tight text-[var(--ink)]">
                  Career Copilot
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Context
                </span>
              </div>
              <p className="text-[11px] text-[var(--ink-muted)] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                Grounded in your real profile, skills & application data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[var(--ink-muted)]">
            <button
              onClick={handleClear}
              title="Clear chat history"
              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Exit full screen' : 'Expand full screen'}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition-colors hidden sm:block cursor-pointer"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close Copilot"
              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= Active Context Bar & Job Selector ================= */}
        <div className="px-5 py-2 bg-[var(--surface-2)] border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink)] shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-medium text-[var(--ink-muted)]">Context:</span>
            <div className="relative">
              <button
                onClick={() => setShowJobSelector(!showJobSelector)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-[var(--surface-2)] transition-colors cursor-pointer shadow-2xs"
              >
                <span className="max-w-[200px] truncate">
                  {activeJobName || 'General Profile & Skills'}
                </span>
                <ChevronDown className="w-3 h-3 text-indigo-500 shrink-0" />
              </button>

              {/* Job Dropdown Menu */}
              {showJobSelector && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Switch Active Context
                  </div>
                  <button
                    onClick={() => {
                      setActiveJobId(null);
                      setActiveJobName(null);
                      setShowJobSelector(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      activeJobId === null
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'hover:bg-[var(--surface-2)] text-[var(--ink)]'
                    }`}
                  >
                    <span>General Profile & Readiness</span>
                    {activeJobId === null && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>

                  {availableJobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setActiveJobId(job.id);
                        setActiveJobName(job.title);
                        setShowJobSelector(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        activeJobId === job.id
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'hover:bg-[var(--surface-2)] text-[var(--ink)]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium truncate text-[var(--ink)]">{job.title}</div>
                        <div className="text-[10px] text-[var(--ink-muted)] truncate">
                          {job.companyName || 'Verified Employer'}
                        </div>
                      </div>
                      {activeJobId === job.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {activeJobId ? (
            <button
              onClick={() => handleSend(`Analyze my match score and missing skills for ${activeJobName || 'this job'}`)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Analyze Match <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => handleSend('How job-ready am I across my target roles?')}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Evaluate Readiness <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* ================= Chat Messages Stream ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[var(--canvas)]">
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--ink-muted)] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Bot className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-sm font-medium text-[var(--ink)]">
                Connecting to candidate intelligence engine...
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ASSISTANT' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs ring-2 ring-indigo-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed transition-all ${
                    msg.sender === 'USER'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs shadow-md shadow-indigo-600/15 font-medium'
                      : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-tl-xs shadow-xs hover:border-indigo-400/40'
                  }`}
                >
                  <MessageRenderer content={msg.message} isUser={msg.sender === 'USER'} />

                  {/* Assistant Footer: Copy button & Suggested Action Button */}
                  {msg.sender === 'ASSISTANT' && (
                    <div className="mt-3.5 pt-3 border-t border-[var(--line)]/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(msg.message, idx)}
                          className="px-2 py-1 text-[11px] font-medium rounded-md bg-[var(--surface-2)] hover:bg-indigo-500/10 text-[var(--ink-muted)] hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer border border-[var(--line)]"
                          title="Copy response to clipboard"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setInputMessage(msg.message.slice(0, 120));
                            inputRef.current?.focus();
                          }}
                          className="px-2 py-1 text-[11px] font-medium rounded-md bg-[var(--surface-2)] hover:bg-indigo-500/10 text-[var(--ink-muted)] hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer border border-[var(--line)]"
                          title="Follow up on this"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Follow up</span>
                        </button>
                      </div>

                      {msg.actionLink && msg.actionLabel && (
                        <button
                          onClick={() => {
                            onClose();
                            navigate(msg.actionLink!);
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer group/btn"
                        >
                          <span>{msg.actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'USER' && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--surface-2)] text-[var(--ink)] flex items-center justify-center shrink-0 mt-1 shadow-xs font-semibold text-xs border border-[var(--line)]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing / Thinking Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-[var(--ink-muted)] flex items-center gap-2 shadow-xs">
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span className="font-medium text-[var(--ink)]">
                  Synthesizing profile data, verified skills & job match signal...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ================= Prompt Helper & Category Carousel ================= */}
        <div className="px-5 py-2.5 border-t border-[var(--line)] bg-[var(--surface)] backdrop-blur-sm shrink-0">
          {/* Topic Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)] mr-1 shrink-0">
              <HelpCircle className="w-3 h-3 text-indigo-500" />
              <span>Topics:</span>
            </div>
            {PROMPT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[var(--surface-2)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-indigo-500/10 border border-[var(--line)]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Prompt Chips in Current Category */}
          <div className="flex gap-2 overflow-x-auto pt-0.5 pb-0.5 scrollbar-none no-scrollbar">
            {currentCategoryObj.prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-[var(--surface-2)] hover:bg-indigo-500/10 hover:text-indigo-600 border border-[var(--line)] text-[var(--ink)] hover:border-indigo-400 transition-all cursor-pointer whitespace-nowrap shadow-2xs disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* ================= Input Bar ================= */}
        <div className="p-3.5 border-t border-[var(--line)] bg-[var(--surface)] flex flex-col gap-2 shrink-0">
          {errorMsg && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-end gap-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500 transition-all shadow-inner">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask Copilot (e.g. 'Why am I a 74% match?', 'Create a 14-day roadmap for Docker', 'Mock interview questions')..."
              className="flex-1 bg-transparent resize-none border-none outline-hidden text-sm px-2 py-1 text-[var(--ink)] placeholder-[var(--ink-muted)] leading-relaxed font-normal"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-40 text-white transition-all cursor-pointer shadow-md shadow-indigo-600/20 shrink-0 flex items-center justify-center"
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] px-1">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[10px] text-[var(--ink)]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[10px] text-[var(--ink)]">Shift+Enter</kbd> for newline
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified Context Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= Enhanced Markdown & Text Renderer =================
const MessageRenderer: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="whitespace-pre-wrap font-medium">{content}</p>;
  }

  const lines = content.split('\n');
  return (
    <div className="space-y-2.5 text-sm text-[var(--ink)] leading-relaxed font-normal">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header 1 / 2
        if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
          const text = trimmed.replace(/^#+\s/, '');
          return (
            <h3
              key={idx}
              className="text-base sm:text-lg font-bold text-[var(--ink)] pt-2 pb-1 border-b border-[var(--line)] flex items-center gap-2"
            >
              <span>{text}</span>
            </h3>
          );
        }

        // Header 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400 pt-2 pb-0.5"
            >
              {trimmed.substring(4)}
            </h4>
          );
        }

        // Header 4
        if (trimmed.startsWith('#### ')) {
          return (
            <h5
              key={idx}
              className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] pt-1"
            >
              {trimmed.substring(5)}
            </h5>
          );
        }

        // Checklists & Status Items
        if (trimmed.startsWith('✓ ') || trimmed.startsWith('[x] ') || trimmed.startsWith('[X] ')) {
          const itemText = trimmed.replace(/^(✓|\[x\]|\[X\])\s*/, '');
          return (
            <div
              key={idx}
              className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-xs sm:text-sm pl-1 py-0.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
            </div>
          );
        }

        if (trimmed.startsWith('✗ ') || trimmed.startsWith('[ ] ')) {
          const itemText = trimmed.replace(/^(✗|\[ \])\s*/, '');
          return (
            <div
              key={idx}
              className="flex items-start gap-2 text-rose-600 dark:text-rose-400 font-medium text-xs sm:text-sm pl-1 py-0.5"
            >
              <span className="w-4 h-4 rounded-full border-2 border-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                ✕
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
            </div>
          );
        }

        if (trimmed.startsWith('⚠️ ') || trimmed.startsWith('⚠ ')) {
          const itemText = trimmed.replace(/^(⚠️|⚠)\s*/, '');
          return (
            <div
              key={idx}
              className="flex items-start gap-2 text-amber-600 dark:text-amber-400 font-medium text-xs sm:text-sm pl-1 py-0.5 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
            </div>
          );
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 text-xs sm:text-sm text-[var(--ink)]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
            </div>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s(.*)$/);
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 text-xs sm:text-sm text-[var(--ink)]">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 min-w-[20px]">
                  {match[1]}
                </span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(match[2]) }} />
              </div>
            );
          }
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-3 border-indigo-500 pl-3.5 py-1.5 text-xs sm:text-sm italic text-[var(--ink-muted)] bg-indigo-500/5 rounded-r-lg"
            >
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.substring(2)) }} />
            </blockquote>
          );
        }

        // Code block / snippet block
        if (trimmed.startsWith('```')) {
          const lang = trimmed.substring(3).trim();
          return (
            <div
              key={idx}
              className="my-2 rounded-xl bg-slate-900 text-slate-100 p-3 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Code2 className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px] font-bold">{lang || 'CODE'}</span>
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p
            key={idx}
            className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
          />
        );
      })}
    </div>
  );
};

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[var(--ink)]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-[var(--ink)]">$1</em>')
    .replace(/_([^_]+)_/g, '<em class="italic text-[var(--ink)]">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">$1</code>'
    );
}
