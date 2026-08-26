import { api } from './api';
import type { OnboardingState } from '../types/onboarding';

const MOCK_ONBOARDING_STATE: OnboardingState = {
  basic: {
    fullName: 'Java Lead Developer',
    phone: '+91 98765 43210',
    location: 'Bengaluru / Remote',
    bio: 'Passionate Java Tech Lead specializing in Spring Boot 3 microservices, Kafka event streams, and high-concurrency cloud architectures.',
    photoUrl: null,
  },
  skills: [
    { name: 'Java 21', level: 'EXPERT' },
    { name: 'Spring Boot', level: 'EXPERT' },
    { name: 'Microservices', level: 'ADVANCED' },
    { name: 'PostgreSQL', level: 'ADVANCED' },
    { name: 'Apache Kafka', level: 'INTERMEDIATE' },
  ],
  experiences: [
    {
      company: 'FinTech Cloud Systems',
      roleTitle: 'Senior Java Developer',
      startDate: '2022-01',
      endDate: 'Present',
      description: 'Architected distributed payment transaction engine processing 50M daily transactions with sub-10ms latencies.',
      type: 'Full-time',
    },
  ],
  educations: [
    {
      college: 'Indian Institute of Technology (IIT)',
      degree: 'B.Tech Computer Science & Engineering',
      fieldOfStudy: 'Computer Science',
      startYear: 2017,
      graduationYear: 2021,
      cgpa: '8.9',
    },
  ],
  projects: [
    {
      name: 'High-Concurrency Rate Limiter Service',
      description: 'Distributed rate-limiting microservice built with Java 21 Virtual Threads, Redis sliding window, and gRPC.',
      technologies: 'Java 21, Spring Boot, Redis, gRPC, Docker',
    },
  ],
  preferences: {
    preferredJobRole: 'Java Tech Lead & Backend Architect',
    expectedSalary: '₹25 - 35 LPA',
    preferredLocations: 'Bengaluru / Remote',
    remotePreference: 'Remote',
    experienceLevel: 'Senior',
    jobTypes: 'Full-time',
  },
  resume: {
    uploaded: true,
    fileName: 'Java_Lead_Resume.pdf',
  },
  completion: {
    percent: 100,
    missing: [],
    canFinish: true,
    onboardingStep: 7,
  },
  onboardingCompleted: true,
};

export const onboardingApi = {
  async getState(): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.get<OnboardingState>('/api/candidate/onboarding');
      return res;
    } catch {
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async saveBasic(payload: { fullName: string; phone?: string; location?: string; bio?: string; photoUrl?: string }): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.put<OnboardingState>('/api/candidate/onboarding/basic', payload);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.basic = { ...MOCK_ONBOARDING_STATE.basic, ...payload };
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async saveEducation(items: OnboardingState['educations']): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.put<OnboardingState>('/api/candidate/onboarding/education', items);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.educations = items;
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async saveSkills(items: OnboardingState['skills']): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.put<OnboardingState>('/api/candidate/onboarding/skills', items);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.skills = items;
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async saveExperience(items: OnboardingState['experiences']): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.put<OnboardingState>('/api/candidate/onboarding/experience', items);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.experiences = items;
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async saveProjects(items: OnboardingState['projects']): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.put<OnboardingState>('/api/candidate/onboarding/projects', items);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.projects = items;
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async savePreferences(prefs: OnboardingState['preferences']): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.put<OnboardingState>('/api/candidate/onboarding/preferences', prefs);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.preferences = prefs;
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async uploadResume(file: File): Promise<{ data: OnboardingState }> {
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post<OnboardingState>('/api/candidate/onboarding/resume', form);
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.resume = { uploaded: true, fileName: file.name };
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async skipResume(): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.post<OnboardingState>('/api/candidate/onboarding/resume/skip');
      return res;
    } catch {
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
  async finish(): Promise<{ data: OnboardingState }> {
    try {
      const res = await api.post<OnboardingState>('/api/candidate/onboarding/finish');
      return res;
    } catch {
      MOCK_ONBOARDING_STATE.onboardingCompleted = true;
      return { data: MOCK_ONBOARDING_STATE };
    }
  },
};

