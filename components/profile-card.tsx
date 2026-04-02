'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Briefcase, ExternalLink, ShieldCheck } from 'lucide-react';
import type { PersonalInfo, ScoreBreakdown } from '@/types/resume';

interface ProfileCardProps {
  personalInfo: PersonalInfo;
  score: ScoreBreakdown;
}

export default function ProfileCard({ personalInfo, score }: ProfileCardProps) {
  const initials = `${personalInfo.firstName?.charAt(0) || ''}${personalInfo.lastName?.charAt(0) || ''}`;
  const resumeScore = score.total;

  return (
    <div className="prismatic-border p-8 lg:p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl transition-all hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-[400px] w-[400px] bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000 animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-[300px] w-[300px] bg-sky-600/5 blur-[80px] rounded-full" />
      
      <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center relative z-10">
        {/* Avatar / Score Circle */}
        <div className="relative shrink-0">
          <div className="h-40 w-40 rounded-[3rem] bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-400 p-[2px] shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500">
            <div className="h-full w-full rounded-[2.9rem] bg-[#020617] flex items-center justify-center text-5xl font-black text-white">
              {initials || <Briefcase size={48} />}
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-2xl bg-[#0b1120] border border-white/10 p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
            <div className={`h-full w-full rounded-xl flex flex-col items-center justify-center font-black ${
              resumeScore >= 80 ? 'text-emerald-400 bg-emerald-500/10' : 
              resumeScore >= 60 ? 'text-sky-400 bg-sky-500/10' : 'text-rose-400 bg-rose-500/10'
            }`}>
              <span className="text-[10px] uppercase tracking-tighter opacity-70">Score</span>
              <span className="text-xl leading-none">{resumeScore}</span>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">
                {personalInfo.firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">{personalInfo.lastName}</span>
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] shadow-[0_0_15px_-5px_rgba(99,102,241,0.5)]">
                <ShieldCheck size={12} />
                Verified Expert
              </div>
            </div>
            {personalInfo.summary && (
              <p className="text-slate-400 font-medium leading-relaxed max-w-2xl text-lg italic">
                "{personalInfo.summary}"
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {personalInfo.email && <ContactBadge icon={<Mail size={14} />} text={personalInfo.email} color="indigo" />}
            {personalInfo.phone && <ContactBadge icon={<Phone size={14} />} text={personalInfo.phone} color="sky" />}
            {personalInfo.location && <ContactBadge icon={<MapPin size={14} />} text={personalInfo.location} color="emerald" />}
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex flex-row lg:flex-col items-center gap-4 lg:ml-auto">
          {personalInfo.githubUrl && <SocialLink href={personalInfo.githubUrl} icon={<Github size={24} />} />}
          {personalInfo.linkedinUrl && <SocialLink href={personalInfo.linkedinUrl} icon={<Linkedin size={24} />} />}
          {personalInfo.portfolioUrl && <SocialLink href={personalInfo.portfolioUrl} icon={<ExternalLink size={24} />} />}
        </div>
      </div>
    </div>
  );
}

function ContactBadge({ icon, text, color }: { icon: React.ReactNode, text: string, color: string }) {
  const colors: any = {
    indigo: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10',
    sky: 'text-sky-400 bg-sky-500/5 border-sky-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-xl hover:scale-105 transition-all cursor-default ${colors[color]}`}>
      {icon}
      <span className="text-sm font-bold">{text}</span>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="p-4 rounded-3xl bg-white/5 text-slate-400 hover:bg-indigo-600 hover:text-white hover:-translate-y-1 transition-all border border-white/5 shadow-xl hover:shadow-indigo-500/20"
    >
      {icon}
    </a>
  );
}
