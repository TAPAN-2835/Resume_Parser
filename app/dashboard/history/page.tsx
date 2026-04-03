'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { History as HistoryIcon, FileText, Calendar, ChevronRight, BarChart3, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('scans')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) setScans(data);
      }
      setIsLoading(false);
    };
    fetchHistory();
  }, []);

  const deleteScan = async (id: string) => {
    const { error } = await supabase.from('scans').delete().eq('id', id);
    if (!error) {
      setScans(scans.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar - Reuse NavItem component logic or simple links */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-[#020617]/80 backdrop-blur-2xl px-4 py-8">
         <Link href="/dashboard" className="flex items-center gap-3 px-8 mb-12">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 overflow-hidden">
               <img src="/icon.svg" alt="Logo" className="h-full w-full object-cover" />
             </div>
             <span className="text-xl font-black tracking-tight text-white uppercase">Genesis</span>
         </Link>

         <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all uppercase text-xs font-black tracking-widest">
              <FileText size={18} /> Analysis Dashboard
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase text-xs font-black tracking-widest">
              <HistoryIcon size={18} /> Resume History
            </div>
         </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-12 max-w-6xl w-full mx-auto overflow-y-auto">
        <header className="mb-12 space-y-2">
          <h1 className="text-3xl font-black text-white">Report Archive</h1>
          <p className="text-slate-400 font-medium">Access and manage your complete history of professional assessments.</p>
        </header>

        {isLoading ? (
          <div className="grid gap-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl border border-white/5" />)}
          </div>
        ) : scans.length > 0 ? (
          <div className="grid gap-4 animate-fade-in">
            {scans.map((scan) => (
              <Link key={scan.id} href={`/dashboard/history/${scan.id}`} className="glass-panel p-6 rounded-3xl border-white/5 flex items-center justify-between hover:border-indigo-500/20 transition-all group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{scan.file_name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Calendar size={12} /> {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {scan.archetype}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</p>
                    <p className={`text-2xl font-black ${
                      scan.score >= 80 ? 'text-emerald-400' : scan.score >= 60 ? 'text-sky-400' : 'text-rose-400'
                    }`}>{scan.score}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                      <ChevronRight size={20} />
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteScan(scan.id);
                      }} 
                      className="p-3 rounded-xl text-slate-600 hover:text-rose-400 transition-all relative z-10"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-3xl border-dashed border-white/10">
            <Search size={40} className="mx-auto text-slate-700 mb-4" strokeWidth={1} />
            <h3 className="text-white font-black uppercase tracking-[0.2em]">No Reports Found</h3>
            <p className="text-slate-500 font-medium mt-2">Start your first assessment in the Analysis Dashboard to begin.</p>
            <Link href="/dashboard" className="inline-block mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20">Go to Dashboard</Link>
          </div>
        )}
      </main>
    </div>
  );
}
