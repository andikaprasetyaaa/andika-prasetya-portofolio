import React from 'react';

export const LocationStamp: React.FC = () => {
  return (
    <div className="fixed bottom-3 md:bottom-6 left-4 md:left-6 z-30 pointer-events-none select-none">
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-[#201f1f]">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
        <p className="font-mono text-[9px] text-[#c4c7c8] tracking-wider uppercase">
          LAT 8.3405° S, 115.0920° E / BALI - ID
        </p>
      </div>
    </div>
  );
};

