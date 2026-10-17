import React from 'react';

export default function DisclaimerBanner() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'rgba(255,23,68,0.08)', borderBottom: '1px solid rgba(255,23,68,0.18)' }}
    >
      <div className="flex items-center gap-2 py-2 px-4">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest" style={{ color: '#FF1744' }}>
          Health Disclaimer
        </span>
        <div className="flex-1 overflow-hidden">
          <p className="marquee whitespace-nowrap text-[11px]" style={{ color: 'rgba(255,100,100,0.8)' }}>
            ⚠️ This app is for general fitness guidance only and is not a substitute for professional medical advice, diagnosis, or treatment. Consult a qualified healthcare provider before starting any new exercise or diet programme. If you experience pain or discomfort, stop immediately. &nbsp;&nbsp;&nbsp; — This is a demo/personal project. All plans are illustrative. No health claims are made.
          </p>
        </div>
      </div>
    </div>
  );
}
