/**
 * Link Extractor Utility
 * Handles extraction and classification of URLs from resume text and PDF annotations.
 */

export interface ExtractedLink {
  url: string;
  type: 'github' | 'live';
}

/** Normalize a URL – add https:// if missing */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim().replace(/[)\].,;]+$/, '');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^github\.com/i.test(trimmed)) return `https://${trimmed}`;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return `https://${trimmed}`;
}

/** Classify a URL as GitHub or live */
export function classifyUrl(url: string): 'github' | 'live' {
  const lower = url.toLowerCase();
  if (lower.includes('github.com')) return 'github';
  return 'live';
}

/** Extract all URLs from a raw text string (regex-based fallback) */
export function extractUrlsFromText(text: string): ExtractedLink[] {
  const urlPattern = /https?:\/\/[^\s<>"')\]]+|(?:www\.|github\.com|vercel\.app|netlify\.app)[^\s<>"')\]]*/gi;
  const matches = text.match(urlPattern) || [];
  return matches
    .map(raw => normalizeUrl(raw))
    .filter(url => url.length > 10)
    .map(url => ({ url, type: classifyUrl(url) }));
}

/** Extract all URLs from PDF annotation objects */
export function extractUrlsFromAnnotations(annotations: any[]): ExtractedLink[] {
  if (!Array.isArray(annotations)) return [];
  const results: ExtractedLink[] = [];

  for (const ann of annotations) {
    const raw = ann?.url || ann?.href || ann?.URI || ann?.uri || '';
    if (raw && raw.startsWith('http')) {
      results.push({ url: normalizeUrl(raw), type: classifyUrl(raw) });
    }
  }
  return results;
}

/**
 * Project-to-link proximity mapper.
 * Given lines of a projects section and a list of available links,
 * returns which links belong to which project (by index).
 */
export interface ProjectLinkMap {
  name: string;
  githubUrl?: string;
  liveUrl?: string;
}

export function mapLinksToProjects(
  projectLines: string[],
  allLinks: ExtractedLink[]
): ProjectLinkMap[] {
  // Step 1. Identify project title lines (short, no bullet, not a URL)
  const projectTitles: { idx: number; name: string }[] = [];
  projectLines.forEach((line, idx) => {
    const clean = line.trim();
    if (
      clean.length > 0 &&
      clean.length < 80 &&
      !clean.startsWith('•') &&
      !clean.startsWith('-') &&
      !clean.startsWith('*') &&
      !/https?:\/\//i.test(clean) &&
      !/^[\d.]+$/.test(clean)
    ) {
      // Heuristic: likely a project title
      projectTitles.push({ idx, name: clean.replace(/[|–—\u2013\u2014]+.*$/, '').trim() });
    }
  });

  if (projectTitles.length === 0) return [];

  const result: ProjectLinkMap[] = projectTitles.map(p => ({ name: p.name }));

  // Step 2. For each link in the text, find the closest preceding project title
  const textWithLinks = projectLines.join('\n');

  allLinks.forEach(link => {
    const linkIdx = textWithLinks.indexOf(link.url.replace('https://', '').replace('http://', ''));
    if (linkIdx === -1) {
      // URL not found in raw text (came from annotation) — assign to last project
      const target = result[result.length - 1];
      if (link.type === 'github' && !target.githubUrl) target.githubUrl = link.url;
      else if (link.type === 'live' && !target.liveUrl) target.liveUrl = link.url;
      return;
    }

    // Find the project title with the smallest positive distance before the link
    let bestProject = 0;
    let bestDist = Infinity;
    projectTitles.forEach((p, i) => {
      const titlePos = textWithLinks.indexOf(p.name);
      if (titlePos !== -1 && titlePos <= linkIdx) {
        const dist = linkIdx - titlePos;
        if (dist < bestDist) {
          bestDist = dist;
          bestProject = i;
        }
      }
    });

    const target = result[bestProject];
    if (link.type === 'github' && !target.githubUrl) target.githubUrl = link.url;
    else if (link.type === 'live' && !target.liveUrl) target.liveUrl = link.url;
  });

  return result;
}

/** Extract inline links from a single project line e.g. "ProjectName – Live | GitHub" */
export function extractInlineLinks(line: string): { githubUrl?: string; liveUrl?: string } {
  const urls = extractUrlsFromText(line);
  const result: { githubUrl?: string; liveUrl?: string } = {};
  for (const { url, type } of urls) {
    if (type === 'github' && !result.githubUrl) result.githubUrl = url;
    if (type === 'live' && !result.liveUrl) result.liveUrl = url;
  }
  return result;
}
