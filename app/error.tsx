'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available (e.g., Sentry)
    console.error('Global Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      {/* Background Decorators */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] h-[40%] w-[40%] rounded-full bg-rose-600/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] h-[40%] w-[40%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="max-w-md w-full glass-panel p-8 lg:p-12 rounded-[2.5rem] border border-rose-500/20 relative overflow-hidden backdrop-blur-2xl text-center space-y-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
        
        <div className="mx-auto h-20 w-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)] mb-8">
          <AlertCircle size={32} className="text-rose-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">System Malfunction</h2>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">
            The neural interface encountered an unexpected anomaly. Our engineers have been alerted.
          </p>
        </div>

        <div className="pt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-all border border-white/5 hover:border-white/10"
          >
            <RefreshCcw size={14} /> Recover
          </button>
          
          <Link href="/" className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
            <Home size={14} /> Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
