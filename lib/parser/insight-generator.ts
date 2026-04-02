import { ResumeData, Insight, Skill, ScoreBreakdown } from '@/types/resume';
import { CareerProfile } from './classifier';

export function generateSmartInsights(data: Partial<ResumeData>, profile: CareerProfile): Insight[] {
  const insights: Insight[] = [];
  let idSuffix = 0;
  const experiences = data.experience || [];
  const achievements = experiences.flatMap(exp => exp.achievements || []);
  const personalInfo = data.personalInfo || {};
  const skills = data.skills || [];
  const projects = data.projects || [];

  // 1. Profile Achievement
  const specialization = detectSpecialization(skills, profile);
  insights.push({
    id: `insight-specialization-${idSuffix++}`,
    type: 'achievement',
    priority: 'low',
    title: `Specialization: ${specialization}`,
    description: `Your profile strongly aligns with a ${specialization} path. This clear focus helps recruiters match you to the right roles instantly.`,
    actionable: false,
    relatedSection: 'profile'
  });

  // 2. Social Presence (Weakness/Suggestion)
  const socialCount = [
    personalInfo.linkedinUrl,
    personalInfo.githubUrl,
    personalInfo.portfolioUrl
  ].filter(Boolean).length;

  if (socialCount === 0) {
    insights.push({
      id: `insight-social-${idSuffix++}`,
      type: 'warning',
      priority: 'high',
      title: 'Missing Professional Footprint',
      description: 'No LinkedIn or GitHub links detected. Modern technical roles require external validation of your professional identity and code.',
      actionable: true,
      relatedSection: 'profile'
    });
  } else if (socialCount < 3) {
    insights.push({
      id: `insight-social-suggest-${idSuffix++}`,
      type: 'suggestion',
      priority: 'medium',
      title: 'Expand Digital Presence',
      description: 'You have some social links, but adding a dedicated portfolio or technical blog can significantly differentiate you from other candidates.',
      actionable: true,
      relatedSection: 'profile'
    });
  }

  // 3. Experience Impact
  const metricRegex = /\d+%|\d+\s?users|\$\d+|\d+\s?x|reduced|increased|improved/i;
  const metricsFound = achievements.filter(a => metricRegex.test(a)).length;

  if (metricsFound >= 3) {
    insights.push({
      id: `insight-impact-achieve-${idSuffix++}`,
      type: 'achievement',
      priority: 'medium',
      title: 'Data-Driven Impact',
      description: 'Great job quantifying your results. Recruiters love seeing measurable outcomes like "improved efficiency by 20%".',
      actionable: false,
      relatedSection: 'experience'
    });
  } else {
    insights.push({
      id: `insight-impact-suggest-${idSuffix++}`,
      type: 'suggestion',
      priority: 'high',
      title: 'Quantify Your Achievements',
      description: 'Your experience focus is on tasks. Try to add specific metrics (e.g., "Reduced latency by 30%") to show the value you delivered.',
      actionable: true,
      relatedSection: 'experience'
    });
  }

  // 4. Project Depth
  if (projects.length === 0) {
    insights.push({
      id: `insight-projects-warning-${idSuffix++}`,
      type: 'warning',
      priority: 'medium',
      title: 'Missing Project Portfolio',
      description: 'No specific projects were detected. Projects are critical for demonstrating hands-on skill usage, especially for early-career developers.',
      actionable: true,
    });
  }

  return insights;
}

function detectSpecialization(skills: Skill[], profile: CareerProfile): string {
  const counts = {
    frontend: skills.filter(s => s.category === 'frontend').length,
    backend: skills.filter(s => s.category === 'backend').length,
    devops: skills.filter(s => s.category === 'devops').length,
  };

  if (counts.frontend > counts.backend && counts.frontend > counts.devops) return 'Frontend Specialist';
  if (counts.backend > counts.frontend && counts.backend > counts.devops) return 'Backend Architect';
  if (counts.devops > counts.frontend && counts.devops > counts.backend) return 'Cloud Infrastructure Engineer';
  if (counts.frontend > 2 && counts.backend > 2) return 'Full-Stack Developer';
  
  return profile;
}

export function calculateSmartScore(data: Partial<ResumeData>): ScoreBreakdown {
  const sections = {
    personalInfo: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0
  };
  const details: string[] = [];

  // 1. Personal Info (Max 20)
  if (data.personalInfo?.email) { sections.personalInfo += 5; details.push('Contact email found'); }
  if (data.personalInfo?.phone) { sections.personalInfo += 5; details.push('Phone number found'); }
  if (data.personalInfo?.linkedinUrl) { sections.personalInfo += 5; details.push('LinkedIn profile connected'); }
  if (data.personalInfo?.githubUrl || data.personalInfo?.portfolioUrl) { sections.personalInfo += 5; details.push('Professional portfolio/GitHub found'); }

  // 2. Experience (Max 30)
  const expCount = (data.experience || []).length;
  if (expCount >= 3) { sections.experience = 30; details.push('Strong professional history'); }
  else if (expCount >= 1) { sections.experience = 15; details.push('Initial professional experience found'); }
  else { details.push('Limited professional history detected'); }

  // 3. Education (Max 15)
  if ((data.education || []).length > 0) { sections.education = 15; details.push('Academic qualifications verified'); }
  else { details.push('No formal education detected'); }

  // 4. Skills (Max 20)
  const skillCount = (data.skills || []).length;
  if (skillCount >= 10) { sections.skills = 20; details.push('Comprehensive technical skill set'); }
  else if (skillCount >= 5) { sections.skills = 10; details.push('Core technical competencies detected'); }
  else { details.push('Limited technical skills extracted'); }

  // 5. Projects (Max 15)
  const projCount = (data.projects || []).length;
  if (projCount >= 2) { sections.projects = 15; details.push('Robust project portfolio'); }
  else if (projCount >= 1) { sections.projects = 10; details.push('Individual projects detected'); }
  else { details.push('No specific projects found'); }

  const total = Object.values(sections).reduce((a, b) => a + b, 0);

  return {
    total: Math.min(total, 100),
    sections,
    details
  };
}
