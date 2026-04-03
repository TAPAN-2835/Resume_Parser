/**
 * Resume Parsing API Route
 * Endpoint: POST /api/parse
 */

import { NextResponse } from 'next/server';
import { extractFullData } from '@/lib/parser/pdf-engine';
import { ResumeNormalizer } from '@/lib/parser/resume-normalizer';
import { generateSmartInsights, calculateSmartScore } from '@/lib/parser/insight-generator';
import { generateAiInsights, extractStructuredDataWithAi, enhanceResumeData } from '@/lib/parser/ai-generator';
import { generateFileHash, getCachedScan } from '@/lib/parser/cache-service';
import { classifyProfile } from '@/lib/parser/classifier';
import { ParseResult, ResumeData } from '@/types/resume';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter (Note: resets on serverless cold starts)
const rateLimitMap = new Map<string, { count: number; lastModified: number }>();
const RATE_LIMIT_MAX = 20; // 20 requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  try {
    // 0. Security: Basic Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // Clean up old entries to prevent memory leaks
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.lastModified < windowStart) rateLimitMap.delete(key);
    }
    
    const currentRate = rateLimitMap.get(ip) || { count: 0, lastModified: now };
    if (currentRate.count >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    rateLimitMap.set(ip, { count: currentRate.count + 1, lastModified: now });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Security: Strict Payload Validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5MB limit. Please upload a smaller PDF.' }, { status: 413 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file format. Only PDF files are accepted.' }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Result Caching (Production Strategy)
    const fileHash = generateFileHash(buffer);
    const cachedResult = await getCachedScan(fileHash);
    if (cachedResult) {
      return NextResponse.json({ ...cachedResult, metadata: { ...cachedResult.metadata, hash: fileHash } });
    }

    // 2. High-Fidelity Extraction (Heuristic + AI Native)
    const { text, annotations } = await extractFullData(buffer);
    const aiExtracted = await extractStructuredDataWithAi(buffer);

    // 3. Structured Normalization (Merge Heuristic & AI)
    const normalizer = new ResumeNormalizer(text);
    const heuristicData = normalizer.normalize(annotations) as ResumeData;
    
    // AI data is much more accurate for layout; favor it if available
    const structuredData = {
      ...heuristicData,
      ...(aiExtracted || {}),
      rawText: text // Keep raw text for debugging/viewing
    } as ResumeData;

    // 4. Intelligent Classification
    const profile = classifyProfile(
      structuredData.skills, 
      structuredData.experience?.map(e => e.description).join(' ') || ''
    );

    // 5. Insight Generation & Scoring
    const heuristicInsights = generateSmartInsights(structuredData, profile);
    const score = calculateSmartScore(structuredData);

    // 6. Enhanced AI Insights & Hybrid Merging (Gemini)
    const enhancedData = await enhanceResumeData(structuredData, text);
    const insights = await generateAiInsights(enhancedData, heuristicInsights);

    // 7. Final Response Construction
    const result: ParseResult = {
      success: true,
      data: {
        ...enhancedData,
        id: `res-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      insights,
      score,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        parsingDuration: 0,
        format: file.type,
        hash: fileHash
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Parse Error:', error);
    return NextResponse.json({ 
      error: 'Failed to parse resume. Our engine encountered an issue structuring this specific format.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
