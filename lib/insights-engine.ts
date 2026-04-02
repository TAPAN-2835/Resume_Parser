/**
 * Insights Engine
 * Generates actionable insights and suggestions for resume improvement
 */

import type { ResumeData, Insight } from '@/types/resume';

interface InsightConfig {
  minExperience: number;
  minSkills: number;
  minEducation: number;
  maxJobsDisplayed: number;
}

const defaultConfig: InsightConfig = {
  minExperience: 2,
  minSkills: 5,
  minEducation: 1,
  maxJobsDisplayed: 5,
};

/**
 * Generate resume score (0-100) based on completeness and content
 */
export const calculateResumeScore = (resume: ResumeData): number => {
  let score = 0;
  const maxScore = 100;
  const weights = {
    personalInfo: 15,
    experience: 35,
    education: 20,
    skills: 20,
    additionalSections: 10,
  };

  // Personal info scoring
  if (resume.personalInfo.firstName && resume.personalInfo.lastName) score += 3;
  if (resume.personalInfo.email) score += 3;
  if (resume.personalInfo.phone) score += 2;
  if (resume.personalInfo.summary) score += 4;
  if (resume.personalInfo.linkedinUrl || resume.personalInfo.githubUrl) score += 3;

  // Experience scoring
  const experienceScore = Math.min(resume.experience.length * 8, 30);
  score += experienceScore;
  if (resume.experience.some((exp) => exp.achievements && exp.achievements.length > 0)) {
    score += 5;
  }

  // Education scoring
  if (resume.education.length >= defaultConfig.minEducation) {
    score += 15;
  }
  if (resume.education.some((edu) => edu.gpa)) {
    score += 5;
  }

  // Skills scoring
  const skillsScore = Math.min(resume.skills.length * 2, 20);
  score += skillsScore;

  // Additional sections scoring
  if (resume.additionalSections) {
    if (resume.additionalSections.certifications?.length) score += 3;
    if (resume.additionalSections.projects?.length) score += 3;
    if (resume.additionalSections.publications?.length) score += 2;
    if (resume.additionalSections.languages?.length) score += 2;
  }

  return Math.min(score, maxScore);
};

/**
 * Generate actionable insights based on resume data
 */
export const generateInsights = (resume: ResumeData): Insight[] => {
  const insights: Insight[] = [];
  let insightId = 0;

  // Check personal info
  if (!resume.personalInfo.summary) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      priority: 'high',
      title: 'Add a Professional Summary',
      description:
        'A brief professional summary at the top of your resume helps recruiters understand your background and goals at a glance.',
      actionable: true,
      relatedSection: 'profile',
    });
  }

  if (!resume.personalInfo.linkedinUrl && !resume.personalInfo.githubUrl) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      priority: 'medium',
      title: 'Add Social Links',
      description:
        'Include links to your LinkedIn profile and GitHub to give recruiters more information about your professional presence.',
      actionable: true,
      relatedSection: 'profile',
    });
  }

  // Check experience
  if (resume.experience.length === 0) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'warning',
      priority: 'high',
      title: 'No Work Experience Found',
      description:
        'Adding your work experience is crucial for recruiters to understand your background and qualifications.',
      actionable: true,
      relatedSection: 'experience',
    });
  } else if (resume.experience.length < defaultConfig.minExperience) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      priority: 'medium',
      title: 'Limited Work Experience',
      description: `Consider adding more work experience. Most competitive resumes have at least ${defaultConfig.minExperience} positions.`,
      actionable: true,
      relatedSection: 'experience',
    });
  } else {
    // Check for achievement descriptions
    const jobsWithoutAchievements = resume.experience.filter(
      (exp) => !exp.achievements || exp.achievements.length === 0
    );
    if (jobsWithoutAchievements.length > 0) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'suggestion',
        priority: 'high',
        title: 'Add Achievements to Experience',
        description:
          'Use bullet points to highlight specific accomplishments and impact from your roles. This makes your experience more compelling.',
        actionable: true,
        relatedSection: 'experience',
      });
    }
  }

  // Check education
  if (resume.education.length === 0) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      priority: 'medium',
      title: 'Add Education Details',
      description: 'Include your educational background to give recruiters a complete picture of your qualifications.',
      actionable: true,
      relatedSection: 'education',
    });
  }

  // Check skills
  if (resume.skills.length === 0) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'warning',
      priority: 'high',
      title: 'No Skills Listed',
      description: 'Add relevant technical and soft skills that match your target job descriptions.',
      actionable: true,
      relatedSection: 'skills',
    });
  } else if (resume.skills.length < defaultConfig.minSkills) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'suggestion',
      priority: 'medium',
      title: 'Add More Skills',
      description: `Include at least ${defaultConfig.minSkills} relevant skills. A comprehensive skills section improves visibility.`,
      actionable: true,
      relatedSection: 'skills',
    });
  } else {
    // Check for skill diversity
    const categories = new Set(resume.skills.map((s) => s.category));
    if (categories.size < 3) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'suggestion',
        priority: 'low',
        title: 'Diversify Your Skills',
        description: 'Include a mix of technical and soft skills to show a well-rounded professional profile.',
        actionable: true,
        relatedSection: 'skills',
      });
    }
  }

  // Positive achievements
  const score = calculateResumeScore(resume);
  if (score >= 80) {
    insights.unshift({
      id: `insight-${insightId++}`,
      type: 'achievement',
      priority: 'high',
      title: 'Excellent Resume Quality',
      description: 'Your resume is well-structured and comprehensive. Great job!',
      actionable: false,
      relatedSection: undefined,
    });
  }

  return insights;
};

/**
 * Categorize insights by priority for UI display
 */
export const prioritizeInsights = (insights: Insight[]): Record<string, Insight[]> => {
  return insights.reduce(
    (acc, insight) => {
      if (!acc[insight.priority]) {
        acc[insight.priority] = [];
      }
      acc[insight.priority].push(insight);
      return acc;
    },
    {} as Record<string, Insight[]>
  );
};

/**
 * Get top N insights for display
 */
export const getTopInsights = (insights: Insight[], limit: number = 5): Insight[] => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return insights
    .sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      // Within same priority, show warnings and suggestions first
      const typeOrder = { warning: 0, suggestion: 1, achievement: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    })
    .slice(0, limit);
};
