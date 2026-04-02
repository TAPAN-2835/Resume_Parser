'use client';

import React, { useState } from 'react';
import { Download, FileDown, Loader2, Sparkles } from 'lucide-react';

interface ExportReportProps {
  elementId: string;
  fileName: string;
}

export default function ExportReport({ elementId, fileName }: ExportReportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    try {
      // Lazy load client-only libraries
      const [jsPDF, html2canvas] = await Promise.all([
        import('jspdf').then(m => m.default),
        import('html2canvas').then(m => m.default)
      ]);

      // Small delay to ensure animations are settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await (html2canvas as any)(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#020617',
        onclone: (clonedDoc: Document) => {
          const elementsToHide = clonedDoc.querySelectorAll('.no-export');
          elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new (jsPDF as any)({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Genesis_Report_${fileName.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="glass-panel px-6 py-3 rounded-2xl text-sm font-black text-white hover:bg-white/10 transition-all flex items-center gap-3 group relative overflow-hidden active:scale-95 disabled:opacity-50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      {isExporting ? (
        <Loader2 size={18} className="animate-spin text-indigo-400" />
      ) : (
        <Sparkles size={18} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
      )}
      <span className="relative z-10 text-[11px] uppercase tracking-widest">
        {isExporting ? 'Generating Neural Report...' : 'Export Intelligence PDF'}
      </span>
      {!isExporting && <FileDown size={14} className="ml-1 opacity-50 group-hover:translate-y-0.5 transition-transform" />}
    </button>
  );
}
