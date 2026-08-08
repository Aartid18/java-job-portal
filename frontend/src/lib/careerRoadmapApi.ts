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

export const careerRoadmapApi = {
  getSkillGap(jobId?: number | null) {
    const url = jobId ? `/api/career/skill-gap/${jobId}` : '/api/career/skill-gap';
    return api.get<SkillGapDetail>(url);
  },

  getRoadmap() {
    return api.get<RoadmapResponse>('/api/career/roadmap');
  },

  generateRoadmap(payload?: { jobId?: number | null; targetRole?: string; regenerate?: boolean }) {
    return api.post<RoadmapResponse>('/api/career/roadmap', payload || {});
  },

  updateProgress(skillName: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED', progressPercent?: number) {
    return api.patch<RoadmapResponse>('/api/career/roadmap/progress', {
      skillName,
      status,
      progressPercent,
    });
  },
};
