import { api } from './api';

export interface PrioritizedSkillGap {
  skillName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  isRequired: boolean;
  frequencyInDescription: number;
  recommendedProject: string;
  roadmapLink: string;
}

export interface SkillGapDetail {
  jobId: number | null;
  jobTitle: string;
  companyOrPoster: string;
  targetRole: string;
  overallReadiness: number;
  technicalSkillsScore: number;
  requiredToolsScore: number;
  experienceScore: number;
  resumeEvidenceScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  prioritizedGaps: PrioritizedSkillGap[];
  nextRecommendations: string[];
}

export interface RoadmapDay {
  dayNumber: number;
  title: string;
  task: string;
  practicePrompt: string;
  completed?: boolean;
}

export interface LearningResource {
  skillName: string;
  officialDocTitle: string;
  officialDocUrl: string;
  freeResources: string[];
  practiceSuggestions: string[];
  practicalProjectIdea: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  skillFocus: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  weeklyGoal: string;
  days: RoadmapDay[];
  learningResources: LearningResource;
}

export interface RoadmapProject {
  skillName: string;
  title: string;
  description: string;
  practicalArchitecture: string;
  deliverables: string[];
}

export interface SkillProgressItem {
  skillName: string;
  priority: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  updatedAt: string | null;
}

export interface RoadmapResponse {
  id: number;
  targetRole: string;
  targetJobId: number | null;
  targetJobTitle: string | null;
  currentReadiness: number;
  overallProgress: number;
  mainSkillGaps: PrioritizedSkillGap[];
  weeks: RoadmapWeek[];
  projectRecommendations: RoadmapProject[];
  skillProgressList: SkillProgressItem[];
  createdAt: string | null;
  updatedAt: string | null;
}

const SAMPLE_SKILL_GAP: SkillGapDetail = {
  jobId: 1,
  jobTitle: 'Senior Java & Spring Boot Tech Lead',
  companyOrPoster: 'FinTech Payment Systems',
  targetRole: 'Java Tech Lead & Backend Architect',
  overallReadiness: 92,
  technicalSkillsScore: 95,
  requiredToolsScore: 88,
  experienceScore: 90,
  resumeEvidenceScore: 89,
  matchedSkills: ['Java 21', 'Spring Boot 3', 'Microservices', 'PostgreSQL', 'REST APIs', 'Docker'],
  missingSkills: ['Apache Kafka Event Streaming', 'System Design & High Concurrency'],
  partialSkills: ['Kubernetes Cluster Mgmt', 'Redis Caching'],
  prioritizedGaps: [
    {
      skillName: 'Apache Kafka Event Streaming',
      priority: 'HIGH',
      reason: 'Required for high-throughput payment transaction pipelines handling over 50M events daily.',
      isRequired: true,
      frequencyInDescription: 4,
      recommendedProject: 'Build a distributed transactional outbox pattern using Kafka & Spring Cloud Streams.',
      roadmapLink: '/career-roadmap',
    },
    {
      skillName: 'High Concurrency System Design',
      priority: 'HIGH',
      reason: 'Essential for technical lead interviews evaluating low-latency microservices partitioning.',
      isRequired: true,
      frequencyInDescription: 3,
      recommendedProject: 'Design & benchmark sub-10ms rate-limiter service using Java Virtual Threads & Redis.',
      roadmapLink: '/career-roadmap',
    },
  ],
  nextRecommendations: [
    'Review Java 21 Virtual Threads (Project Loom) performance characteristics.',
    'Implement a Redis distributed lock mechanism for concurrent payment transactions.',
    'Optimize PostgreSQL queries using compound indexes and explain analyze traces.',
  ],
};

