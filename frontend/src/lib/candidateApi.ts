import { api } from './api';

export interface CandidateDashboard {
  fullName: string | null;
  preferredRole: string | null;
  location: string | null;
  profileCompletionPercent: number;
  profileMissing: string[];
  careerReadinessScore: number;
  readinessBreakdown: Record<string, number>;
  readinessNote: string;
  resumeScore: number;
  resumeUploaded: boolean;
  resumeFileName: string | null;
  skillCount: number;
  skills: Array<{ name: string; level: string }>;
  applicationCount: number;
  interviewCount: number;
  offerCount: number;
  applicationsByStatus: Record<string, number>;
  recentApplications: Array<{
    id: number;
    jobTitle: string;
    companyOrPoster: string;
    status: string;
    matchScore: number | null;
    appliedAt: string | null;
  }>;
  nextActions: Array<{
    title: string;
    description: string;
    ctaLabel: string;
    ctaPath: string;
    priority: string;
  }>;
  openJobsCount: number;
}

export const candidateApi = {
  getDashboard() {
    return api.get<CandidateDashboard>('/api/candidate/dashboard');
  },
};
