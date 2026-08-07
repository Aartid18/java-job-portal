import { api } from './api';

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  requiredSkills: string;
  requiredExperienceYears: number;
  status: string;
  recruiterId?: number;
  recruiterName?: string;
  companyName?: string;
  createdAt?: string;
  jobQualityScore?: number;
}

export interface JobPage {
  content: Job[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const jobsApi = {
  listOpen: (page = 0, size = 20) =>
    api.get<JobPage>('/api/jobs', { params: { page, size } }),
  get: (id: number) => api.get<Job>(`/api/jobs/${id}`),
  listMine: () => api.get<Job[]>('/api/recruiter/jobs'),
  create: (body: Partial<Job>) => api.post<Job>('/api/recruiter/jobs', body),
  update: (id: number, body: Partial<Job>) => api.put<Job>(`/api/recruiter/jobs/${id}`, body),
};
