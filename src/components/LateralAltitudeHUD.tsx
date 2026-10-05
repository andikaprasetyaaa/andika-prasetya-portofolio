import React from 'react';
import { audioManager } from '../utils/audioManager';

interface LateralAltitudeHUDProps {
  theme: 'day' | 'night';
  currentAltitude: string;
}

export const LateralAltitudeHUD: React.FC<LateralAltitudeHUDProps> = ({
  theme,
  currentAltitude,
}) => {
  const isNight = theme === 'night';

  const waypoints = [
    { label: '+120m', id: 'strata-surface' },
    { label: '000m', id: 'strata-topsoil' },
    { label: '-140m', id: 'strata-labs' },
    { label: '-380m', id: 'strata-conduits' },
    { label: '-720m', id: 'strata-logs' },
    { label: '-1250m', id: 'strata-core' },
  ];

  const handleScroll = (id: string) => {
    audioManager.playClickSound();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between fixed right-4 top-24 bottom-24 z-30 pointer-events-auto select-none font-silkscreen text-xs">
      <div
        className={`flex flex-col items-end gap-1 backdrop-blur-sm p-2.5 border shadow-md transition-colors ${
          isNight
            ? 'bg-black/70 border-slate-800 text-slate-400'
            : 'bg-white/90 border-slate-300 text-slate-700'
        }`}
      >
        <span className="text-[#58a038] font-pixel text-xs tracking-wider">
          {currentAltitude}
        </span>
        <span
          className={`text-[9px] uppercase tracking-wider ${
            isNight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          HORIZON_DATUM
        </span>
      </div>

      <div className="flex flex-col items-end gap-3 text-right">
        {waypoints.map((wp) => {
          const isActive = currentAltitude === wp.label;
          return (
            <button
              key={wp.id}
              onClick={() => handleScroll(wp.id)}
              className={`flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'text-[#58a038] font-bold scale-105'
                  : isNight
                  ? 'text-slate-500 hover:text-white opacity-60'
                  : 'text-slate-400 hover:text-black opacity-80'
              }`}
            >
              <span className="text-[10px]">{wp.label}</span>
              <span
                className={`h-0.5 transition-all ${
                  isActive
                    ? 'w-4 bg-[#58a038]'
                    : isNight
                    ? 'w-2 bg-slate-700'
                    : 'w-2 bg-slate-300'
                }`}
              ></span>
            </button>
          );
        })}
      </div>

      <div
        className={`flex flex-col items-end gap-1 backdrop-blur-sm p-2 border transition-colors ${
          isNight
            ? 'bg-black/70 border-slate-800 text-slate-400'
            : 'bg-white/90 border-slate-300 text-slate-700 shadow-sm'
        }`}
      >
        <span
          className={`text-[9px] uppercase tracking-widest ${
            isNight ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          SYS // V2.8.4
        </span>
        <span className="text-[#58a038] text-[9px] font-mono">1m = 16px</span>
      </div>
    </aside>
  );
};