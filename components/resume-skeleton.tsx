/**
 * Resume Skeleton Loader
 * Displays a skeleton loading state matching the resume results layout
 */

export function ResumeSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Skeleton */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-3">
          <div className="h-8 w-48 animate-shimmer rounded" />
          <div className="h-4 w-96 animate-shimmer rounded" />
          <div className="h-4 w-64 animate-shimmer rounded" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 animate-shimmer rounded" />
              <div className="h-4 w-full animate-shimmer rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills Skeleton */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 h-6 w-24 animate-shimmer rounded" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-24 animate-shimmer rounded-full" />
          ))}
        </div>
      </div>

      {/* Experience Skeleton */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 h-6 w-32 animate-shimmer rounded" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 border-b border-border pb-6 last:border-0">
              <div className="h-5 w-48 animate-shimmer rounded" />
              <div className="h-4 w-32 animate-shimmer rounded" />
              <div className="h-4 w-24 animate-shimmer rounded" />
              <div className="space-y-2 pt-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="h-3 w-full animate-shimmer rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Skeleton */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 h-6 w-28 animate-shimmer rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded bg-muted/30 p-4">
              <div className="mb-2 h-4 w-40 animate-shimmer rounded" />
              <div className="h-3 w-full animate-shimmer rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResumeSkeleton;
