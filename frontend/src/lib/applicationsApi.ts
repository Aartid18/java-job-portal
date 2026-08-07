import { api } from './api';

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyOrPoster: string;
  candidateId?: number;
  candidateName?: string;
  status: string;
  compatibilityScore: number | null;
  skillGapAnalysis: string | null;
  appliedAt: string | null;
}

export const applicationsApi = {
  apply: (jobId: number) => api.post<Application>('/api/candidate/applications', { jobId }),
  listMine: () => api.get<Application[]>('/api/candidate/applications'),
  listForRecruiter: (jobId?: number) =>
    api.get<Application[]>('/api/recruiter/applications', { params: jobId ? { jobId } : {} }),
  updateStatus: (id: number, status: string) =>
    api.patch<Application>(`/api/recruiter/applications/${id}/status`, { status }),
};
