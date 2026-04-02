/**
 * Profile Classifier
 * Analyzes resume data to determine professional specialization
 */

import { Skill } from '@/types/resume';

export type CareerProfile = 
  | 'Frontend Engineer' 
  | 'Backend Engineer' 
  | 'Full Stack Engineer' 
  | 'Mobile Developer' 
  | 'Data Scientist' 
  | 'DevOps Engineer'
  | 'Generalist';

const PROFILE_KEYWORDS: Record<CareerProfile, string[]> = {
  'Frontend Engineer': ['react', 'vue', 'angular', 'tailwind', 'css', 'html', 'sass', 'next.js', 'vite', 'webpack', 'frontend', 'ui/ux', 'typescript', 'javascript', 'ember', 'svelte'],
  'Backend Engineer': ['node', 'express', 'python', 'django', 'fastapi', 'go', 'java', 'spring', 'postgresql', 'mongodb', 'redis', 'backend', 'api', 'graphql', 'rest', 'microservices', 'sql', 'nosql', 'php', 'laravel', 'ruby', 'rails'],
  'Full Stack Engineer': ['fullstack', 'full stack', 'mern', 't3 stack', 'lamp'],
  'Mobile Developer': ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'mobile', 'objective-c', 'xamarin', 'expo', 'ionic'],
  'Data Scientist': ['python', 'pandas', 'numpy', 'scipy', 'tensorflow', 'pytorch', 'machine learning', 'data science', 'ai', 'r', 'scikit-learn', 'keras', 'spark', 'hadoop', 'big data', 'nlp', 'computer vision'],
  'DevOps Engineer': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'terraform', 'ansible', 'jenkins', 'devops', 'sre', 'prometheus', 'grafana', 'linux', 'bash', 'yaml', 'cloudformation'],
  'Generalist': []
};

export function classifyProfile(skills: Skill[], experienceText: string): CareerProfile {
  const textBlob = (skills.map(s => s.name).join(' ') + ' ' + experienceText).toLowerCase();
  
  const scores: Record<string, number> = {};
  
  Object.entries(PROFILE_KEYWORDS).forEach(([profile, keywords]) => {
    let score = 0;
    keywords.forEach(word => {
      if (textBlob.includes(word.toLowerCase())) {
        score++;
      }
    });
    scores[profile] = score;
  });

  // Special logic for Full Stack (high scores in both frontend and backend)
  const feScore = scores['Frontend Engineer'];
  const beScore = scores['Backend Engineer'];
  
  if (feScore > 3 && beScore > 3) {
    return 'Full Stack Engineer';
  }

  // Find profile with max score
  let maxScore = 0;
  let detectedProfile: CareerProfile = 'Generalist';

  Object.entries(scores).forEach(([profile, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedProfile = profile as CareerProfile;
    }
  });

  return maxScore > 2 ? detectedProfile : 'Generalist';
}
