/**
 * Error State Component (Premium)
 * Sophisticated error handling UI for the Genesis Parser.
 */

import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onReset?: () => void;
}

export function ErrorState({
  title = 'System Interruption',
  message,
  details,
  onRetry,
  onReset,
}: ErrorStateProps) {
  return (
    <div className="relative group animate-fade-in">
      {/* Rose Glow Background */}
      <div className="absolute -inset-1 rounded-[2rem] bg-rose-500/10 blur-xl opacity-50 transition duration-1000 group-hover:opacity-100" />
      
      <div className="relative glass-card rounded-[2rem] p-10 border-rose-500/20 bg-rose-500/[0.02]">
        <div className="space-y-8">
          {/* Error Header */}
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
              <p className="text-sm font-medium text-rose-400/80">Extraction sequence incomplete.</p>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <p className="text-lg font-bold text-slate-200 leading-snug">{message}</p>
            {details && (
              <p className="text-sm text-slate-500 font-medium italic">
                Technical Log: {details}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            {onReset && (
              <button
                onClick={onReset}
                className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-6 py-4 text-sm font-black text-slate-300 uppercase tracking-widest transition-all hover:bg-slate-800 hover:text-white"
              >
                Reset Engine
              </button>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95"
              >
                Re-attempt Scan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
