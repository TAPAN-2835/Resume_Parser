'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Github, Mail, Chrome, Linkedin } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard')
    setIsLoading(false)
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else alert('Check your email for confirmation!')
    setIsLoading(false)
  }

  const loginWithProvider = async (provider: 'github' | 'google' | 'linkedin_oidc') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-600/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-sky-600/5 blur-[120px]" />

      <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 mx-auto mb-4">
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">Welcome Back</h2>
          <p className="text-slate-400 font-medium">Continue your professional evolution</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border-slate-800 space-y-6">
          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => loginWithProvider('github')}
              className="flex items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition-all group"
            >
              <Github className="h-5 w-5 text-slate-300 group-hover:text-white" />
            </button>
            <button
              onClick={() => loginWithProvider('google')}
              className="flex items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition-all group"
            >
              <Chrome className="h-5 w-5 text-slate-300 group-hover:text-white" />
            </button>
            <button
              onClick={() => loginWithProvider('linkedin_oidc')}
              className="flex items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition-all group"
            >
              <Linkedin className="h-5 w-5 text-slate-300 group-hover:text-white" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#020617] px-2 text-slate-500 font-black tracking-widest">Or continue with</span></div>
          </div>

          {/* Email Login */}
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {error && <p className="text-rose-500 text-xs font-bold animate-pulse">{error}</p>}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleEmailLogin}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
              >
                Sign In
              </button>
              <button
                onClick={handleEmailSignUp}
                disabled={isLoading}
                className="bg-slate-800/50 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs font-medium">
          By continuing, you agree to our <span className="text-slate-300 underline cursor-pointer">Terms of Service</span> and <span className="text-slate-300 underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
