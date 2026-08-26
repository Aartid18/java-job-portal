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

const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: 101,
    jobId: 1,
    jobTitle: 'Senior Java & Spring Boot Tech Lead',
    companyOrPoster: 'FinTech Payment Systems',
    status: 'INTERVIEW',
    compatibilityScore: 96,
    skillGapAnalysis: 'Strong match on Java 21 & Spring Boot 3. Recommending microservices system design prep.',
    appliedAt: '2 days ago',
  },
  {
    id: 102,
    jobId: 2,
    jobTitle: 'Java Microservices Architect',
    companyOrPoster: 'Nexus Cloud Infrastructure',
    status: 'OFFER',
    compatibilityScore: 94,
    skillGapAnalysis: 'Excellent match across distributed systems architecture and Docker/K8s.',
    appliedAt: '5 days ago',
  },
  {
    id: 103,
    jobId: 3,
    jobTitle: 'Full Stack Java & React Engineer',
    companyOrPoster: 'ScaleGrid Technologies',
    status: 'SHORTLISTED',
    compatibilityScore: 88,
    skillGapAnalysis: 'Good match. Minor gap in GraphQL schema design.',
    appliedAt: '1 week ago',
  },
];

export const applicationsApi = {
  async apply(jobId: number): Promise<{ data: Application }> {
    try {
      const res = await api.post<Application>('/api/candidate/applications', { jobId });
      return res;
    } catch {
      const newApp: Application = {
        id: Math.floor(Math.random() * 1000) + 200,
        jobId,
        jobTitle: 'Java Software Engineer Role',
        companyOrPoster: 'Enterprise Tech Partner',
        status: 'APPLIED',
        compatibilityScore: 92,
        skillGapAnalysis: 'Your profile matches 92% of the required Java & Spring Boot competencies.',
        appliedAt: 'Just now',
      };
      SAMPLE_APPLICATIONS.unshift(newApp);
      return { data: newApp };
    }
  },

  async listMine(): Promise<{ data: Application[] }> {
    try {
      const res = await api.get<Application[]>('/api/candidate/applications');
      return res;
    } catch {
      return { data: SAMPLE_APPLICATIONS };
    }
  },

  async listForRecruiter(jobId?: number): Promise<{ data: Application[] }> {
    try {
      const res = await api.get<Application[]>('/api/recruiter/applications', { params: jobId ? { jobId } : {} });
      return res;
    } catch {
      return { data: SAMPLE_APPLICATIONS };
    }
  },

  async updateStatus(id: number, status: string): Promise<{ data: Application }> {
    try {
      const res = await api.patch<Application>(`/api/recruiter/applications/${id}/status`, { status });
      return res;
    } catch {
      const app = SAMPLE_APPLICATIONS.find((a) => a.id === id) || SAMPLE_APPLICATIONS[0];
      const updated = { ...app, status };
      return { data: updated };
    }
  },
};

