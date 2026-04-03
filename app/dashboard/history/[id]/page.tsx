'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Download, Share2, History as HistoryIcon, FileText, BarChart3, Menu, X } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AnalysisResult from '@/components/analysis-result';

const ExportReport = dynamic(() => import('@/components/export-report'), { 
  ssr: false,
  loading: () => <div className="h-10 w-32 animate-pulse bg-white/5 rounded-xl" />
});

export default function HistoryDetailPage() {
  const { id } = useParams();
  const [scan, setScan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchScanDetail = async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setScan(data);
      else if (error) router.push('/dashboard/history');
      setIsLoading(false);
    };
    fetchScanDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex">
       {/* Sidebar */}
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
            <Link href="/dashboard/history" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase text-xs font-black tracking-widest">
              <HistoryIcon size={18} /> Resume History
            </Link>
         </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <span className="text-xl font-black tracking-tight text-white uppercase">Genesis</span>
           </div>
           
           {isMobileMenuOpen && (
             <div className="absolute top-full left-0 right-0 bg-[#020617] border-b border-white/5 p-4 flex flex-col gap-2 shadow-2xl animate-fade-in">
                <Link href="/dashboard" className="px-4 py-3 rounded-xl bg-white/5 text-slate-300 font-bold text-sm tracking-widest uppercase">Analysis Dashboard</Link>
                <Link href="/dashboard/history" className="px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm tracking-widest uppercase">Resume History</Link>
             </div>
           )}
        </header>

        <main className="flex-1 p-6 lg:p-12 max-w-6xl w-full mx-auto">
          <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <button 
                onClick={() => router.push('/dashboard/history')}
                className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-4 text-xs font-black uppercase tracking-widest"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to History
              </button>
              <h1 className="text-3xl font-black text-white">{scan?.file_name}</h1>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest border border-white/5">
                  <Share2 size={14} /> Share Report
               </button>
               <ExportReport elementId="resume-analysis-report" fileName={scan?.file_name || 'report'} />
            </div>
          </header>

          {scan && (
            <AnalysisResult 
              data={scan.raw_json} 
              score={scan.raw_json.scoreBreakdown || { 
                total: scan.score || 0, 
                sections: { personalInfo: 0, experience: 0, education: 0, skills: 0, projects: 0 },
                details: [] 
              }} 
              insights={scan.raw_json.insights || []} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
