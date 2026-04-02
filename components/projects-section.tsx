'use client';

import React from 'react';
import { ExternalLink, Code2, Layers, Cpu } from 'lucide-react';
import type { Project } from '@/types/resume';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Cpu size={14} className="text-emerald-500" />
          Technical Projects
        </h3>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, idx) => (
          <div key={project.id || idx} className="glass-panel p-6 rounded-[2rem] border-white/5 hover:border-emerald-500/20 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Code2 size={64} />
             </div>

             <div className="flex flex-col h-full gap-4 relative z-10">
               <div className="flex justify-between items-start">
                 <h4 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                   {project.name}
                 </h4>
                 {project.link && (
                   <a 
                     href={project.link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                   >
                     <ExternalLink size={14} />
                   </a>
                 )}
               </div>

               <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                 {project.description}
               </p>

               <div className="flex flex-wrap gap-2 mt-auto">
                 {project.technologies?.map((tech) => (
                   <span 
                     key={tech} 
                     className="px-2.5 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest"
                   >
                     {tech}
                   </span>
                 ))}
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
