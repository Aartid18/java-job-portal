import { api } from './api';
import type { OnboardingState } from '../types/onboarding';

export const onboardingApi = {
  getState() {
    return api.get<OnboardingState>('/api/candidate/onboarding');
  },
  saveBasic(payload: {
    fullName: string;
    phone?: string;
    location?: string;
    bio?: string;
    photoUrl?: string;
  }) {
    return api.put<OnboardingState>('/api/candidate/onboarding/basic', payload);
  },
  saveEducation(items: OnboardingState['educations']) {
    return api.put<OnboardingState>('/api/candidate/onboarding/education', items);
  },
  saveSkills(items: OnboardingState['skills']) {
    return api.put<OnboardingState>('/api/candidate/onboarding/skills', items);
  },
  saveExperience(items: OnboardingState['experiences']) {
    return api.put<OnboardingState>('/api/candidate/onboarding/experience', items);
  },
  saveProjects(items: OnboardingState['projects']) {
    return api.put<OnboardingState>('/api/candidate/onboarding/projects', items);
  },
  savePreferences(prefs: OnboardingState['preferences']) {
    return api.put<OnboardingState>('/api/candidate/onboarding/preferences', prefs);
  },
  uploadResume(file: File) {
    const form = new FormData();
    form.append('file', file);
    return api.post<OnboardingState>('/api/candidate/onboarding/resume', form);
  },
  skipResume() {
    return api.post<OnboardingState>('/api/candidate/onboarding/resume/skip');
  },
  finish() {
    return api.post<OnboardingState>('/api/candidate/onboarding/finish');
  },
};
