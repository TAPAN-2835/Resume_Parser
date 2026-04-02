'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings, User, Mail, Shield, Bell, Save, FileText, History as HistoryIcon, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({ full_name: '', target_role: '' });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      updated_at: new Date()
    });
    if (!error) alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-[#020617]/80 backdrop-blur-2xl px-4 py-8">
         <Link href="/dashboard" className="flex items-center gap-3 px-8 mb-12">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
               <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <span className="text-xl font-black tracking-tight text-white uppercase">Genesis</span>
         </Link>

         <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all uppercase text-xs font-black tracking-widest">
              <FileText size={18} /> Analysis Dashboard
            </Link>
            <Link href="/dashboard/history" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all uppercase text-xs font-black tracking-widest">
              <HistoryIcon size={18} /> Resume History
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase text-xs font-black tracking-widest">
              <BarChart3 size={18} /> Settings
            </div>
         </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-12 max-w-4xl w-full mx-auto overflow-y-auto">
        <header className="mb-12 space-y-2">
          <h1 className="text-3xl font-black text-white">Account Settings</h1>
          <p className="text-slate-400 font-medium">Manage your professional profile and application preferences.</p>
        </header>

        <div className="space-y-8 animate-fade-in">
           {/* Profile Section */}
           <section className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400"><User size={24} /></div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Personal Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={e => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Job Title</label>
                  <input 
                    type="text" 
                    value={profile.target_role} 
                    onChange={e => setProfile({...profile, target_role: e.target.value})}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
              </div>
           </section>

           {/* Preferences */}
           <section className="glass-panel p-8 rounded-[2rem] border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400"><Bell size={24} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Stay updated on new industry keywords and ATS algorithm changes.</p>
                <div className="h-6 w-12 rounded-full bg-indigo-600 relative cursor-pointer"><div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" /></div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><Shield size={24} /></div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Security Link</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Your data is encrypted using 256-bit protocols. Manage verified devices.</p>
                <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest underline underline-offset-4">Reset Credentials</button>
              </div>
           </section>

           <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
              >
                <Save size={20} /> Deploy Changes
              </button>
           </div>
        </div>
      </main>
    </div>
  );
}
