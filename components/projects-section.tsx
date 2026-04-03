'use client';

import React from 'react';
import { Github, ExternalLink, Code2, Cpu, Globe } from 'lucide-react';
import type { Project } from '@/types/resume';

interface ProjectsSectionProps {
  projects: Project[];
}

function formatDisplayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
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
              {/* Header: Name + Links */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <h4 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight break-words leading-snug">
                  {project.name}
                </h4>

                {/* Link badges */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black text-slate-300 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest group/link"
                    >
                      <Github size={12} className="text-emerald-400 group-hover/link:scale-110 transition-transform" />
                      <span className="hidden sm:inline max-w-[140px] truncate">{formatDisplayUrl(project.githubUrl)}</span>
                      <span className="sm:hidden">GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all uppercase tracking-widest group/link"
                    >
                      <Globe size={12} className="text-sky-400 group-hover/link:scale-110 transition-transform" />
                      <span className="hidden sm:inline max-w-[140px] truncate">{formatDisplayUrl(project.liveUrl)}</span>
                      <span className="sm:hidden">Live</span>
                    </a>
                  )}
                  {/* Fallback: old single link */}
                  {!project.githubUrl && !project.liveUrl && project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black text-slate-300 hover:text-white transition-all uppercase tracking-widest"
                    >
                      <ExternalLink size={12} className="text-indigo-400" />
                      <span className="max-w-[140px] truncate">{formatDisplayUrl(project.link)}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  {project.description}
                </p>
              )}

              {/* Tech tags */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
