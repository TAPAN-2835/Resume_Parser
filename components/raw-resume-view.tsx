'use client';

import React, { useState } from 'react';
import { FileText, Eye, EyeOff, Terminal, Copy, Check, ShieldCheck, ShieldAlert } from 'lucide-react';

interface RawResumeViewProps {
  rawText: string;
}

export default function RawResumeView({ rawText }: RawResumeViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const redactText = (text: string) => {
    if (!isPrivacyMode) return text;
    // Basic redaction for email and phone
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
      .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE REDACTED]');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(redactText(rawText));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!rawText) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} className="text-indigo-400" />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Source Intelligence Stream</h3>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              isPrivacyMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-400'
            }`}
          >
            {isPrivacyMode ? <><ShieldCheck size={12} /> Privacy Mode On</> : <><ShieldAlert size={12} /> Privacy Mode Off</>}
          </button>
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {isVisible ? <><EyeOff size={12} /> Hide Source</> : <><Eye size={12} /> View Source</>}
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="relative group">
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all shadow-2xl"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="glass-panel rounded-[2rem] border-white/5 bg-[#0b1120]/80 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-emerald-500/20" />
            <pre className="text-slate-400 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] custom-scrollbar selection:bg-indigo-500/30 selection:text-white">
              {redactText(rawText)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
