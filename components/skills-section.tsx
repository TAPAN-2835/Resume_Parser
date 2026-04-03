'use client';

import React, { useMemo } from 'react';
import { Target, Zap, Cpu, Code2, Layers, Briefcase, Globe } from 'lucide-react';
import type { Skill } from '@/types/resume';

interface SkillsSectionProps {
  skills?: Skill[];
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  technical: { label: 'Technical Core', icon: <Cpu size={14} />, color: 'indigo' },
  frontend: { label: 'Frontend Architecture', icon: <Code2 size={14} />, color: 'sky' },
  backend: { label: 'Backend & Systems', icon: <Layers size={14} />, color: 'emerald' },
  devops: { label: 'Cloud & DevOps', icon: <Zap size={14} />, color: 'rose' },
  soft: { label: 'Strategic Leadership', icon: <Briefcase size={14} />, color: 'amber' },
  language: { label: 'Languages', icon: <Globe size={14} />, color: 'teal' },
  other: { label: 'Specialized Expertise', icon: <Target size={14} />, color: 'slate' },
};

export function SkillsSection({ skills = [] }: SkillsSectionProps) {
  const groupedSkills = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};

    skills.forEach((skill) => {
      const cat = skill.category?.toLowerCase() || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    });

    return grouped;
  }, [skills]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Layers size={14} className="text-indigo-500" />
          Skills & Expertise
        </h3>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="space-y-10">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => {
          const config = categoryConfig[category] || categoryConfig.other;
          if (categorySkills.length === 0) return null;

          return (
            <div key={category} className="animate-fade-in group/cat">
              <div className="flex items-center gap-3 mb-4">
                 <div className={`p-1.5 rounded-lg bg-${config.color}-500/10 text-${config.color}-400 ring-1 ring-${config.color}-500/20`}>
                   {config.icon}
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/cat:text-white transition-colors">
                  {config.label}
                </h4>
              </div>

              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 px-5 py-3 transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/10 hover:-translate-y-1 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                         {skill.name}
                       </span>
                       {skill.confidence === 'inferred' && (
                         <span className="px-1.5 py-0.5 rounded border border-indigo-400/30 bg-indigo-500/10 text-[8px] font-black uppercase tracking-widest text-indigo-400" title="This skill was inferred by AI from context">
                           AI Inferred
                         </span>
                       )}
                    </div>
                    
                    {skill.proficiency && (
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => {
                          const isActive = 
                            (skill.proficiency === 'expert' && level <= 3) ||
                            (skill.proficiency === 'advanced' && level <= 2) ||
                            (skill.proficiency === 'intermediate' && level <= 1);
                          
                          return (
                            <div 
                              key={level} 
                              className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                                isActive 
                                  ? `bg-${config.color}-400 shadow-[0_0_10px_rgba(var(--${config.color}-400),0.8)]` 
                                  : 'bg-slate-800'
                              }`} 
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsSection;
