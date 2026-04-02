'use client';

import React from 'react';

export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background pointer-events-none">
      {/* Animated Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[150px] animate-pulse delay-700" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse delay-1000" />
      
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] data-[theme=dark]:invert pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
