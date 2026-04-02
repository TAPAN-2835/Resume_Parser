import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData, Insight } from '@/types/resume';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function generateAiInsights(data: Partial<ResumeData>, fallbackInsights: Insight[]): Promise<Insight[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    console.warn('GOOGLE_GENERATIVE_AI_API_KEY is missing. Falling back to heuristic insights.');
    return fallbackInsights;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert technical recruiter and career coach. 
      Analyze the following resume data and provide 3-5 high-impact, professional insights.
      
      CRITICAL NEW REQUIREMENTS:
      1. Include a "Digital Identity Score" (0-100) based on social presence.
      2. Provide a "Recruiter's Perspective" elevator pitch (max 2 sentences).
      
      Format your response as a JSON object:
      {
        "insights": [
          {
            "id": "string",
            "type": "achievement" | "warning" | "suggestion",
            "priority": "high" | "medium" | "low",
            "title": "string",
            "description": "string",
            "actionable": boolean,
            "relatedSection": "string"
          }
        ],
        "digitalIdentityScore": number,
        "recruiterPerspective": "string"
      }

      RESUME DATA:
      ${JSON.stringify(data, null, 2)}
      
      GUIDELINES:
      - Be creative and specific.
      - Return ONLY the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const insights = (parsed.insights || []).map((ins: any, idx: number) => ({
        ...ins,
        id: `ai-insight-${idx}-${Date.now()}`
      }));
      
      // Store extra data in metadata or as a special insight
      if (parsed.recruiterPerspective || parsed.digitalIdentityScore !== undefined) {
        insights.unshift({
          id: `ai-recruiter-pitch-${Date.now()}`,
          type: 'achievement',
          priority: 'high',
          title: "Recruiter's Quick-Take",
          description: parsed.recruiterPerspective || "Strong candidate with balanced technical skills.",
          actionable: false,
          relatedSection: 'profile'
        });
      }

      return insights;
    }

    return fallbackInsights;
  } catch (error) {
    console.error('AI Insights Generation Error:', error);
    return fallbackInsights;
  }
}

export async function extractStructuredDataWithAi(pdfBuffer: Buffer): Promise<Partial<ResumeData> | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a high-fidelity resume extraction engine. 
      Analyze the attached PDF and extract all information into a structured JSON format.
      Pay close attention to multi-column layouts and ensure items are grouped correctly.
      
      RETURN ONLY JSON in this format:
      {
        "personalInfo": { "firstName": "", "lastName": "", "email": "", "phone": "", "location": "", "summary": "", "linkedinUrl": "", "githubUrl": "", "portfolioUrl": "" },
        "experience": [{ "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "", "isCurrent": false, "description": "", "achievements": [] }],
        "education": [{ "degree": "", "institution": "", "field": "", "graduationDate": "", "gpa": "" }],
        "skills": [{ "name": "", "category": "frontend" | "backend" | "devops" | "other", "proficiency": "expert" | "advanced" | "intermediate" }],
        "projects": [{ "name": "", "description": "", "link": "", "technologies": [] }]
      }
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Gemini extraction failed:', error);
    return null;
  }
}
