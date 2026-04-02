/**
 * Section Container (Premium)
 * Glassmorphism wrapper for resume sections with consistent styling
 */

import React from 'react';

interface SectionContainerProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  rightElement?: React.ReactNode;
}

export function SectionContainer({
  title,
  icon,
  children,
  className = '',
  emptyMessage,
  isEmpty = false,
  rightElement,
}: SectionContainerProps) {
  return (
    <section
      className={`glass-card rounded-2xl p-8 transition-all duration-500 animate-scale-in border-slate-800/50 hover:border-indigo-500/30 ${className}`}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              {icon}
            </div>
          )}
          <h2 className="text-xl font-bold tracking-tight text-white/90">{title}</h2>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>

      {isEmpty && emptyMessage ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-slate-800/50 p-4 text-slate-500">
             {icon || (
               <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             )}
          </div>
          <p className="max-w-[200px] text-sm text-slate-400/80">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-6">{children}</div>
      )}
    </section>
  );
}

export default SectionContainer;
