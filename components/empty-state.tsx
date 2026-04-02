/**
 * Empty State Component
 * Context-aware empty state with CTAs
 */

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title = 'No resume uploaded yet',
  description = 'Upload your resume to get started with AI-powered analysis and actionable insights.',
  action,
}: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 py-12 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        {icon ? (
          icon
        ) : (
          <svg
            className="h-8 w-8 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-all duration-200 hover:bg-accent/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
