import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 text-xs text-red-800 flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        <div className="min-w-0 overflow-hidden whitespace-nowrap">
          <p className="leading-snug inline-block pr-16 animate-disclaimer-marquee">
          <strong className="text-red-700 font-semibold">Medical Disclaimer:</strong> FitBot AI fitness and nutrition suggestions are for general informational purposes only. Consult a qualified fitness or healthcare professional before starting any new diet or workout program.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
