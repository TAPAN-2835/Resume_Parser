import { createHash } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { ParseResult } from '@/types/resume';

/**
 * Generates a SHA-256 hash of a file buffer
 */
export function generateFileHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Checks if a scan result exists in the Supabase cache
 */
export async function getCachedScan(hash: string): Promise<ParseResult | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('scans')
    .select('raw_json, score, archetype')
    .eq('file_hash', hash)
    .maybeSingle();

  if (error || !data) return null;

  // Reconstruct ParseResult from stored data
  return {
    success: true,
    data: data.raw_json,
    score: data.raw_json.scoreBreakdown,
    insights: data.raw_json.insights,
    metadata: {
      fileName: 'Cached Result',
      fileSize: 0,
      parsingDuration: 0,
      format: 'application/pdf',
      isCached: true
    }
  } as ParseResult;
}

/**
 * Updates a scan with its file hash for future caching
 */
export async function updateScanHash(scanId: string, hash: string) {
  const supabase = await createClient();
  await supabase
    .from('scans')
    .update({ file_hash: hash })
    .eq('id', scanId);
}
