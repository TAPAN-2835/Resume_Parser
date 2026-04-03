import React from 'react';
import { Loader2, ShieldCheck, Cpu } from 'lucide-react';

interface LoaderProps {
  stage: 'upload' | 'parsing';
  message: string;
}

export default function Loader({ stage, message }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl animate-fade-in border-indigo-500/10">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
        <div className="h-20 w-20 rounded-full border border-indigo-500/20 bg-[#0b1120] flex items-center justify-center relative z-10">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50">
             {stage === 'upload' ? <ShieldCheck size={16} /> : <Cpu size={16} />}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Processing Phase</h3>
      <p className="text-slate-400 font-medium tracking-wide">{message}</p>
    </div>
  );
}
