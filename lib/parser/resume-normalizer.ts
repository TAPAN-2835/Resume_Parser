import { ResumeData, PersonalInfo, Experience, Education, Skill, Project } from '@/types/resume';

export class ResumeNormalizer {
  private rawLines: string[];
  private fullText: string;

  constructor(text: string) {
    this.fullText = text;
    this.rawLines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  }

  public normalize(annotations?: Array<{ url: string; page: number }>): Partial<ResumeData> {
    const sections = this.segmentText();
    const headerText = sections.header || this.rawLines.slice(0, 15).join('\n');
    const personalInfo = this.extractPersonalInfo(headerText);

    // Merge annotation links (GitHub, LinkedIn, etc.)
    if (annotations) {
      this.mergeAnnotations(personalInfo, annotations);
    }

    // Fallback link extraction from text
    this.extractLinksFromText(personalInfo, this.fullText);

    return {
      personalInfo,
      experience: this.extractExperience(sections.experience || ''),
      education: this.extractEducation(sections.education || ''),
      skills: this.extractSkills(sections.skills || ''),
      projects: this.extractProjects(sections.projects || '', annotations || []),
      rawText: this.fullText,
      additionalSections: {
        certifications: this.extractList(sections.certifications || ''),
      }
    };
  }

  /**
   * SECTIONS: Multi-pass semantic segmentation
   */
  private segmentText(): Record<string, string> {
    const sectionMarkers: Record<string, RegExp> = {
      experience: /^(EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL BACKGROUND|CAREER SUMMARY|WORK EXPERIENCE|WHERE I'VE WORKED|JOURNEY|HISTORY)/i,
      education: /^(EDUCATION|ACADEMIC|QUALIFICATIONS|STUDIES|ACADEMIC BACKGROUND|LEARNING|SCHOLASTIC)/i,
      skills: /^(SKILLS|TECHNICAL SKILLS|COMPETENCIES|CORE STRENGTHS|TECHNOLOGIES|TECHNICAL STACK|SKILLSET|TOOLBOX|WEAPONRY)/i,
      projects: /^(PROJECTS|PERSONAL PROJECTS|PORTFOLIO|SIDE PROJECTS|ACADEMIC PROJECTS|LABS|CREATIONS)/i,
      certifications: /^(CERTIFICATIONS|AWARDS|LICENSES|COURSES|HONORS|ACCOMPLISHMENTS)/i,
    };

    const sections: Record<string, string[]> = { header: [] };
    let currentSection = 'header';

    this.rawLines.forEach(line => {
      let foundMarker = false;
      const cleanLine = line.replace(/^[•\-\*]\s?/, '').trim();

      for (const [key, marker] of Object.entries(sectionMarkers)) {
        if (marker.test(cleanLine) && cleanLine.length < 40) {
          currentSection = key;
          if (!sections[currentSection]) sections[currentSection] = [];
          foundMarker = true;
          break;
        }
      }

      if (!foundMarker) {
        sections[currentSection].push(line);
      }
    });

    const result: Record<string, string> = {};
    for (const key in sections) {
      result[key] = sections[key].join('\n');
    }
    return result;
  }

  /**
   * PERSONAL INFO: Name, Contact, Socials
   */
  private extractPersonalInfo(text: string): PersonalInfo {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Email & Phone
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

    // Name: Usually the first non-empty line that isn't a contact info or link
    let nameLine = '';
    for (const line of lines) {
      if (line.includes('@') || line.match(/\d{3}/) || line.toLowerCase().includes('http') || line.toLowerCase().includes('www.')) continue;
      if (line.length > 2 && line.length < 50) {
        nameLine = line;
        break;
      }
    }

    const nameParts = nameLine.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Summary: Often follow the header or is a block of text
    const summary = this.inferSummary(text);

    return {
      firstName,
      lastName,
      email: emailMatch?.[0],
      phone: phoneMatch?.[0],
      location: this.inferLocation(text),
      summary
    };
  }

  private inferSummary(text: string): string | undefined {
    const lines = text.split('\n');
    const summaryIndex = lines.findIndex(l => /summary|objective|profile/i.test(l) && l.length < 20);
    if (summaryIndex !== -1 && lines[summaryIndex + 1]) {
      return lines[summaryIndex + 1].trim();
    }
    return undefined;
  }

  private inferLocation(text: string): string | undefined {
    // Look for City, State or City, Country
    const locationRegex = /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/;
    const match = text.match(locationRegex);
    return match ? match[0] : undefined;
  }

  /**
   * LINKS: Merging annotations and text-based extraction
   */
  private mergeAnnotations(info: PersonalInfo, annotations: Array<{ url: string }>) {
    annotations.forEach(ann => {
      const url = ann.url.toLowerCase();
      if (url.includes('linkedin.com/in/') && !info.linkedinUrl) info.linkedinUrl = this.normalizeUrl(ann.url);
      else if (url.includes('github.com/') && !info.githubUrl) info.githubUrl = this.normalizeUrl(ann.url);
      else if (url.includes('gitlab.com/') && !info.gitlabUrl) info.gitlabUrl = this.normalizeUrl(ann.url);
      else if (url.includes('stackoverflow.com/users/') && !info.stackoverflowUrl) info.stackoverflowUrl = this.normalizeUrl(ann.url);
      else if (!info.portfolioUrl && !url.includes('linkedin') && !url.includes('github') && !url.includes('gitlab')) {
        info.portfolioUrl = this.normalizeUrl(ann.url);
      }
    });
  }

  private extractLinksFromText(info: PersonalInfo, text: string) {
    const linkedinRegex = /(?:linkedin\.com\/in\/)([a-zA-Z0-9-]+)/i;
    const githubRegex = /(?:github\.com\/)([a-zA-Z0-9-]+)/i;
    const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|io|me|dev|net)(?:\/[^\s]*)?)/i;

