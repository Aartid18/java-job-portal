export interface ProfileCompletion {
  percent: number;
  missing: string[];
  canFinish: boolean;
  onboardingStep: number;
}

export interface OnboardingState {
  basic: {
    fullName: string | null;
    phone: string | null;
    location: string | null;
    bio: string | null;
    photoUrl: string | null;
  };
  educations: Array<{
    id?: number;
    degree?: string;
    college?: string;
    fieldOfStudy?: string;
    startYear?: number | null;
    graduationYear?: number | null;
    cgpa?: string;
  }>;
  skills: Array<{
    id?: number;
    name: string;
    level: string;
  }>;
  experiences: Array<{
    id?: number;
    type?: string;
    company?: string;
    roleTitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  projects: Array<{
    id?: number;
    name?: string;
    description?: string;
    technologies?: string;
    githubUrl?: string;
    liveUrl?: string;
  }>;
  preferences: {
    preferredJobRole?: string | null;
    preferredLocations?: string | null;
    remotePreference?: string | null;
    expectedSalary?: string | null;
    experienceLevel?: string | null;
    jobTypes?: string | null;
  };
  resume: {
    uploaded: boolean;
    fileName?: string | null;
  };
  completion: ProfileCompletion;
  onboardingCompleted: boolean;
}

export const SKILL_SUGGESTIONS = [
  'Java',
  'Spring Boot',
  'React',
  'TypeScript',
  'Python',
  'SQL',
  'MySQL',
  'Docker',
  'AWS',
  'Kubernetes',
  'REST APIs',
  'Git',
  'Node.js',
  'Hibernate',
  'Redis',
];

export const CANDIDATE_STEPS = [
  'Basic info',
  'Education',
  'Skills',
  'Experience',
  'Projects',
  'Preferences',
  'Resume',
  'Complete',
] as const;
