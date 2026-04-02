import { ResumeNormalizer } from '../lib/parser/resume-normalizer';

describe('ResumeNormalizer', () => {
  it('should extract social links correctly without protocols', () => {
    const text = 'LinkedIn: linkedin.com/in/johndoe GitHub: github.com/johndoe';
    const normalizer = new ResumeNormalizer(text);
    const result = normalizer.normalize();
    
    expect(result.personalInfo?.linkedinUrl).toBe('https://www.linkedin.com/in/johndoe');
    expect(result.personalInfo?.githubUrl).toBe('https://www.github.com/johndoe');
  });

  it('should identify major sections correctly', () => {
    const text = `
      EXPERIENCE
      Software Engineer at Google
      
      EDUCATION
      BS in Computer Science
    `;
    const normalizer = new ResumeNormalizer(text);
    const result = normalizer.normalize();
    
    expect(result.experience?.length).toBeGreaterThan(0);
    expect(result.education?.length).toBeGreaterThan(0);
  });

  it('should extract skills and categorize them', () => {
    const text = 'SKILLS: React, Node.js, Leadership';
    const normalizer = new ResumeNormalizer(text);
    const result = normalizer.normalize();
    
    const reactSkill = result.skills?.find(s => s.name === 'React');
    const leadershipSkill = result.skills?.find(s => s.name === 'Leadership');
    
    expect(reactSkill?.category).toBe('technical');
    expect(leadershipSkill?.category).toBe('soft');
  });
});