    if (!info.linkedinUrl) {
      const match = text.match(linkedinRegex);
      if (match) info.linkedinUrl = `https://www.linkedin.com/in/${match[1]}`;
    }
    if (!info.githubUrl) {
      const match = text.match(githubRegex);
      if (match) info.githubUrl = `https://github.com/${match[1]}`;
    }
    if (!info.portfolioUrl) {
      const matches = text.matchAll(new RegExp(portfolioRegex, 'gi'));
      for (const match of matches) {
        const url = match[0].toLowerCase();
        if (!url.includes('linkedin') && !url.includes('github') && !url.includes('google') && !url.includes('mail')) {
          info.portfolioUrl = this.normalizeUrl(match[0]);
          break;
        }
      }
    }
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  }

  /**
   * EXPERIENCE: Robust role/company detection
   */
  private extractExperience(text: string): Experience[] {
    if (!text.trim()) return [];

    const experiences: Experience[] = [];
    const dateRangeRegex = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(\d{4})\s*[-–—]\s*(?:Present|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?\d{4})/i;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let currentExp: any = null;

    lines.forEach((line) => {
      const dateMatch = line.match(dateRangeRegex);

      // If line has date range, it's likely a new experience or the start of one
      if (dateMatch) {
        if (currentExp) experiences.push(currentExp);

        const rawTitle = line.replace(dateRangeRegex, '').replace(/^[•\-\*]\s?/, '').trim();
        const commaIndex = rawTitle.indexOf(',');
        
        let jobTitle = rawTitle;
        let company = '';
        
        if (commaIndex !== -1) {
          jobTitle = rawTitle.slice(0, commaIndex).trim();
          company = rawTitle.slice(commaIndex + 1).trim();
        }

        currentExp = {
          id: `exp-${experiences.length}`,
          jobTitle: jobTitle || 'Software Engineer',
          company: company,
          startDate: dateMatch[0].split(/[-–—]/)[0]?.trim(),
          endDate: dateMatch[0].split(/[-–—]/)[1]?.trim(),
          isCurrent: dateMatch[0].toLowerCase().includes('present'),
          description: '',
          achievements: []
        };
      } else if (currentExp) {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          currentExp.achievements.push(line.replace(/^[•\-\*]\s?/, '').trim());
        } else if (!currentExp.company || currentExp.company === 'Unknown Company') {
          // Only assign company if it doesn't look like a tech skills line
          const isTechSkillsLine = /\b(javascript|typescript|python|java|react|node|docker|aws|html|css|sql|mongodb|express|angular|vue|git|linux|script|shell|bash|kubernetes|azure|gcp|firebase|graphql|rest|api)\b/i.test(line);
          const hasManyComas = (line.match(/,/g) || []).length >= 2;
          if (!isTechSkillsLine && !hasManyComas) {
            currentExp.company = line;
          }
        } else {
          currentExp.description += (currentExp.description ? '\n' : '') + line;
        }
      }
    });

    if (currentExp) experiences.push(currentExp);
    return experiences;
  }

  /**
   * PROJECTS: Structured extraction with smart link mapping
   */
  private extractProjects(text: string, annotations: any[] = []): Project[] {
    if (!text.trim()) return [];

    const {
      extractUrlsFromText,
      extractUrlsFromAnnotations,
      mapLinksToProjects,
      extractInlineLinks,
      normalizeUrl,
      classifyUrl
    } = require('./link-extractor');

    const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

    // Collect ALL links: from annotations (highest fidelity) + text regex fallback
    const annotationLinks = extractUrlsFromAnnotations(annotations);
    const textLinks = extractUrlsFromText(text);

    // Merge, de-duplicate by URL
    const allLinks = [...annotationLinks];
    for (const tl of textLinks) {
      if (!allLinks.find((al: any) => al.url === tl.url)) allLinks.push(tl);
    }

    // Run proximity mapper
    const linkMap = mapLinksToProjects(lines, allLinks);
    const linkMapByName = new Map(linkMap.map((lm: any) => [lm.name.toLowerCase().slice(0, 30), lm]));

    const projects: Project[] = [];
    let currentProject: Project | null = null;

    lines.forEach((line: string) => {
      const isUrl = /https?:\/\//i.test(line) || /^github\.com/i.test(line) || /^www\./i.test(line);
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      const isProjectTitle = !isUrl && !isBullet && line.length < 80;

      if (isUrl && currentProject) {
        // Inline URL line — classify and attach
        const url = normalizeUrl(line);
        const type = classifyUrl(url);
        if (type === 'github' && !currentProject.githubUrl) currentProject.githubUrl = url;
        else if (type === 'live' && !currentProject.liveUrl) currentProject.liveUrl = url;
        return;
      }

      if (isProjectTitle) {
        if (currentProject) projects.push(currentProject);

        // Extract inline links from the title line (e.g. "Name – github.com/xx | live.app")
        const inlineLinks = extractInlineLinks(line);
        const cleanName = line
          .replace(/https?:\/\/[^\s]+/gi, '')
          .replace(/github\.com\/[^\s]+/gi, '')
          .replace(/[|–—\u2013\u2014]+/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        // Look up in proximity map
        const mapKey = cleanName.toLowerCase().slice(0, 30);
        const mapped = linkMapByName.get(mapKey) as { githubUrl?: string; liveUrl?: string } | undefined;

        currentProject = {
          id: `proj-${projects.length}`,
          name: cleanName || line,
          description: '',
          technologies: [],
          githubUrl: inlineLinks.githubUrl || mapped?.githubUrl,
          liveUrl: inlineLinks.liveUrl || mapped?.liveUrl,
        };
      } else if (currentProject) {
        if (isBullet) {
          currentProject.description += (currentProject.description ? ' ' : '') + line.replace(/^[•\-\*]\s?/, '').trim();
        } else if (!isUrl) {
          currentProject.description += (currentProject.description ? ' ' : '') + line;
        }
      }
    });

    if (currentProject) projects.push(currentProject);

    // Post-process: remove projects with no meaningful name
    return projects.filter(p => p.name && p.name.length > 1);
  }

  /**
   * EDUCATION: Degree detection
   */
  private extractEducation(text: string): Education[] {
    if (!text.trim()) return [];

    const education: Education[] = [];
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const degreeRegex = /(Bachelor|Master|PhD|B\.S|M\.S|B\.A|M\.A|Associate|Diploma|Degree)/i;

    lines.forEach((line, idx) => {
      if (degreeRegex.test(line)) {
        education.push({
          id: `edu-${education.length}`,
          degree: line.trim(),
          institution: lines[idx - 1] || lines[idx + 1] || 'University',
          graduationDate: line.match(/\d{4}/)?.[0]
        });
      }
    });

    return education;
  }

  /**
   * SKILLS: List parsing + keyword inference
   */
  private extractSkills(text: string): Skill[] {
    // If skills section is empty, scan entire text for keywords
    const textToScan = text.length > 50 ? text : this.fullText;

    const frontendKeywords = ['react', 'next.js', 'vue', 'angular', 'svelte', 'tailwind', 'css', 'html', 'javascript', 'typescript', 'flutter', 'dart', 'redux', 'framer motion'];
    const backendKeywords = ['node', 'express', 'python', 'django', 'flask', 'java', 'spring', 'go', 'rust', 'ruby', 'rails', 'php', 'laravel', 'sql', 'postgres', 'mongodb', 'redis', 'graphql', 'nest.js'];
    const devopsKeywords = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'github actions', 'ci/cd', 'terraform', 'ansible', 'linux', 'nginx'];

    const foundSkills: Skill[] = [];
    const allKeywords = [...frontendKeywords, ...backendKeywords, ...devopsKeywords];

    allKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace('.', '\\.')}\\b`, 'gi');
      if (regex.test(textToScan)) {
        let category: Skill['category'] = 'other';
        if (frontendKeywords.includes(keyword)) category = 'frontend';
        else if (backendKeywords.includes(keyword)) category = 'backend';
        else if (devopsKeywords.includes(keyword)) category = 'devops';

        foundSkills.push({
          id: `skill-${foundSkills.length}`,
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1).replace('.js', '.js'),
          category,
          proficiency: 'advanced'
        });
      }
    });

    return foundSkills;
  }

  private extractList(text: string): string[] {
    return text.split('\n').map(l => l.replace(/^[•\-\*]\s?/, '').trim()).filter(l => l.length > 0);
  }
}
