/**
 * Upload Zone Component (Premium)
 * Sophisticated drag & drop interface with glassmorphism and floating animations.
 */

'use client';

import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string;
}

const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadZone({ onFileSelect, isLoading = false, error }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(error || null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.docx')) {
      return 'Please upload a PDF, TXT, or Word document.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File exceeds 10MB limit.';
    }
    return null;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const err = validateFile(files[0]);
      if (err) {
        setValidationError(err);
      } else {
        setValidationError(null);
        onFileSelect(files[0]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const err = validateFile(e.target.files[0]);
      if (err) {
        setValidationError(err);
      } else {
        setValidationError(null);
        onFileSelect(e.target.files[0]);
      }
    }
  };

  return (
    <div className="relative group max-w-4xl mx-auto">
      {/* Decorative Glow Background */}
      <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 to-sky-500 opacity-10 blur-xl transition duration-1000 group-hover:opacity-25" />
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative glass-card rounded-[2rem] p-12 sm:p-20 text-center transition-all duration-500 min-h-[400px] flex flex-col items-center justify-center border-slate-800 hover:border-slate-700/50 ${
          dragActive ? 'scale-[1.02] border-indigo-500/50 bg-indigo-500/5 glow-primary' : ''
        } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isLoading}
          className="hidden"
        />

        {/* Animated Upload Icon */}
        <div className={`mb-10 transition-transform duration-500 ${dragActive ? 'scale-110' : ''}`}>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-950 text-indigo-400 border border-white/10 shadow-2xl animate-float">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white border-4 border-slate-950">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-sm">
          <h3 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {dragActive ? "Release to Analyize" : "Import Resume"}
          </h3>
          <p className="text-lg font-medium text-slate-400 leading-relaxed">
            Drag your file here or <span className="text-indigo-400 border-b border-indigo-500/30">browse</span> to transform your resume into raw structural intelligence.
          </p>
        </div>

        {/* Status Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {['PDF', 'DOCX', 'TXT'].map((f) => (
            <div key={f} className="rounded-full bg-slate-800/50 px-4 py-1.5 text-[10px] font-black tracking-widest text-slate-400 border border-slate-700/30">
              {f} SUPPORTED
            </div>
          ))}
        </div>

        {/* Error Tooltip */}
        {(validationError || error) && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-slide-in-up">
            <div className="flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-2 text-xs font-bold text-rose-400 backdrop-blur-md">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {validationError || error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadZone;
