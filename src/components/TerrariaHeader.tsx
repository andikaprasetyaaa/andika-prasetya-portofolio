import React from 'react';
import { audioManager } from '../utils/audioManager';
import { Sun, Moon } from 'lucide-react';

interface TerrariaHeaderProps {
  theme: 'day' | 'night';
  onThemeToggle: () => void;
  currentAltitude: string;
}

export const TerrariaHeader: React.FC<TerrariaHeaderProps> = ({
  theme,
  onThemeToggle,
  currentAltitude,
}) => {
  const isNight = theme === 'night';

  const handleNavClick = (anchorId: string) => {
    audioManager.playClickSound();
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md border-b select-none transition-colors duration-500 ${
        isNight
          ? 'bg-[#0d0d12]/90 border-slate-800/80 text-white'
          : 'bg-white/90 border-slate-300 text-[#0f172a] shadow-sm'
      }`}
    >
      <div className="h-16 w-full px-4 md:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border-2 border-black flex flex-col shadow-sm">
            <div className="h-2 bg-[#58a038]"></div>
            <div className="flex-1 bg-[#865439] flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[#eab308]"></span>
            </div>
          </div>
          <div className="flex flex-col">
            <span
              className={`font-pixel text-xs tracking-wider uppercase ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              ANDIKA // DEV.WORLD
            </span>
            <span
              className={`font-silkscreen text-[9px] uppercase tracking-widest ${
                isNight ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              GEOLOGICAL AXIS TAXONOMY
            </span>
          </div>
        </div>

        {/* Terraria Hearts & Mana HUD */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-1" title="Life: 100/100">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-red-500 fill-current drop-shadow-[0_0_2px_rgba(239,68,68,0.8)]" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ))}
            <span className="font-pixel text-[9px] text-red-500 ml-1 font-bold">100 HP</span>
          </div>

          <div className="flex items-center gap-1" title="Mana: 80/80">
            {[...Array(4)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-blue-500 fill-current drop-shadow-[0_0_2px_rgba(59,130,246,0.8)]" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            ))}
            <span className="font-pixel text-[9px] text-blue-500 ml-1 font-bold">80 MP</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav
          className={`hidden xl:flex items-center gap-1 p-1 border font-silkscreen ${
            isNight
              ? 'bg-[#18181f] border-slate-800'
              : 'bg-slate-100 border-slate-300'
          }`}
        >
          <button
            onClick={() => handleNavClick('strata-surface')}
            className={`px-3 py-1 text-[11px] uppercase transition-colors ${
              isNight
                ? 'text-white hover:bg-slate-700/60'
                : 'text-[#0f172a] hover:bg-white shadow-sm font-bold'
            }`}
          >
            SURFACE [+120m]
          </button>
          <button
            onClick={() => handleNavClick('strata-topsoil')}
            className={`px-3 py-1 text-[11px] uppercase transition-colors ${
              isNight
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                : 'text-slate-600 hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            STRATA-01 [0m]
          </button>
          <button
            onClick={() => handleNavClick('strata-labs')}
            className={`px-3 py-1 text-[11px] uppercase transition-colors ${
              isNight
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                : 'text-slate-600 hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            LABS [-140m]
          </button>
          <button
            onClick={() => handleNavClick('strata-conduits')}
            className={`px-3 py-1 text-[11px] uppercase transition-colors ${
              isNight
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                : 'text-slate-600 hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            CONDUITS [-380m]
          </button>
          <button
            onClick={() => handleNavClick('strata-logs')}
            className={`px-3 py-1 text-[11px] uppercase transition-colors ${
              isNight
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                : 'text-slate-600 hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            LOGS [-720m]
          </button>
          <button
            onClick={() => handleNavClick('strata-core')}
            className={`px-3 py-1 text-[11px] uppercase transition-colors ${
              isNight
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                : 'text-slate-600 hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            CORE [-1250m]
          </button>
        </nav>

        {/* Altitude & Day/Night Toggle */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 border font-silkscreen text-xs ${
              isNight
                ? 'bg-black/50 border-slate-800'
                : 'bg-slate-100 border-slate-300'
            }`}
          >
            <span className={isNight ? 'text-slate-400' : 'text-slate-500'}>
              ALT:
            </span>
            <span className="text-[#58a038] font-bold">{currentAltitude}</span>
            <span className="w-1.5 h-1.5 bg-[#58a038] rounded-full animate-ping"></span>
          </div>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onThemeToggle();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 font-pixel text-[9px] uppercase transition-colors border ${
              isNight
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-[#58a038] hover:bg-[#46822c] border-[#86efac] text-black font-bold shadow-sm'
            }`}
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>NIGHT</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>DAY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};