/**
 * Resume Parser Data Models
 * Strong TypeScript interfaces for type safety and validation
 */

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  gitlabUrl?: string;
  stackoverflowUrl?: string;
  mediumUrl?: string;
  portfolioUrl?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  graduationDate?: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other' | 'frontend' | 'backend' | 'devops';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements?: number;
}

export interface Insight {
  id: string;
  type: 'suggestion' | 'warning' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable?: boolean;
  relatedSection?: 'profile' | 'skills' | 'experience' | 'education';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  link?: string;
  technologies?: string[];
}

export interface ScoreBreakdown {
  total: number;
  sections: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
  };
  details: string[];
}

export interface ResumeData {
  id: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  rawText?: string;
  additionalSections?: {
    certifications?: string[];
    publications?: string[];
    languages?: Array<{ name: string; proficiency: string }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumeMetadata {
  fileName: string;
  fileSize: number;
  parsingDuration: number;
  format?: string;
  hash?: string;
  isCached?: boolean;
}

export interface ParseResult {
  success: boolean;
  data?: ResumeData;
  insights?: Insight[];
  score?: ScoreBreakdown;
  error?: ParseError;
  metadata?: ResumeMetadata;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export class ParseError extends Error {
  constructor(
    public code: 'INVALID_FILE' | 'PARSE_FAILED' | 'VALIDATION_ERROR' | 'UNKNOWN',
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

// Type guards for safer data handling
export const isResumeData = (data: unknown): data is ResumeData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'personalInfo' in data &&
    'experience' in data &&
    'skills' in data
  );
};

export const hasPersonalInfo = (data: unknown): data is { personalInfo: PersonalInfo } => {
  return typeof data === 'object' && data !== null && 'personalInfo' in data;
};