const SAMPLE_ROADMAP: RoadmapResponse = {
  id: 1,
  targetRole: 'Senior Java & Backend Architect',
  targetJobId: 1,
  targetJobTitle: 'Senior Java & Spring Boot Tech Lead',
  currentReadiness: 92,
  overallProgress: 45,
  createdAt: '2026-08-25T10:00:00Z',
  updatedAt: '2026-08-26T12:00:00Z',
  mainSkillGaps: SAMPLE_SKILL_GAP.prioritizedGaps,
  weeks: [
    {
      weekNumber: 1,
      skillFocus: 'Java 21 Virtual Threads & Concurrency',
      priority: 'HIGH',
      weeklyGoal: 'Master Java 21 Loom Virtual Threads, Structured Concurrency, and Low-Latency Performance.',
      days: [
        { dayNumber: 1, title: 'Virtual Threads vs Platform Threads', task: 'Benchmark 100,000 concurrent Virtual Threads in Java 21 vs OS ThreadPool.', practicePrompt: 'Write a benchmark class comparing Executors.newVirtualThreadPerTaskExecutor() with ThreadPoolExecutor.', completed: true },
        { dayNumber: 2, title: 'Structured Concurrency API', task: 'Implement StructuredTaskScope to coordinate async API calls with automatic cancellation.', practicePrompt: 'Create a payment gateway aggregator using StructuredTaskScope.ShutdownOnFailure.', completed: true },
        { dayNumber: 3, title: 'Scoped Values & Context', task: 'Replace ThreadLocal with ScopedValue for thread-safe context propagation across Virtual Threads.', practicePrompt: 'Implement request tenant-id propagation using ScopedValue.', completed: false },
        { dayNumber: 4, title: 'Pattern Matching & Sealed Classes', task: 'Design domain models using Sealed Interfaces and exhaustive switch pattern matching in Java 21.', practicePrompt: 'Refactor PaymentResult sealed interface using record patterns.', completed: false },
        { dayNumber: 5, title: 'Java 21 JVM Tuning', task: 'Profile GC pauses with ZGC (Z Garbage Collector) under high memory allocation.', practicePrompt: 'Tune JVM flags -XX:+UseZGC -XX:+ZGenerational for sub-1ms pauses.', completed: false },
      ],
      learningResources: {
        skillName: 'Java 21 Deep Dive',
        officialDocTitle: 'OpenJDK Java 21 Release Notes & JEP Docs',
        officialDocUrl: 'https://openjdk.org/projects/jdk/21/',
        freeResources: ['Baeldung Java 21 Guide', 'Inside Java Podcast by Oracle Engineers'],
        practiceSuggestions: ['Build a lightweight Web Server handling 50k concurrent requests'],
        practicalProjectIdea: 'High-Concurrency Java 21 Virtual Thread Payment Gateway API',
      },
    },
    {
      weekNumber: 2,
      skillFocus: 'Apache Kafka & Distributed Event Streams',
      priority: 'HIGH',
      weeklyGoal: 'Implement Transactional Messaging, Consumer Groups, and Schema Registry in Spring Boot.',
      days: [
        { dayNumber: 6, title: 'Kafka Topics & Partition Strategy', task: 'Design event topic partitioning key strategies for strict ordering.', practicePrompt: 'Create KafkaTopicConfig with custom partitioner based on customerId.', completed: false },
        { dayNumber: 7, title: 'Transactional Outbox Pattern', task: 'Implement CDC (Change Data Capture) outbox worker using Spring Data JPA & Kafka.', practicePrompt: 'Write OutboxPublisher scheduled worker with idempotent idempotency keys.', completed: false },
      ],
      learningResources: {
        skillName: 'Apache Kafka',
        officialDocTitle: 'Apache Kafka Official Docs & Spring for Apache Kafka',
        officialDocUrl: 'https://kafka.apache.org/documentation/',
        freeResources: ['Confluent Developer Courses', 'Spring Kafka Reference Guide'],
        practiceSuggestions: ['Build a real-time order processing pipeline with Dead Letter Queue (DLQ)'],
        practicalProjectIdea: 'Distributed Outbox Event Streaming Service with Spring Boot & Kafka',
      },
    },
  ],
  projectRecommendations: [
    {
      skillName: 'Java 21 & Kafka',
      title: 'High-Throughput Payment Outbox Microservice',
      description: 'Build an enterprise-grade outbox microservice ensuring 100% reliable event delivery under network partitions.',
      practicalArchitecture: 'Spring Boot 3 + Java 21 Virtual Threads + PostgreSQL Outbox Table + Apache Kafka + Resilience4j Circuit Breaker',
      deliverables: ['Spring Boot Service Repository', 'Docker Compose Cluster Setup', 'JMeter Load Testing Script (50k req/sec)'],
    },
  ],
  skillProgressList: [
    { skillName: 'Java 21 Virtual Threads', priority: 'HIGH', status: 'IN_PROGRESS', progressPercent: 60, updatedAt: '2026-08-26T10:00:00Z' },
    { skillName: 'Apache Kafka Event Streams', priority: 'HIGH', status: 'NOT_STARTED', progressPercent: 0, updatedAt: null },
    { skillName: 'System Design & Distributed Locks', priority: 'HIGH', status: 'IN_PROGRESS', progressPercent: 30, updatedAt: '2026-08-25T14:00:00Z' },
  ],
};

export const careerRoadmapApi = {
  async getSkillGap(jobId?: number | null): Promise<{ data: SkillGapDetail }> {
    try {
      const url = jobId ? `/api/career/skill-gap/${jobId}` : '/api/career/skill-gap';
      const res = await api.get<SkillGapDetail>(url);
      return res;
    } catch {
      return { data: SAMPLE_SKILL_GAP };
    }
  },

  async getRoadmap(): Promise<{ data: RoadmapResponse }> {
    try {
      const res = await api.get<RoadmapResponse>('/api/career/roadmap');
      return res;
    } catch {
      return { data: SAMPLE_ROADMAP };
    }
  },

  async generateRoadmap(payload?: { jobId?: number | null; targetRole?: string; regenerate?: boolean }): Promise<{ data: RoadmapResponse }> {
    try {
      const res = await api.post<RoadmapResponse>('/api/career/roadmap', payload || {});
      return res;
    } catch {
      return { data: SAMPLE_ROADMAP };
    }
  },

  async updateProgress(skillName: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED', progressPercent?: number): Promise<{ data: RoadmapResponse }> {
    try {
      const res = await api.patch<RoadmapResponse>('/api/career/roadmap/progress', {
        skillName,
        status,
        progressPercent,
      });
      return res;
    } catch {
      const updated = { ...SAMPLE_ROADMAP };
      const item = updated.skillProgressList.find((s) => s.skillName === skillName);
      if (item) {
        item.status = status;
        if (progressPercent != null) item.progressPercent = progressPercent;
      }
      return { data: updated };
    }
  },
};

