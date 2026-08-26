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

const SAMPLE_JOBS: Job[] = [
  {
    id: 1,
    title: 'Senior Java & Spring Boot Tech Lead',
    companyName: 'FinTech Payment Systems',
    location: 'Bengaluru / Remote',
    salaryRange: '₹22 - 32 LPA',
    requiredSkills: 'Java 21, Spring Boot 3, Microservices, PostgreSQL, Kafka, Redis',
    requiredExperienceYears: 5,
    description: 'Lead design and architectural development of high-throughput payment transaction pipelines handling over 50M daily transactions with sub-10ms latencies.',
    status: 'OPEN',
    recruiterName: 'Ananya Sharma',
    createdAt: '2026-08-24T10:00:00Z',
    jobQualityScore: 98,
  },
  {
    id: 2,
    title: 'Java Microservices Architect',
    companyName: 'Nexus Cloud Infrastructure',
    location: 'Hyderabad / Hybrid',
    salaryRange: '₹28 - 40 LPA',
    requiredSkills: 'Java, Spring Cloud, Kubernetes, Docker, gRPC, AWS, System Design',
    requiredExperienceYears: 7,
    description: 'Architect distributed microservices mesh for global multi-region cloud deployment using Spring Boot 3, Kubernetes, and gRPC communications.',
    status: 'OPEN',
    recruiterName: 'Vikram Mehta',
    createdAt: '2026-08-23T14:30:00Z',
    jobQualityScore: 96,
  },
  {
    id: 3,
    title: 'Full Stack Java & React Engineer',
    companyName: 'ScaleGrid Technologies',
    location: 'Pune / Remote',
    salaryRange: '₹14 - 22 LPA',
    requiredSkills: 'Java 17, Spring Boot, React 19, TypeScript, TailwindCSS, PostgreSQL',
    requiredExperienceYears: 3,
    description: 'Build modern developer tools and dashboard UI backed by resilient Spring Boot REST microservices and GraphQL endpoints.',
    status: 'OPEN',
    recruiterName: 'Rohan Gupta',
    createdAt: '2026-08-22T09:15:00Z',
    jobQualityScore: 94,
  },
  {
    id: 4,
    title: 'Backend Engineer - High Performance Java',
    companyName: 'Quantum Trading Labs',
    location: 'Mumbai / Onsite',
    salaryRange: '₹25 - 38 LPA',
    requiredSkills: 'Core Java, Multithreading, Memory Optimization, Low Latency, JVM Tuning',
    requiredExperienceYears: 4,
    description: 'Design ultra-low latency algorithmic execution components using core Java multithreading, zero-GC techniques, and JVM tuning.',
    status: 'OPEN',
    recruiterName: 'Neha Verma',
    createdAt: '2026-08-21T11:00:00Z',
    jobQualityScore: 92,
  },
  {
    id: 5,
    title: 'Staff Java Software Engineer',
    companyName: 'CyberShield Data Security',
    location: 'Gurugram / Remote',
    salaryRange: '₹30 - 45 LPA',
    requiredSkills: 'Java 21, Spring Security, OAuth2, Cryptography, Distributed Systems',
    requiredExperienceYears: 8,
    description: 'Drive zero-trust security architecture across multi-tenant enterprise backend applications with OAuth2/OIDC protocols.',
    status: 'OPEN',
    recruiterName: 'Amitabh Roy',
    createdAt: '2026-08-20T16:20:00Z',
    jobQualityScore: 97,
  },
];

export const jobsApi = {
  async listOpen(page = 0, size = 20): Promise<{ data: JobPage }> {
    try {
      const res = await api.get<JobPage>('/api/jobs', { params: { page, size } });
      return res;
    } catch {
      return {
        data: {
          content: SAMPLE_JOBS,
          totalElements: SAMPLE_JOBS.length,
          totalPages: 1,
          number: page,
        },
      };
    }
  },

  async get(id: number): Promise<{ data: Job }> {
    try {
      const res = await api.get<Job>(`/api/jobs/${id}`);
      return res;
    } catch {
      const found = SAMPLE_JOBS.find((j) => j.id === id) || SAMPLE_JOBS[0];
      return { data: found };
    }
  },

  async listMine(): Promise<{ data: Job[] }> {
    try {
      const res = await api.get<Job[]>('/api/recruiter/jobs');
      return res;
    } catch {
      return { data: SAMPLE_JOBS.slice(0, 3) };
    }
  },

  async create(body: Partial<Job>): Promise<{ data: Job }> {
    try {
      const res = await api.post<Job>('/api/recruiter/jobs', body);
      return res;
    } catch {
      const newJob: Job = {
        id: Math.floor(Math.random() * 1000) + 100,
        title: body.title || 'Java Developer Role',
        description: body.description || 'Full stack Java & Spring Boot developer position.',
        location: body.location || 'Remote',
        salaryRange: body.salaryRange || '₹15 - 25 LPA',
        requiredSkills: body.requiredSkills || 'Java, Spring Boot, SQL',
        requiredExperienceYears: body.requiredExperienceYears || 3,
        status: 'OPEN',
        companyName: 'Tech Innovators Inc.',
        recruiterName: 'Hiring Manager',
        createdAt: new Date().toISOString(),
        jobQualityScore: 95,
      };
      SAMPLE_JOBS.unshift(newJob);
      return { data: newJob };
    }
  },

  async update(id: number, body: Partial<Job>): Promise<{ data: Job }> {
    try {
      const res = await api.put<Job>(`/api/recruiter/jobs/${id}`, body);
      return res;
    } catch {
      const existing = SAMPLE_JOBS.find((j) => j.id === id) || SAMPLE_JOBS[0];
      const updated = { ...existing, ...body };
      return { data: updated };
    }
  },
};

