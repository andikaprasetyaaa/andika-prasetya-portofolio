import React from 'react';
import { ArrowDown, Radio } from 'lucide-react';

interface TerrariaFooterProps {
  theme: 'day' | 'night';
}

export const TerrariaFooter: React.FC<TerrariaFooterProps> = ({ theme }) => {
  const isNight = theme === 'night';

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 w-full z-30 backdrop-blur-md border-t select-none transition-colors duration-500 ${
        isNight
          ? 'bg-[#0d0d12]/95 border-slate-800 text-slate-400'
          : 'bg-white/95 border-slate-300 text-slate-700 shadow-sm'
      }`}
    >
      <div className="h-12 w-full px-4 md:px-8 flex items-center justify-between font-silkscreen text-[10px]">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1.5">
            <span className={isNight ? 'text-slate-500' : 'text-slate-400 font-bold'}>
              COORD:
            </span>
            <span className={isNight ? 'text-white' : 'text-[#0f172a] font-bold'}>
              08°39'11"S 115°13'01"E
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className={isNight ? 'text-slate-500' : 'text-slate-400 font-bold'}>
              DATUM:
            </span>
            <span className="text-[#58a038] font-bold">WGS84_TERRARIA_L3</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <span className={isNight ? 'text-slate-500' : 'text-slate-400 font-bold'}>
              ENGINE:
            </span>
            <span className={isNight ? 'text-white' : 'text-[#0f172a] font-bold'}>
              REACT + TS // 60FPS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 ${isNight ? 'text-white' : 'text-[#0f172a]'}`}>
            <ArrowDown className="w-3.5 h-3.5 text-[#58a038] animate-bounce" />
            <span className="uppercase tracking-widest hidden sm:inline">
              DESCENT VECTOR // SCROLL TO EXCAVATE
            </span>
          </div>

          <div
            className={`hidden lg:flex items-center gap-1 px-2 py-0.5 border text-[9px] text-[#58a038] ${
              isNight ? 'bg-black/60 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <Radio className="w-3 h-3 text-[#58a038] animate-pulse" />
            <span>SIGNAL: ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};