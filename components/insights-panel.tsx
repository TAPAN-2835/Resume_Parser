'use client';

import React, { useMemo } from 'react';
import { Target, Zap, AlertCircle, TrendingUp, Award, Search, BarChart3, ChevronRight } from 'lucide-react';
import type { Insight, Skill, ScoreBreakdown } from '@/types/resume';

interface InsightsPanelProps {
  insights: Insight[];
  score: ScoreBreakdown;
  skills: Skill[];
}

export default function InsightsPanel({ insights = [], score, skills = [] }: InsightsPanelProps) {
  const breakdownEntries = Object.entries(score?.sections || {});

  return (
    <div className="space-y-12 animate-fade-in group/panel">
      <div className="flex items-center gap-4">
         <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
         <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] px-4 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10">Strategic Intelligence</h2>
         <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Score Breakdown Column (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[2rem] bg-[#0b1120] border border-slate-800 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <BarChart3 size={120} strokeWidth={1} />
            </div>
            
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Target size={16} className="text-indigo-400" />
              Score Breakdown
            </h3>
            
            <div className="flex-1 space-y-8">
              {breakdownEntries.map(([section, value], idx) => (
                <div key={section} className="space-y-2 group/score">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/score:text-white transition-colors">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs font-black text-indigo-400">
                      {value}/{(section === 'experience' ? 30 : section === 'personalInfo' ? 20 : section === 'skills' ? 20 : 15)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        section === 'experience' ? 'bg-indigo-500' :
                        section === 'skills' ? 'bg-sky-500' :
                        section === 'projects' ? 'bg-emerald-500' :
                        'bg-slate-500'
                      }`}
                      style={{ width: `${(value / (section === 'experience' ? 30 : section === 'personalInfo' ? 20 : section === 'skills' ? 20 : 15)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Zap size={12} fill="currentColor" />
                 Optimization Logic
               </p>
               <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                 "Our engine detected strong {score.details?.[0]?.toLowerCase() || 'profile completeness'}, contributing to your professional ranking."
               </p>
            </div>
          </div>
        </div>

        {/* Insights Column (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
               <TrendingUp size={16} className="text-sky-400" />
               Critical Insights
             </h3>
             <div className="flex gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500" />
               <div className="h-2 w-2 rounded-full bg-indigo-500" />
               <div className="h-2 w-2 rounded-full bg-rose-500" />
             </div>
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <div key={insight.id} className="glass-panel hover:prismatic-border p-6 rounded-3xl transition-all group relative overflow-hidden shadow-xl hover:-translate-y-0.5">
                  {/* Subtle Indicator */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      insight.type === 'warning' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 
                      insight.type === 'achievement' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                      'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                  }`} />
                  
                  <div className="flex gap-6">
                    <div className={`p-4 rounded-2xl shrink-0 h-fit ${
                      insight.type === 'warning' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20' : 
                      insight.type === 'achievement' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 
                      'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20'
                    }`}>
                      {insight.type === 'warning' ? <AlertCircle size={24} /> : 
                       insight.type === 'achievement' ? <Award size={24} /> : <Zap size={24} />}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-[15px] font-black text-white uppercase tracking-tight">{insight.title}</h4>
                        <div className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                          insight.type === 'warning' ? 'bg-rose-500/5 text-rose-400 border-rose-500/10' :
                          insight.type === 'achievement' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' :
                          'bg-sky-500/5 text-sky-400 border-sky-500/10'
                        }`}>
                          {insight.type}
                        </div>
                      </div>
                      <p className="text-slate-400 text-[14px] leading-relaxed font-semibold pr-4">
                        {insight.description}
                      </p>
                      {insight.actionable && (
                        <div className="pt-2 flex items-center gap-2 text-white text-[11px] font-black uppercase tracking-widest cursor-pointer hover:text-indigo-400 transition-colors">
                          Improve Profile <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center glass-panel rounded-[3rem] border-dashed border-white/10 opacity-50">
                <Search size={40} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Awaiting Analysis Sequence</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
