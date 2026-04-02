'use client';

import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { UIState, stateMachineReducer, initializeState } from '@/lib/state-machine';
import { parseResume } from '@/lib/api/resume-service';
import type { ParseResult } from '@/types/resume';
import UploadZone from '@/components/upload-zone';
import Loader from '@/components/loader';
import ErrorState from '@/components/error-state';
import { exportToJson } from '@/lib/utils/export-service';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User as UserIcon, LayoutDashboard, History, Settings, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import AnalysisResult from '@/components/analysis-result';
import AnalysisSkeleton from '@/components/analysis-skeleton';
import AtmosphericBackground from '@/components/atmospheric-background';

const ExportReport = dynamic(() => import('@/components/export-report'), { 
  ssr: false,
  loading: () => <div className="h-10 w-32 animate-pulse bg-white/5 rounded-2xl" />
});

export default function Dashboard() {
  const [stateMachine, dispatch] = useReducer(stateMachineReducer, undefined, initializeState);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const autoSaveScan = async (result: ParseResult, fileName: string) => {
    if (!result.data) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const skills = result.data.skills || [];
      const frontend = skills.filter(s => s.category === 'frontend').length;
      const backend = skills.filter(s => s.category === 'backend').length;
      const devops = skills.filter(s => s.category === 'devops').length;
      
      let archetype = 'Generalist';
      if (frontend > backend && frontend > devops) archetype = 'Frontend Specialists';
      else if (backend > frontend && backend > devops) archetype = 'Backend Architecture';
      else if (devops > frontend && devops > backend) archetype = 'DevOps & Systems';

      await supabase.from('scans').insert({
        user_id: user.id,
        file_name: fileName,
        score: result.score?.total || 0,
        archetype: archetype,
        raw_json: {
          ...result.data,
          scoreBreakdown: result.score,
          insights: result.insights
        },
        success: result.success
      });
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    dispatch({ type: 'UPLOAD' });

    try {
      dispatch({ type: 'PARSE' });
      const result = await parseResume(file);

      if (result.success && result.data) {
        setParseResult(result);
        dispatch({ type: 'SUCCESS' });
        // Auto-save to Supabase
        autoSaveScan(result, file.name);
      } else {
        const errorMessage = result.error?.message || 'Failed to parse resume.';
        setError(errorMessage);
        dispatch({ type: 'ERROR' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      dispatch({ type: 'ERROR' });
    }
  }, [supabase]);

  const handleReset = useCallback(() => {
    setError(null);
    setParseResult(null);
    dispatch({ type: 'RESET' });
  }, []);

  const handleExport = useCallback(() => {
    if (parseResult) {
      exportToJson(parseResult);
    }
  }, [parseResult]);

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-[#020617]/80 backdrop-blur-2xl z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
               <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <span className="text-xl font-black tracking-tight text-white uppercase">Genesis</span>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="block">
            <NavItem icon={<LayoutDashboard size={18} />} label="Analysis Dashboard" active />
          </Link>
          <Link href="/dashboard/history" className="block">
            <NavItem icon={<History size={18} />} label="Resume History" />
          </Link>
          <Link href="/dashboard/settings" className="block">
            <NavItem icon={<Settings size={18} />} label="Account Settings" />
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
             <div className="flex items-center gap-3 mb-2">
               <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                 <UserIcon size={18} className="text-indigo-400" />
               </div>
               <div className="overflow-hidden">
                 <p className="text-xs font-black text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
                 <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
               </div>
             </div>
             <button 
               onClick={handleSignOut}
               className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-400/10 transition-all border border-rose-400/20"
             >
               <LogOut size={14} /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50">
           <span className="text-xl font-black tracking-tight text-white uppercase">Genesis</span>
           <button onClick={handleSignOut} className="p-2 rounded-lg bg-slate-800 text-rose-400"><LogOut size={20} /></button>
        </header>

        <main className="flex-1 p-6 lg:p-12 max-w-6xl w-full mx-auto">
          {/* Dashboard Header Context */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-white">Analysis Dashboard</h1>
                {parseResult?.metadata?.isCached && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                    <Zap size={10} fill="currentColor" /> Neural Cache
                  </div>
                )}
              </div>
              <p className="text-slate-400 font-medium">Generate comprehensive professional reports from your career history.</p>
            </div>
             {parseResult && (
               <div className="flex gap-4">
                 <ExportReport 
                    elementId="resume-analysis-report" 
                    fileName={parseResult.metadata?.fileName || 'resume'} 
                 />
                 <button onClick={handleReset} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95">New Scan</button>
               </div>
            )}
          </div>

          {stateMachine.current === UIState.EMPTY && (
            <div className="animate-fade-in py-20 lg:py-40">
              <UploadZone onFileSelect={handleFileSelect} isLoading={false} />
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                 <FeatureCard title="Precision Parsing" desc="Industry-standard document extraction" />
                 <FeatureCard title="Expert Classification" desc="Automated professional profile detection" />
                 <FeatureCard title="ATS Optimization" desc="Score calibration for top-tier systems" />
              </div>
            </div>
          )}

          {stateMachine.current === UIState.UPLOADING && (
            <div className="min-h-[40vh] flex items-center justify-center animate-fade-in">
              <Loader 
                stage="upload"
                message="Securing your file for analysis..."
              />
            </div>
          )}

          {stateMachine.current === UIState.PARSING && (
            <div className="animate-fade-in">
              <div className="mb-8 flex items-center gap-3">
                <Loader stage="parsing" message="Neural extraction in progress..." />
              </div>
              <AnalysisSkeleton />
            </div>
          )}

          {stateMachine.current === UIState.ERROR && (
            <div className="max-w-xl mx-auto">
              <ErrorState 
                title="Analysis Interrupted" 
                message={error || "A processing error occurred during the analysis sequence."} 
                onRetry={handleReset} 
                onReset={handleReset} 
              />
            </div>
          )}

          {stateMachine.current === UIState.SUCCESS && parseResult?.data && (
            <AnalysisResult 
              data={parseResult.data} 
              score={parseResult.score ?? { 
                total: 0, 
                sections: { personalInfo: 0, experience: 0, education: 0, skills: 0, projects: 0 },
                details: []
              }} 
              insights={parseResult.insights ?? []} 
            />
          )}
        </main>

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-600/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-sky-600/5 blur-[120px]" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-800/50 hover:border-indigo-500/20 transition-all group">
       <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{title}</h4>
       <p className="text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
