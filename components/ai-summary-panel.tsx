import React from 'react';
import type { ResumeData } from '@/types/resume';
import { Target, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface AiSummaryPanelProps {
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
}

export default function AiSummaryPanel({ summary, strengths, weaknesses, suggestions }: AiSummaryPanelProps) {
  if (!summary && (!strengths || strengths.length === 0)) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Executive Summary */}
      <div className="lg:col-span-3 glass-panel p-8 rounded-3xl border-slate-800/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Target size={120} className="text-indigo-400" />
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Target size={16} /> Executive AI Summary
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed font-medium max-w-4xl">
            {summary || "An experienced professional with a strong technical background."}
          </p>
        </div>
      </div>

      {/* Strengths */}
      <div className="glass-panel p-6 rounded-3xl border-emerald-500/10 hover:border-emerald-500/30 transition-all">
        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp size={16} /> Key Strengths
        </h3>
        <ul className="space-y-3">
          {strengths?.map((strength, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
              <span className="text-emerald-400 font-black shrink-0 mt-0.5">•</span> 
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="glass-panel p-6 rounded-3xl border-rose-500/10 hover:border-rose-500/30 transition-all">
        <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle size={16} /> Areas For Improvement
        </h3>
        <ul className="space-y-3">
          {weaknesses?.map((weakness, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
              <span className="text-rose-400 font-black shrink-0 mt-0.5">•</span> 
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="glass-panel p-6 rounded-3xl border-sky-500/10 hover:border-sky-500/30 transition-all">
        <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Lightbulb size={16} /> Actionable Suggestions
        </h3>
        <ul className="space-y-3">
          {suggestions?.map((suggestion, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
              <span className="text-sky-400 font-black shrink-0 mt-0.5">•</span> 
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
