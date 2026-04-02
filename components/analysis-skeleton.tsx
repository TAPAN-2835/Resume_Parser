'use client';

import React from 'react';

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-16 animate-pulse pb-24">
      {/* Profile Card Skeleton */}
      <div className="glass-panel p-8 lg:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden h-64">
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
          <div className="h-40 w-40 rounded-[3rem] bg-white/5 shadow-2xl" />
          <div className="flex-1 space-y-4">
            <div className="h-12 w-2/3 bg-white/5 rounded-2xl" />
            <div className="h-4 w-full bg-white/5 rounded-lg" />
            <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
            <div className="flex gap-4 pt-4">
              <div className="h-8 w-32 bg-white/5 rounded-xl" />
              <div className="h-8 w-32 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel p-8 rounded-[2rem] h-96 bg-white/5" />
        <div className="glass-panel p-8 rounded-[2rem] h-96 bg-white/5" />
      </div>

      {/* Timeline Skeleton */}
      <div className="glass-panel p-8 rounded-[2rem] h-96 bg-white/5" />
    </div>
  );
}
