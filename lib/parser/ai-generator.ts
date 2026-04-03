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
    const text = result.response.text();
    
    // Clean the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const insights = (parsed.insights || []).map((ins: any, idx: number) => ({
        ...ins,
        id: `ai-insight-${idx}-${Date.now()}`
      }));
      
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

export async function enhanceResumeData(structuredData: ResumeData, rawText: string): Promise<ResumeData> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return structuredData;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert AI resume parsing engine. I have already performed structured parsing on a resume.
      However, structured parsing sometimes misses fields, or we need to generate high-level semantic insights (summary, strengths, weaknesses) based on the raw text.

      --- RAW RESUME TEXT ---
      ${rawText}

      --- CURRENT STRUCTURED DATA ---
      ${JSON.stringify({
        skills: structuredData.skills || [],
        experience: structuredData.experience || [],
        education: structuredData.education || [],
        projects: structuredData.projects || []
      })}

      YOUR TASK:
      1. Provide a professional 'summary' of the candidate (2-3 sentences).
      2. List 3 key 'strengths' and 2 'weaknesses'.
      3. List 2 actionable 'suggestions' to improve the resume.
      4. Compare the RAW RESUME TEXT to the CURRENT STRUCTURED DATA. Did the structured data miss any obvious SKILLS or past EXPERIENCE?
      If yes, return them in 'inferredSkills' (string array) or 'inferredExperience' (array of objects with 'title' and 'company'). If nothing major was missed, leave them empty.

      RETURN STRICTLY ONLY JSON IN THIS FORMAT:
      {
        "summary": "Professional summary...",
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "suggestions": ["Suggestion 1", "Suggestion 2"],
        "inferredSkills": ["Skill 1", "Skill 2"],
        "inferredExperience": [{ "title": "Job Title", "company": "Company Name" }]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const aiData = JSON.parse(jsonMatch[0]);
      
      structuredData.aiSummary = aiData.summary;
      structuredData.aiStrengths = aiData.strengths || [];
      structuredData.aiWeaknesses = aiData.weaknesses || [];
      structuredData.aiSuggestions = aiData.suggestions || [];

      if (aiData.inferredSkills && Array.isArray(aiData.inferredSkills)) {
        for (const skillName of aiData.inferredSkills) {
          if (!structuredData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
            structuredData.skills.push({
              id: `skill-inferred-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              name: skillName,
              category: 'other',
              confidence: 'inferred'
            });
          }
        }
      }

      if (aiData.inferredExperience && Array.isArray(aiData.inferredExperience)) {
        for (const exp of aiData.inferredExperience) {
          if (exp.title && exp.company && !structuredData.experience.some(e => e.jobTitle.toLowerCase() === exp.title.toLowerCase() && e.company.toLowerCase() === exp.company.toLowerCase())) {
            structuredData.experience.push({
              id: `exp-inferred-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              jobTitle: exp.title,
              company: exp.company,
              confidence: 'inferred'
            });
          }
        }
      }

      structuredData.skills.forEach(skill => {
        if (!skill.confidence) skill.confidence = 'high';
      });
      structuredData.experience.forEach(exp => {
        if (!exp.confidence) exp.confidence = 'high';
      });
      structuredData.education.forEach(edu => {
        if (!edu.confidence) edu.confidence = 'high';
      });
      structuredData.projects.forEach(proj => {
        if (!proj.confidence) proj.confidence = 'high';
      });
    }

    return structuredData;
  } catch (error) {
    console.error('Enhancer Error:', error);
    return structuredData;
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

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Gemini extraction failed:', error);
    return null;
  }
}
