'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Target, BarChart3, ShieldCheck, Globe, Rocket } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617]" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 overflow-hidden">
               <img src="/icon.svg" alt="Logo" className="h-full w-full object-cover" />
             </div>
             <span className="text-xl font-black tracking-tight text-white uppercase">Genesis<span className="text-indigo-400">Insights</span></span>
           </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <Link href="/login" className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-full border border-white/10 text-white transition-all">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
            <Zap size={12} className="fill-current" />
            Empowering the modern candidate
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] text-white">
            Your Resume, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">Professional Insights.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed">
            Transform standard resumes into high-impact professional profiles. Our intelligent engine analyzes core competencies, calculates market alignment, and identifies your expert specialization instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/login" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/40 group">
              Get Started for Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700 text-white font-black rounded-2xl border border-slate-700 transition-all">
              Login to Dashboard
            </Link>
          </div>
        </div>

        {/* Hero Illustration Placeholder */}
        <div className="max-w-6xl mx-auto mt-20 relative animate-fade-in">
           <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10" />
           <div className="glass-card rounded-[2.5rem] p-4 border-white/5 bg-[#020617]/50">
              <div className="bg-[#0b1120] rounded-[2rem] h-[400px] sm:h-[600px] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                 {/* Visual placeholder for the dashboard */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
                 <div className="z-10 text-center space-y-4">
                    <div className="h-16 w-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <BarChart3 className="text-indigo-400" size={32} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-500">Dashbaord Preview</p>
                    <p className="text-2xl font-bold text-white max-w-sm italic">"The most comprehensive parsing engine I've ever used."</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-[#01040f]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureItem 
              icon={<Target className="text-indigo-400" />} 
              title="ATS Optimization" 
              desc="Proprietary scoring algorithm that calculates your fit based on real-world recruiter standards."
            />
            <FeatureItem 
              icon={<Zap className="text-sky-400" />} 
              title="Expert Classification" 
              desc="Identify your professional specialization through multi-factor competency analysis and market alignment."
            />
            <FeatureItem 
              icon={<ShieldCheck className="text-emerald-400" />} 
              title="Secure Processing" 
              desc="Bank-grade encryption for all PDF data with automated PII scrubbing protocols."
            />
            <FeatureItem 
              icon={<Globe className="text-indigo-400" />} 
              title="Social Intelligence" 
              desc="Integrated deep-scan for GitHub, LinkedIn, GitLab, and developer portfolio footprints."
            />
            <FeatureItem 
              icon={<BarChart3 className="text-sky-400" />} 
              title="Skills Matrix View" 
              desc="Visualize your professional balance through advanced multi-dimensional competency mapping."
            />
            <FeatureItem 
              icon={<Rocket className="text-emerald-400" />} 
              title="Export Ready" 
              desc="Download your professional profile data in structured formats compatible with all industry platforms."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-xs font-black uppercase tracking-widest text-slate-600">Built for Excellence &copy; 2026 Genesis Engine</p>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4 group">
      <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed leading-relaxed">{desc}</p>
    </div>
  );
}
