'use client';

import React from 'react';
import ProfileCard from './profile-card';
import InsightsPanel from './insights-panel';
import SkillsSection from './skills-section';
import ExperienceTimeline from './experience-timeline';
import ProjectsSection from './projects-section';
import type { ResumeData, Insight, ScoreBreakdown } from '@/types/resume';

interface AnalysisResultProps {
  data: ResumeData;
  score: ScoreBreakdown;
  insights: Insight[];
}

export default function AnalysisResult({ data, score, insights }: AnalysisResultProps) {
  return (
    <div id="resume-analysis-report" className="space-y-16 animate-slide-in-up pb-24 p-8 bg-[#020617] rounded-[3rem]">
      <ProfileCard personalInfo={data.personalInfo} score={score} />
      
      <InsightsPanel 
        insights={insights} 
        score={score} 
        skills={data.skills} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <SkillsSection skills={data.skills} />
        <ProjectsSection projects={data.projects} />
      </div>

      <ExperienceTimeline experiences={data.experience} />

    </div>
  );
}
