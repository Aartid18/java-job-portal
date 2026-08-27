import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PressButton from '../components/PressButton';
import { ErrorBoundary } from '../components/ui';
import MaskedHeading from '../components/reactbits/MaskedHeading';
import { useAuth, getErrorMessage } from '../context/AuthContext';
import { onboardingApi } from '../lib/onboardingApi';
import { tokenStorage } from '../lib/tokenStorage';
import { authApi } from '../lib/authApi';
import {
  CANDIDATE_STEPS,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_SUGGESTIONS,
  type OnboardingState,
} from '../types/onboarding';

const emptyEdu = () => ({
  degree: '',
  college: '',
  fieldOfStudy: '',
  startYear: undefined as number | undefined,
  graduationYear: undefined as number | undefined,
  cgpa: '',
});

const emptyExp = () => ({
  type: 'Full-time',
  company: '',
  roleTitle: '',
  startDate: '',
  endDate: '',
  description: '',
});

const emptyProject = () => ({
  name: '',
  description: '',
  technologies: '',
  githubUrl: '',
  liveUrl: '',
});

export default function OnboardingPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const isRecruiter = user?.role === 'RECRUITER';

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState<OnboardingState | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [educations, setEducations] = useState([emptyEdu()]);
  const [skills, setSkills] = useState<{ name: string; level: string }[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [skillCategory, setSkillCategory] = useState(SKILL_CATEGORIES[0]?.id ?? 'software');
  const [experiences, setExperiences] = useState([emptyExp()]);
  const [projects, setProjects] = useState([emptyProject()]);
  const [preferredJobRole, setPreferredJobRole] = useState('');
  const [preferredLocations, setPreferredLocations] = useState('');
  const [remotePreference, setRemotePreference] = useState('Any');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry');
  const [jobTypes, setJobTypes] = useState<string[]>(['Full-time']);
  const [resumeName, setResumeName] = useState<string | null>(null);

  const percent = state?.completion.percent ?? 0;
  const missing = state?.completion.missing ?? [];
  const canFinish = state?.completion.canFinish ?? false;

  const activeCategorySkills = useMemo(() => {
    const cat = SKILL_CATEGORIES.find((c) => c.id === skillCategory);
    return cat?.skills ?? [];
  }, [skillCategory]);

  const filteredSuggestions = useMemo(
    () =>
      SKILL_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(skillInput.toLowerCase()) &&
          !skills.some((x) => x.name.toLowerCase() === s.toLowerCase())
      ).slice(0, 8),
    [skillInput, skills]
  );

  useEffect(() => {
    void loadState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyState = (data: OnboardingState) => {
    setState(data);
    setFullName(data.basic?.fullName ?? '');
    setPhone(data.basic?.phone ?? '');
    setLocation(data.basic?.location ?? '');
    setBio(data.basic?.bio ?? '');
    setEducations(
      data.educations?.length
        ? data.educations.map((e) => ({
            degree: e.degree ?? '',
            college: e.college ?? '',
            fieldOfStudy: e.fieldOfStudy ?? '',
            startYear: e.startYear ?? undefined,
            graduationYear: e.graduationYear ?? undefined,
            cgpa: e.cgpa ?? '',
          }))
        : [emptyEdu()]
    );
    setSkills(data.skills?.length ? data.skills.map((s) => ({ name: s.name, level: s.level })) : []);
    setExperiences(
      data.experiences?.length
        ? data.experiences.map((e) => ({
            type: e.type ?? 'Full-time',
            company: e.company ?? '',
            roleTitle: e.roleTitle ?? '',
            startDate: e.startDate ?? '',
            endDate: e.endDate ?? '',
            description: e.description ?? '',
          }))
        : [emptyExp()]
    );
    setProjects(
      data.projects?.length
        ? data.projects.map((p) => ({
            name: p.name ?? '',
            description: p.description ?? '',
            technologies: p.technologies ?? '',
            githubUrl: p.githubUrl ?? '',
            liveUrl: p.liveUrl ?? '',
          }))
        : [emptyProject()]
    );
    setPreferredJobRole(data.preferences?.preferredJobRole ?? '');
    setPreferredLocations(data.preferences?.preferredLocations ?? '');
    setRemotePreference(data.preferences?.remotePreference ?? 'Any');
    setExpectedSalary(data.preferences?.expectedSalary ?? '');
    setExperienceLevel(data.preferences?.experienceLevel ?? 'Entry');
    setJobTypes(
      data.preferences?.jobTypes
        ? data.preferences.jobTypes.split(',').map((x) => x.trim()).filter(Boolean)
        : ['Full-time']
    );
    setResumeName(data.resume?.fileName ?? null);
    if (data.completion?.onboardingStep) {
      setStep(Math.min(data.completion.onboardingStep, isRecruiter ? 1 : 7));
    }
  };

  const loadState = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await onboardingApi.getState();
      applyState(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load onboarding'));
    } finally {
      setLoading(false);
    }
  };

  const withSave = async (fn: () => Promise<{ data: OnboardingState }>, next?: number) => {
    setSaving(true);
    setError('');
    try {
      const { data } = await fn();
      applyState(data);
      if (typeof next === 'number') setStep(next);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (name: string, level = skillLevel) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter a skill name first (or tap a skill chip below).');
      return;
    }
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError(`“${trimmed}” is already added.`);
      return;
    }
    setError('');
    setSkills((prev) => [...prev, { name: trimmed, level }]);
    setSkillInput('');
  };

  const toggleSuggestedSkill = (name: string) => {
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setSkills((list) => list.filter((x) => x.name.toLowerCase() !== name.toLowerCase()));
      return;
    }
    addSkill(name);
  };

  const updateSkillLevel = (name: string, level: string) => {
    setSkills((list) => list.map((s) => (s.name === name ? { ...s, level } : s)));
  };

  const saveSkillsStep = async () => {
    if (skills.length < 3) {
      setError('Add at least 3 skills before continuing.');
      return;
    }
    await withSave(() => onboardingApi.saveSkills(skills), 3);
  };

  const toggleJobType = (type: string) => {
    setJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const finish = async () => {
    setSaving(true);
    setError('');
    try {
      await onboardingApi.finish();
      const { data: me } = await authApi.me();
      tokenStorage.updateUser(me);
      await refreshUser();
      navigate(me.role === 'RECRUITER' ? '/recruiter' : '/candidate', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-ink-muted">
        Loading your profile setup…
      </div>
    );
  }

  if (isRecruiter) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <p className="text-label">Recruiter setup</p>
          <h1 className="text-h1 text-ink">Let&apos;s build your hiring profile</h1>
          <CompletionBar percent={percent} />
        </header>
        <div className="ui-panel p-6 space-y-4">
          <Field label="Full name" value={fullName} onChange={setFullName} required />
          <Field label="Phone" value={phone} onChange={setPhone} />
          {error && <ErrorText text={error} />}
          <div className="flex gap-3">
            <PressButton
              variant="primary"
              className="flex-1"
              disabled={saving}
              onClick={() => {
                void (async () => {
                  setSaving(true);
                  setError('');
                  try {
                    await onboardingApi.saveBasic({ fullName, phone });
                    await finish();
                  } catch (err) {
                    setError(getErrorMessage(err));
                    setSaving(false);
                  }
                })();
              }}
            >
              {saving ? 'Saving…' : 'Save & continue'}
            </PressButton>
            <PressButton variant="ghost" onClick={() => void logout()}>
              Sign out
            </PressButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      {/* Profile Header Motion — Phase 5 Spec */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <p className="text-label">Career profile setup</p>
        <ErrorBoundary fallback={<h1 className="text-3xl font-extrabold font-display text-ink">Let&apos;s build your career profile</h1>}>
          <MaskedHeading
            text="Let's build your career profile"
            tag="h1"
            reveal="rise"
            trigger="view"
            duration={0.9}
            stagger={0.08}
            align="left"
            textScale={0.075}
          />
        </ErrorBoundary>
        <CompletionBar percent={percent} />
        <StepRail
          steps={[...CANDIDATE_STEPS]}
          current={step}
          onJump={(i) => {
            setError('');
            setStep(i);
          }}
        />
      </motion.header>

      <div className="ui-panel p-6 sm:p-8 space-y-5">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section
              key="step-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
            <h2 className="text-h2 text-ink">Basic information</h2>
            <p className="text-sm text-ink-muted">This section contributes ~20% to profile strength.</p>
            <Field label="Full name" value={fullName} onChange={setFullName} required />
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field label="Location" value={location} onChange={setLocation} placeholder="Pune, India" />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Bio</span>
              <textarea
                className="ui-input !pl-4 !h-auto py-3 min-h-[100px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short professional summary"
              />
            </label>
            <NavRow
              saving={saving}
              onBack={null}
              onNext={() =>
                void withSave(
                  () => onboardingApi.saveBasic({ fullName, phone, location, bio }),
                  1
                )
              }
            />
            </motion.section>
          )}

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-h2 text-ink">Education</h2>
            {educations.map((edu, idx) => (
              <div key={idx} className="rounded-[12px] border border-line p-4 space-y-3 bg-surface-2/40">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-ink">Education {idx + 1}</p>
                  {educations.length > 1 && (
                    <button
                      type="button"
                      className="text-sm text-danger"
                      onClick={() => setEducations((list) => list.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Field
                  label="Degree"
                  value={edu.degree ?? ''}
                  onChange={(v) =>
                    setEducations((list) => list.map((item, i) => (i === idx ? { ...item, degree: v } : item)))
                  }
                />
                <Field
                  label="College"
                  value={edu.college ?? ''}
                  onChange={(v) =>
                    setEducations((list) => list.map((item, i) => (i === idx ? { ...item, college: v } : item)))
                  }
                />
                <Field
                  label="Field of study"
                  value={edu.fieldOfStudy ?? ''}
                  onChange={(v) =>
                    setEducations((list) =>
                      list.map((item, i) => (i === idx ? { ...item, fieldOfStudy: v } : item))
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Start year"
                    value={edu.startYear?.toString() ?? ''}
                    onChange={(v) =>
                      setEducations((list) =>
                        list.map((item, i) =>
                          i === idx ? { ...item, startYear: v ? Number(v) : undefined } : item
                        )
                      )
                    }
                  />
                  <Field
                    label="Graduation year"
                    value={edu.graduationYear?.toString() ?? ''}
                    onChange={(v) =>
                      setEducations((list) =>
                        list.map((item, i) =>
                          i === idx ? { ...item, graduationYear: v ? Number(v) : undefined } : item
                        )
                      )
                    }
                  />
                </div>
                <Field
                  label="CGPA"
                  value={edu.cgpa ?? ''}
                  onChange={(v) =>
                    setEducations((list) => list.map((item, i) => (i === idx ? { ...item, cgpa: v } : item)))
                  }
                />
              </div>
            ))}
            <PressButton variant="ghost" onClick={() => setEducations((list) => [...list, emptyEdu()])}>
              Add education
            </PressButton>
            <NavRow
              saving={saving}
              onBack={() => setStep(0)}
              onNext={() => void withSave(() => onboardingApi.saveEducation(educations), 2)}
            />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h2 text-ink">Skills</h2>
              <p className="text-sm text-ink-muted mt-1">
                Pick from popular skills or type your own. Add at least 3 with a proficiency level.
              </p>
            </div>

            <div className="rounded-[12px] border border-line bg-surface-2/40 p-4 space-y-3">
              <p className="text-sm font-semibold text-ink">Browse by field — tap to add</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {SKILL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSkillCategory(cat.id)}
                    className={`shrink-0 rounded-[10px] px-3 py-1.5 text-xs font-semibold border transition ${
                      skillCategory === cat.id
                        ? 'bg-brand text-white border-brand'
                        : 'bg-surface text-ink-muted border-line hover:border-brand hover:text-brand'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCategorySkills.map((s) => {
                  const selected = skills.some((x) => x.name.toLowerCase() === s.toLowerCase());
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSuggestedSkill(s)}
                      className={`rounded-[10px] px-3 py-1.5 text-sm font-medium border transition ${
                        selected
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface text-ink border-line hover:border-brand hover:text-brand'
                      }`}
                    >
                      {selected ? `✓ ${s}` : `+ ${s}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-3 items-end">
              <label className="block space-y-1.5 min-w-0">
                <span className="text-sm font-medium text-ink">Skill name</span>
                <input
                  className="ui-input"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Spring Security, Figma, Excel"
                  list="skill-suggestions"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                />
                <datalist id="skill-suggestions">
                  {SKILL_SUGGESTIONS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-ink">Level</span>
                <select
                  className="ui-input"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                >
                  {SKILL_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <PressButton
                variant="soft"
                className="!min-h-11 sm:!w-auto"
                onClick={() => addSkill(skillInput)}
              >
                Add skill
              </PressButton>
            </div>

            {filteredSuggestions.length > 0 && skillInput.trim() && (
              <div className="space-y-2">
                <p className="text-xs text-ink-muted">Matching suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="ui-chip ui-chip--info"
                      onClick={() => addSkill(s)}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  Your skills ({skills.length}/3 minimum)
                </p>
                {skills.length < 3 && (
                  <span className="text-xs text-warning font-medium">
                    Add {3 - skills.length} more
                  </span>
                )}
              </div>
              {skills.length === 0 ? (
                <p className="text-sm text-ink-muted rounded-[12px] border border-dashed border-line p-4">
                  No skills yet — tap chips above or type a skill name and click Add skill.
                </p>
              ) : (
                <ul className="space-y-2">
                  {skills.map((s) => (
                    <li
                      key={s.name}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-[12px] border border-line bg-surface px-3 py-2"
                    >
                      <span className="font-medium text-ink flex-1 min-w-0 truncate">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`level-${s.name}`}>
                          Level for {s.name}
                        </label>
                        <select
                          id={`level-${s.name}`}
                          className="ui-input !h-9 !min-h-0 text-sm w-full sm:w-40"
                          value={s.level}
                          onChange={(e) => updateSkillLevel(s.name, e.target.value)}
                        >
                          {SKILL_LEVELS.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="text-sm text-danger font-medium px-2 py-1"
                          onClick={() => setSkills((list) => list.filter((x) => x.name !== s.name))}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <NavRow
              saving={saving}
              onBack={() => setStep(1)}
              onNext={() => void saveSkillsStep()}
            />
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-h2 text-ink">Experience</h2>
            {experiences.map((exp, idx) => (
              <div key={idx} className="rounded-[12px] border border-line p-4 space-y-3 bg-surface-2/40">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">Experience {idx + 1}</p>
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      className="text-sm text-danger"
                      onClick={() => setExperiences((list) => list.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Type</span>
                  <select
                    className="ui-input !pl-4"
                    value={exp.type}
                    onChange={(e) =>
                      setExperiences((list) =>
                        list.map((item, i) => (i === idx ? { ...item, type: e.target.value } : item))
                      )
                    }
                  >
                    {['Internship', 'Full-time', 'Freelance', 'Project'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Company"
                  value={exp.company ?? ''}
                  onChange={(v) =>
                    setExperiences((list) => list.map((item, i) => (i === idx ? { ...item, company: v } : item)))
                  }
                />
                <Field
                  label="Role"
                  value={exp.roleTitle ?? ''}
                  onChange={(v) =>
                    setExperiences((list) =>
                      list.map((item, i) => (i === idx ? { ...item, roleTitle: v } : item))
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Start"
                    value={exp.startDate ?? ''}
                    onChange={(v) =>
                      setExperiences((list) =>
                        list.map((item, i) => (i === idx ? { ...item, startDate: v } : item))
                      )
                    }
                    placeholder="2023-01"
                  />
                  <Field
                    label="End"
                    value={exp.endDate ?? ''}
                    onChange={(v) =>
                      setExperiences((list) =>
                        list.map((item, i) => (i === idx ? { ...item, endDate: v } : item))
                      )
                    }
                    placeholder="Present"
                  />
                </div>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Description</span>
                  <textarea
                    className="ui-input !pl-4 !h-auto py-3 min-h-[80px]"
                    value={exp.description ?? ''}
                    onChange={(e) =>
                      setExperiences((list) =>
                        list.map((item, i) => (i === idx ? { ...item, description: e.target.value } : item))
                      )
                    }
                  />
                </label>
              </div>
            ))}
            <PressButton variant="ghost" onClick={() => setExperiences((list) => [...list, emptyExp()])}>
              Add experience
            </PressButton>
            <NavRow
              saving={saving}
              onBack={() => setStep(2)}
              onNext={() => void withSave(() => onboardingApi.saveExperience(experiences), 4)}
            />
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <h2 className="text-h2 text-ink">Projects</h2>
            {projects.map((project, idx) => (
              <div key={idx} className="rounded-[12px] border border-line p-4 space-y-3 bg-surface-2/40">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">Project {idx + 1}</p>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      className="text-sm text-danger"
                      onClick={() => setProjects((list) => list.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Field
                  label="Project name"
                  value={project.name ?? ''}
                  onChange={(v) =>
                    setProjects((list) => list.map((item, i) => (i === idx ? { ...item, name: v } : item)))
                  }
                />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Description</span>
                  <textarea
                    className="ui-input !pl-4 !h-auto py-3 min-h-[80px]"
                    value={project.description ?? ''}
                    onChange={(e) =>
                      setProjects((list) =>
                        list.map((item, i) => (i === idx ? { ...item, description: e.target.value } : item))
                      )
                    }
                  />
                </label>
                <Field
                  label="Technologies"
                  value={project.technologies ?? ''}
                  onChange={(v) =>
                    setProjects((list) =>
                      list.map((item, i) => (i === idx ? { ...item, technologies: v } : item))
                    )
                  }
                  placeholder="Java, Spring Boot, React"
                />
                <Field
                  label="GitHub URL"
                  value={project.githubUrl ?? ''}
                  onChange={(v) =>
                    setProjects((list) =>
                      list.map((item, i) => (i === idx ? { ...item, githubUrl: v } : item))
                    )
                  }
                />
                <Field
                  label="Live URL"
                  value={project.liveUrl ?? ''}
                  onChange={(v) =>
                    setProjects((list) => list.map((item, i) => (i === idx ? { ...item, liveUrl: v } : item)))
                  }
                />
              </div>
            ))}
            <PressButton variant="ghost" onClick={() => setProjects((list) => [...list, emptyProject()])}>
              Add project
            </PressButton>
            <NavRow
              saving={saving}
              onBack={() => setStep(3)}
              onNext={() => void withSave(() => onboardingApi.saveProjects(projects), 5)}
            />
          </section>
        )}

        {step === 5 && (
          <section className="space-y-4">
            <h2 className="text-h2 text-ink">Preferences</h2>
            <Field
              label="Desired role"
              value={preferredJobRole}
              onChange={setPreferredJobRole}
              placeholder="Java Backend Developer"
            />
            <Field
              label="Preferred locations"
              value={preferredLocations}
              onChange={setPreferredLocations}
              placeholder="Pune, Bangalore, Remote"
            />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Work mode</span>
              <select
                className="ui-input !pl-4"
                value={remotePreference}
                onChange={(e) => setRemotePreference(e.target.value)}
              >
                {['Remote', 'Hybrid', 'On-site', 'Any'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <Field label="Expected salary" value={expectedSalary} onChange={setExpectedSalary} placeholder="12 LPA" />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Experience level</span>
              <select
                className="ui-input !pl-4"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                {['Entry', 'Mid', 'Senior', 'Lead'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <div className="space-y-2">
              <p className="text-sm font-medium">Job types</p>
              <div className="flex flex-wrap gap-2">
                {['Full-time', 'Internship', 'Part-time', 'Contract'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`ui-chip ${jobTypes.includes(t) ? 'ui-chip--info' : 'bg-surface-2 text-ink-muted'}`}
                    onClick={() => toggleJobType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <NavRow
              saving={saving}
              onBack={() => setStep(4)}
              onNext={() =>
                void withSave(
                  () =>
                    onboardingApi.savePreferences({
                      preferredJobRole,
                      preferredLocations,
                      remotePreference,
                      expectedSalary,
                      experienceLevel,
                      jobTypes: jobTypes.join(', '),
                    }),
                  6
                )
              }
            />
          </section>
        )}

        {step === 6 && (
          <section className="space-y-4">
            <h2 className="text-h2 text-ink">Resume</h2>
            <p className="text-sm text-ink-muted">
              Upload a PDF now, or skip and use the Resume Builder later (Phase 6).
            </p>
            {resumeName && (
              <p className="text-sm text-success">Uploaded: {resumeName}</p>
            )}
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void withSave(() => onboardingApi.uploadResume(file), 7);
              }}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <PressButton variant="ghost" onClick={() => setStep(5)} disabled={saving}>
                Back
              </PressButton>
              <PressButton
                variant="soft"
                className="flex-1"
                disabled={saving}
                onClick={() => void withSave(() => onboardingApi.skipResume(), 7)}
              >
                Skip for now
              </PressButton>
              {resumeName && (
                <PressButton variant="primary" onClick={() => setStep(7)} disabled={saving}>
                  Continue
                </PressButton>
              )}
            </div>
          </section>
        )}

        {step === 7 && (
          <section className="space-y-5">
            <h2 className="text-h2 text-ink">Your Career Profile is {percent}% complete</h2>
            <CompletionBar percent={percent} />
            {missing.length > 0 ? (
              <ul className="space-y-2">
                {missing.map((item) => (
                  <li key={item} className="text-sm text-ink-muted flex gap-2">
                    <span className="text-warning">○</span> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-success">Required sections look solid. You can finish setup.</p>
            )}
            {error && <ErrorText text={error} />}
            <div className="flex flex-col sm:flex-row gap-3">
              <PressButton variant="ghost" onClick={() => setStep(0)}>
                Review profile
              </PressButton>
              <PressButton variant="primary" className="flex-1" disabled={saving || !canFinish} onClick={() => void finish()}>
                {saving ? 'Finishing…' : 'Complete Profile'}
              </PressButton>
            </div>
            {!canFinish && (
              <p className="text-xs text-ink-faint">
                Finish requires: basic info, education, 3+ skills, preferences, and experience or a project.
              </p>
            )}
          </section>
        )}
        </AnimatePresence>

        {error && step !== 7 && <ErrorText text={error} />}
      </div>

      <div className="flex justify-end">
        <PressButton variant="ghost" onClick={() => void logout()}>
          Sign out
        </PressButton>
      </div>
    </div>
  );
}

function CompletionBar({ percent }: { percent: number }) {
  const [animatedVal, setAnimatedVal] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 600);
      setAnimatedVal(Math.round(percent * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-ink-muted">Profile strength</span>
        <span className="font-display font-bold text-brand">{animatedVal}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden p-0.5 border border-line/40">
        <motion.div
          className="h-full bg-gradient-to-r from-brand to-violet-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        />
      </div>
    </div>
  );
}

function StepRail({
  steps,
  current,
  onJump,
}: {
  steps: string[];
  current: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {steps.map((label, i) => (
        <motion.button
          key={label}
          type="button"
          onClick={() => onJump(i)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className={`shrink-0 rounded-[12px] px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
            i === current
              ? 'bg-brand text-white border-brand shadow-xs'
              : i < current
                ? 'bg-brand-muted text-brand border-transparent'
                : 'bg-surface text-ink-faint border-line'
          }`}
        >
          {i + 1}. {label}
        </motion.button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        className="ui-input !pl-4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
}

function NavRow({
  saving,
  onBack,
  onNext,
}: {
  saving: boolean;
  onBack: (() => void) | null;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      {onBack && (
        <PressButton variant="ghost" onClick={onBack} disabled={saving}>
          Back
        </PressButton>
      )}
      <PressButton variant="primary" className="flex-1" onClick={onNext} disabled={saving}>
        {saving ? 'Saving…' : 'Save & continue'}
      </PressButton>
    </div>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-[12px] px-3 py-2" role="alert">
      {text}
    </p>
  );
}
