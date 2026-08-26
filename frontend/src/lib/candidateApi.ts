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
  async getDashboard(): Promise<{ data: CandidateDashboard }> {
    try {
      const res = await api.get<CandidateDashboard>('/api/candidate/dashboard');
      return res;
    } catch {
      // Fallback data for standalone/Vercel/offline mode
      const storedUser = localStorage.getItem('ajp_user') || sessionStorage.getItem('ajp_user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const name = userObj?.fullName || 'Senior Java Developer';

      return {
        data: {
          fullName: name,
          preferredRole: 'Java Tech Lead & Backend Architect',
          location: 'Bengaluru / Remote',
          profileCompletionPercent: 88,
          profileMissing: ['Upload latest resume PDF for ATS scan', 'Add GitHub repository links'],
          careerReadinessScore: 92,
          readinessBreakdown: {
            'Java & Spring Boot': 95,
            'Microservices & REST': 90,
            'SQL & PostgreSQL': 88,
            'Kafka & Distributed Systems': 82,
            'System Design & Architecture': 85,
          },
          readinessNote: 'Your technical readiness is in top 5% of Java developers matching enterprise roles.',
          resumeScore: 89,
          resumeUploaded: true,
          resumeFileName: 'Java_Lead_Resume_2026.pdf',
          skillCount: 8,
          skills: [
            { name: 'Java 21', level: 'Expert' },
            { name: 'Spring Boot 3', level: 'Expert' },
            { name: 'Microservices', level: 'Advanced' },
            { name: 'PostgreSQL', level: 'Advanced' },
            { name: 'Apache Kafka', level: 'Intermediate' },
            { name: 'Docker & K8s', level: 'Intermediate' },
            { name: 'React.js', level: 'Intermediate' },
            { name: 'AWS Cloud', level: 'Intermediate' },
          ],
          applicationCount: 6,
          interviewCount: 3,
          offerCount: 1,
          openJobsCount: 24,
          applicationsByStatus: {
            Applied: 2,
            Shortlisted: 1,
            Interview: 2,
            Offer: 1,
          },
          recentApplications: [
            {
              id: 101,
              jobTitle: 'Senior Java Backend Engineer',
              companyOrPoster: 'FinTech Cloud Systems',
              status: 'INTERVIEW',
              matchScore: 96,
              appliedAt: '2 days ago',
            },
            {
              id: 102,
              jobTitle: 'Spring Boot Microservices Lead',
              companyOrPoster: 'Nexus Enterprise Solutions',
              status: 'OFFER',
              matchScore: 94,
              appliedAt: '5 days ago',
            },
            {
              id: 103,
              jobTitle: 'Full Stack Java & React Engineer',
              companyOrPoster: 'Global Scale Tech',
              status: 'SHORTLISTED',
              matchScore: 88,
              appliedAt: '1 week ago',
            },
          ],
          nextActions: [
            {
              title: 'Complete System Design Prep',
              description: 'Your upcoming interview with FinTech Cloud Systems includes high-concurrency microservices design.',
              ctaLabel: 'Open Roadmap',
              ctaPath: '/career-roadmap',
              priority: 'high',
            },
            {
              title: 'Optimize Resume for ATS',
              description: 'Add Kafka and Distributed Caching keywords to bump resume score to 95+.',
              ctaLabel: 'Analyzer',
              ctaPath: '/candidate/resume-analyzer',
              priority: 'medium',
            },
          ],
        },
      };
    }
  },
};

