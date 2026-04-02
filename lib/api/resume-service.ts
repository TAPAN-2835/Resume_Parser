/**
 * Resume Service - API Abstraction Layer
 * Handles all resume parsing operations with mock implementation
 * Can be easily swapped for real backend implementation
 */

import {
  ParseResult,
  ResumeData,
  ValidationResult,
  ValidationError,
  PersonalInfo,
  ParseError,
} from '@/types/resume';
import { calculateResumeScore, generateInsights } from '@/lib/insights-engine';

const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PARSING_DELAY = 2500; // Simulate parsing time

/**
 * Validates file before parsing
 */
export const validateFile = (file: File): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push({
      field: 'file',
      message: 'Invalid file type. Please upload a PDF, TXT, or Word document.',
      severity: 'error',
    });
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push({
      field: 'file',
      message: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      severity: 'error',
    });
  }

  // Check file name
  if (!file.name || file.name.trim().length === 0) {
    errors.push({
      field: 'filename',
      message: 'Invalid filename.',
      severity: 'error',
    });
  }

  return errors;
};

/**
 * Validates parsed resume data
 */
export const validateResume = (data: ResumeData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate personal info
  if (!data.personalInfo) {
    errors.push({
      field: 'personalInfo',
      message: 'Personal information is required.',
      severity: 'error',
    });
  } else {
    if (!data.personalInfo.firstName && !data.personalInfo.lastName) {
      errors.push({
        field: 'personalInfo.name',
        message: 'Name is required.',
        severity: 'error',
      });
    }
    if (!data.personalInfo.email) {
      errors.push({
        field: 'personalInfo.email',
        message: 'Email is required.',
        severity: 'error',
      });
    }
  }

  // Validate arrays
  if (!Array.isArray(data.experience)) {
    errors.push({
      field: 'experience',
      message: 'Experience must be an array.',
      severity: 'error',
    });
  }
  if (!Array.isArray(data.skills)) {
    errors.push({
      field: 'skills',
      message: 'Skills must be an array.',
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
};

/**
 * Parse resume file - Real implementation calling server-side parser
 */
export const parseResume = async (file: File): Promise<ParseResult> => {
  try {
    const startTime = performance.now();

    // Validate file
    const fileErrors = validateFile(file);
    if (fileErrors.length > 0) {
      return {
        success: false,
        error: new ParseError('INVALID_FILE', fileErrors[0].message, { errors: fileErrors }),
      };
    }

    // Call real API
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to parse resume');
    }

    const result = await response.json();
    const endTime = performance.now();

    // Add duration to metadata
    if (result.success && result.metadata) {
      result.metadata.parsingDuration = Math.round(endTime - startTime);
    }

    return result as ParseResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: new ParseError('PARSE_FAILED', `Failed to parse resume: ${message}`, { originalError: error }),
    };
  }
};

/**
 * Generate mock resume data (for demo purposes)
 * In production, this would be parsed from the actual file
 */
const generateMockResumeData = (fileName: string): ResumeData => {
  const nameFromFile = fileName.replace(/\.[^/.]+$/, '').split('_')[0] || 'John';

  return {
    id: `resume-${Date.now()}`,
    personalInfo: {
      firstName: nameFromFile,
      lastName: 'Doe',
      email: `${nameFromFile.toLowerCase()}@example.com`,
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary:
        'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Proficient in TypeScript, React, and Node.js.',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      githubUrl: 'https://github.com/johndoe',
      portfolioUrl: 'https://johndoe.dev',
    },
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Senior Frontend Engineer',
        company: 'TechCorp Inc',
        location: 'San Francisco, CA',
        startDate: '2021-06',
        endDate: undefined,
        isCurrent: true,
        description:
          'Leading frontend development for customer-facing applications serving 1M+ users',
        achievements: [
          'Architected and launched new design system, improving development velocity by 40%',
          'Reduced page load time by 60% through performance optimization',
          'Mentored 3 junior engineers, two promoted to mid-level positions',
          'Led migration of legacy codebase to TypeScript and React 18',
        ],
      },
      {
        id: 'exp-2',
        jobTitle: 'Frontend Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        startDate: '2019-03',
        endDate: '2021-06',
        description: 'Built responsive web applications using React and Node.js',
        achievements: [
          'Developed real-time collaboration features used by 50k+ monthly active users',
          'Implemented comprehensive unit and integration tests (95% code coverage)',
          'Reduced API response time by 50% through caching strategies',
        ],
      },
      {
        id: 'exp-3',
        jobTitle: 'Junior Web Developer',
        company: 'WebAgency Co',
        location: 'New York, NY',
        startDate: '2018-01',
        endDate: '2019-03',
        description: 'Developed custom websites and web applications for clients',
        achievements: [
          'Built 15+ client websites resulting in $200k+ in revenue',
          'Improved website performance metrics reducing bounce rate by 25%',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: "Bachelor's of Science",
        institution: 'State University',
        field: 'Computer Science',
        graduationDate: '2018-05',
        gpa: '3.8',
        achievements: ['Dean\'s List all 4 years', 'Computer Science Department Award'],
      },
    ],
    skills: [
      { id: 'skill-1', name: 'TypeScript', category: 'technical', proficiency: 'expert' },
      { id: 'skill-2', name: 'React', category: 'frontend', proficiency: 'expert' },
      { id: 'skill-3', name: 'Node.js', category: 'backend', proficiency: 'advanced' },
      { id: 'skill-4', name: 'Next.js', category: 'frontend', proficiency: 'advanced' },
      { id: 'skill-5', name: 'Tailwind CSS', category: 'frontend', proficiency: 'expert' },
      { id: 'skill-6', name: 'PostgreSQL', category: 'backend', proficiency: 'advanced' },
      { id: 'skill-7', name: 'AWS', category: 'devops', proficiency: 'intermediate' },
      { id: 'skill-8', name: 'Leadership', category: 'other', proficiency: 'advanced' },
      { id: 'skill-9', name: 'Communication', category: 'other', proficiency: 'expert' },
      { id: 'skill-10', name: 'Problem Solving', category: 'other', proficiency: 'expert' },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Open Source Component Library',
        description: 'Built a highly accessible React component library with 2k+ GitHub stars.',
        link: 'https://github.com/johndoe/ui-lib',
        technologies: ['React', 'TypeScript', 'Tailwind']
      },
      {
        id: 'proj-2',
        name: 'EcoTrack Mobile App',
        description: 'Environmental impact tracking application with 50k+ downloads.',
        link: 'https://apps.apple.com/ecotrack',
        technologies: ['React Native', 'Firebase']
      }
    ],
    additionalSections: {
      certifications: [
        'AWS Certified Solutions Architect - Professional',
        'Google Cloud Professional Data Engineer',
      ],
      languages: [
        { name: 'English', proficiency: 'Native' },
        { name: 'Spanish', proficiency: 'Intermediate' },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * In-memory cache for parsed resumes
 * In production, this would use a real cache (Redis, etc.)
 */
const resumeCache = new Map<string, ParseResult>();

/**
 * Get cached parse result
 */
export const getCachedResult = (fileHash: string): ParseResult | undefined => {
  return resumeCache.get(fileHash);
};

/**
 * Cache parse result
 */
export const cacheResult = (fileHash: string, result: ParseResult): void => {
  resumeCache.set(fileHash, result);
};

/**
 * Clear cache
 */
export const clearCache = (): void => {
  resumeCache.clear();
};
