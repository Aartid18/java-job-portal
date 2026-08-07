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

/** Skills grouped by career field — used for chip pickers and search. */
export const SKILL_CATEGORIES: { id: string; label: string; skills: string[] }[] = [
  {
    id: 'software',
    label: 'Software & IT',
    skills: [
      'Java',
      'Spring Boot',
      'React',
      'TypeScript',
      'JavaScript',
      'Python',
      'SQL',
      'HTML/CSS',
      'Node.js',
      'Docker',
      'AWS',
      'Git',
      'REST APIs',
      'MySQL',
      'MongoDB',
      'Kubernetes',
      'C++',
      'Android',
      'iOS/Swift',
      'Cybersecurity',
      'DevOps',
      'Machine Learning',
    ],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    skills: [
      'Excel',
      'Power BI',
      'Tableau',
      'SQL',
      'Python',
      'R',
      'Statistics',
      'Data Visualization',
      'Google Analytics',
      'ETL',
      'Data Cleaning',
      'Business Intelligence',
      'A/B Testing',
      'SPSS',
    ],
  },
  {
    id: 'design',
    label: 'Design & Creative',
    skills: [
      'UI Design',
      'UX Research',
      'Figma',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Canva',
      'Graphic Design',
      'Wireframing',
      'Prototyping',
      'Brand Identity',
      'Video Editing',
      'Motion Design',
      'Typography',
      'User Testing',
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing & Growth',
    skills: [
      'Digital Marketing',
      'SEO',
      'SEM / Google Ads',
      'Social Media Marketing',
      'Content Writing',
      'Copywriting',
      'Email Marketing',
      'Brand Strategy',
      'Market Research',
      'Influencer Marketing',
      'CRM',
      'HubSpot',
      'Campaign Management',
      'Public Relations',
    ],
  },
  {
    id: 'sales',
    label: 'Sales & Business',
    skills: [
      'Sales',
      'Business Development',
      'Lead Generation',
      'Negotiation',
      'Client Relationship Management',
      'Cold Calling',
      'Account Management',
      'Salesforce',
      'Pitch Decks',
      'B2B Sales',
      'Retail Sales',
      'Customer Success',
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    skills: [
      'Accounting',
      'Financial Analysis',
      'Bookkeeping',
      'Tally',
      'GST',
      'Taxation',
      'Budgeting',
      'Auditing',
      'Excel Financial Modeling',
      'QuickBooks',
      'SAP FICO',
      'Investment Analysis',
      'Risk Management',
      'Payroll',
    ],
  },
  {
    id: 'hr',
    label: 'HR & People',
    skills: [
      'Recruitment',
      'Talent Acquisition',
      'HR Policies',
      'Employee Engagement',
      'Performance Management',
      'Payroll Administration',
      'Onboarding',
      'Training & Development',
      'Conflict Resolution',
      'HRMS',
      'Labor Law Basics',
      'Compensation & Benefits',
    ],
  },
  {
    id: 'operations',
    label: 'Operations & Admin',
    skills: [
      'Project Management',
      'Operations Management',
      'Supply Chain',
      'Logistics',
      'Inventory Management',
      'Vendor Management',
      'Process Improvement',
      'MS Office',
      'Documentation',
      'Quality Assurance',
      'Lean / Six Sigma',
      'Event Management',
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Life Sciences',
    skills: [
      'Patient Care',
      'Clinical Research',
      'Pharmacology',
      'Medical Coding',
      'Nursing',
      'Laboratory Techniques',
      'Healthcare Administration',
      'EMR / EHR',
      'First Aid / CPR',
      'Public Health',
      'Biotechnology',
      'Pharmacy Practice',
    ],
  },
  {
    id: 'education',
    label: 'Education & Training',
    skills: [
      'Teaching',
      'Curriculum Design',
      'Lesson Planning',
      'Classroom Management',
      'Online Tutoring',
      'Instructional Design',
      'Assessment Design',
      'Mentoring',
      'E-learning Tools',
      'Special Education',
    ],
  },
  {
    id: 'legal',
    label: 'Legal & Compliance',
    skills: [
      'Legal Research',
      'Contract Drafting',
      'Corporate Law',
      'Compliance',
      'Litigation Support',
      'Intellectual Property',
      'Due Diligence',
      'Regulatory Affairs',
      'Legal Writing',
    ],
  },
  {
    id: 'soft',
    label: 'Soft skills',
    skills: [
      'Communication',
      'Leadership',
      'Teamwork',
      'Problem Solving',
      'Time Management',
      'Critical Thinking',
      'Presentation Skills',
      'Adaptability',
      'Customer Service',
      'Emotional Intelligence',
      'Stakeholder Management',
      'Public Speaking',
    ],
  },
];

export const SKILL_SUGGESTIONS = Array.from(
  new Set(SKILL_CATEGORIES.flatMap((c) => c.skills))
).sort((a, b) => a.localeCompare(b));

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

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
