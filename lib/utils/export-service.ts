/**
 * Export Service
 * Handles data serialization and browser-side file downloads.
 */

import type { ParseResult } from '@/types/resume';

export function exportToJson(result: ParseResult) {
  if (!result.data) return;

  const exportData = {
    generatedAt: new Date().toISOString(),
    score: result.score,
    archetype: result.insights?.find(i => i.title.includes('Archetype'))?.title.split(': ')[1],
    ...result.data,
    insights: result.insights,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-analysis-${result.data.personalInfo.firstName || 'user'}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
