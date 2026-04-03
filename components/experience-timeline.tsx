'use client';

import React, { useState, useMemo } from 'react';
import { Briefcase, Calendar, MapPin, ChevronDown, Award, Zap, TrendingUp } from 'lucide-react';
import type { Experience } from '@/types/resume';

interface ExperienceTimelineProps {
  experiences?: Experience[];
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Present';
  try {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
};

export function ExperienceTimeline({ experiences = [] }: ExperienceTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const sortedExperiences = useMemo(
    () =>
      [...experiences].sort((a, b) => {
        const aStart = a.startDate || '';
        const bStart = b.startDate || '';
        return bStart.localeCompare(aStart);
      }),
    [experiences]
  );

  return (
    <div className="space-y-10 group/timeline">
      <div className="flex items-center gap-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Briefcase size={14} className="text-indigo-500" />
          Professional Trajectory
        </h3>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-indigo-500 via-slate-800 before:to-transparent">
        {sortedExperiences.map((exp, idx) => (
          <div key={exp.id || idx} className="relative flex items-start gap-10 group">
            {/* Timeline Node */}
            <div className="absolute left-0 mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#020617] border-2 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] z-10 transition-all duration-500 group-hover:scale-125 group-hover:border-indigo-400 group-hover:shadow-indigo-500/50">
              <span className="text-[10px] font-black">{sortedExperiences.length - idx}</span>
            </div>

            {/* Content Card */}
            <div 
              className={`flex-1 glass-panel rounded-[2rem] p-8 transition-all duration-500 border-white/5 hover:border-white/10 group-hover:shadow-2xl group-hover:shadow-indigo-500/5 cursor-pointer ${
                expandedId === exp.id ? 'bg-indigo-500/5 border-indigo-500/20' : ''
              }`}
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-none tracking-tight">
                        {exp.jobTitle}
                      </h4>
                      {exp.confidence === 'inferred' && (
                        <span className="px-2 py-0.5 rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                          AI Inferred Role
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-sky-400 uppercase tracking-widest">
                      {exp.company && exp.company !== 'Unknown Company' && (
                        <span>{exp.company}</span>
                      )}
                      {exp.location && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-700" />
                          <span className="text-slate-500 flex items-center gap-1 normal-case tracking-normal">
                            <MapPin size={12} />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-white/5 px-4 py-2 text-xs font-black text-slate-300 shadow-xl">
                    <Calendar size={12} className="text-indigo-400" />
                    {formatDate(exp.startDate)} — {exp.isCurrent ? 'Current' : formatDate(exp.endDate)}
                  </div>
                </div>
              </div>

              {/* Expansion Details */}
              <div
                className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  expandedId === exp.id ? 'mt-8 max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-8 pt-8 border-t border-white/5">
                  {exp.description && (
                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
                      <p className="text-slate-300 text-base leading-relaxed font-medium italic pl-2">
                        "{exp.description}"
                      </p>
                    </div>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <TrendingUp size={14} className="text-emerald-400" />
                         <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-400">
                           Key Results & Impact
                         </h5>
                      </div>
                      <div className="grid gap-4">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors group/item">
                            <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500/40 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-transform group-hover/item:scale-125" />
                            <span className="text-sm text-slate-300 leading-relaxed font-semibold">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expand Hint */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-400 transition-colors">
                  {expandedId === exp.id ? 'Compact View' : 'Deep Analysis'}
                  <ChevronDown 
                    size={14}
                    className={`transition-transform duration-500 ${expandedId === exp.id ? 'rotate-180' : ''}`} 
                  />
                </div>
                {exp.isCurrent && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active Role</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperienceTimeline;
