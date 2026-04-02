/**
 * Loader Component (Premium)
 * High-fidelity scanning animation for resume intelligence processing.
 */

import React from 'react';

interface LoaderProps {
  message?: string;
  stage?: 'upload' | 'parsing' | 'analyzing';
}

export function Loader({ message = 'Orchestrating intelligence...', stage = 'parsing' }: LoaderProps) {
  const stageLabels: Record<string, string> = {
    upload: 'SECURE UPLOAD',
    parsing: 'NEURAL EXTRACTION',
    analyzing: 'STRATEGIC ANALYSIS',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-20 animate-fade-in">
      {/* Sophisticated Scanning Animation */}
      <div className="relative h-32 w-32">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-3xl border border-indigo-500/30 animate-ping opacity-20" />
        
        {/* Main Hex/Square Container */}
        <div className="absolute inset-0 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)]">
           <svg className="h-12 w-12 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           
           {/* Scanning Line Effect */}
           <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan" />
        </div>

        {/* Orbitals */}
        <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-sky-500 border-4 border-slate-950 animate-bounce" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-emerald-500 border-4 border-slate-950 animate-bounce [animation-delay:0.2s]" />
      </div>

      {/* Progress Intelligence */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
            {stageLabels[stage] || stageLabels.parsing}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">{message}</h3>
        
        <div className="flex justify-center items-center gap-1.5">
          {[0, 1, 2].map((i) => (
             <div 
               key={i} 
               className="h-1.5 w-1.5 rounded-full bg-indigo-500/50 animate-pulse" 
               style={{ animationDelay: `${i * 0.2}s` }} 
             />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loader;
