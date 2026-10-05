import React, { useRef, useEffect } from 'react';
import { audioManager } from '../utils/audioManager';
import { ArrowDown, Terminal, Mail } from 'lucide-react';

interface StrataSurfaceHeroProps {
  theme: 'day' | 'night';
}

export const StrataSurfaceHero: React.FC<StrataSurfaceHeroProps> = ({ theme }) => {
  const isNight = theme === 'night';
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSrc = isNight ? '/video/terraria_night.mp4' : '/video/terraria_day.mp4';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay:', err);
      });
    }
  }, [theme, videoSrc]);

  const scrollTo = (id: string) => {
    audioManager.playClickSound();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="strata-surface" className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden pt-16">
      {/* ======================================================== */}
      {/* 100% AUTHENTIC TERRARIA MP4 VIDEO BACKGROUND             */}
      {/* ======================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
        <video
          ref={videoRef}
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter contrast-105 brightness-100"
          style={{ imageRendering: 'pixelated' }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Soft atmospheric gradient */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
            isNight
              ? 'bg-gradient-to-b from-black/40 via-transparent to-[#0d0e17]/95'
              : 'bg-gradient-to-b from-blue-900/15 via-transparent to-[#e2e8f0]/40'
          }`}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 flex flex-col gap-6 select-none">
        {/* Sector Tag */}
        <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-black/75 border border-slate-700/80 text-white font-silkscreen text-[11px] backdrop-blur-sm shadow-md">
          <span className="w-2 h-2 bg-[#58a038] animate-pulse"></span>
          <span className="text-[#58a038] font-bold">ELEVATION: +120m</span>
          <span className="text-slate-400">// STRATUM 00 : OVERWORLD SURFACE</span>
        </div>

        {/* Hero Title */}
        <div className="flex flex-col gap-3">
          <h1 className="font-pixel text-2xl sm:text-3xl md:text-5xl text-white leading-tight tracking-tight uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]">
            I PUTU ANDIKA<br />PRASETYA
          </h1>
          <p className="font-silkscreen text-xs sm:text-sm md:text-base text-yellow-400 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            DATA ENGINEER • BACKEND SYSTEMS • AI AUTOMATION
          </p>
        </div>

        {/* Narrative Description */}
        <p className="font-silkscreen text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/65 p-4 backdrop-blur-sm border-l-4 border-[#58a038]">
          Excavating robust data pipelines, orchestrating multi-agent LLM systems, and engineering high-throughput telemetry architectures. Driven by the mathematical discipline of distributed computing and procedural sandbox design.
        </p>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => scrollTo('strata-labs')}
            className="px-6 py-3.5 bg-[#58a038] hover:bg-[#68bd42] text-black font-pixel text-[11px] uppercase transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shadow-[0_4px_0_#386a24]"
          >
            <span>INITIALIZE EXCAVATION</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={() => scrollTo('strata-core')}
            className="px-6 py-3.5 bg-black/75 hover:bg-black/95 text-white font-pixel text-[11px] uppercase border border-slate-700 transition-colors flex items-center gap-2 backdrop-blur-sm shadow-md"
          >
            <Terminal className="w-4 h-4 text-[#58a038]" />
            <span>TERMINAL ACCESS</span>
          </button>

          <a
            href="mailto:andikaprasetyaa@gmail.com"
            className="px-5 py-3.5 bg-black/65 hover:bg-black/85 text-yellow-300 font-pixel text-[11px] uppercase border border-yellow-500/50 transition-colors flex items-center gap-2 backdrop-blur-sm shadow-md"
            title="Direct transmission to andikaprasetyaa@gmail.com"
          >
            <Mail className="w-4 h-4 text-yellow-400" />
            <span>DISPATCH EMAIL</span>
          </a>
        </div>
      </div>

      {/* Surface Horizon Status Indicator at Bottom */}
      <div className="relative z-20 w-full px-6 md:px-12 pb-4 flex items-center justify-between pointer-events-none select-none">
        <div className="flex items-center gap-2 bg-black/75 px-3 py-1.5 border border-slate-700/80 backdrop-blur-sm">
          <span className="w-2 h-2 bg-[#58a038] animate-pulse"></span>
          <span className="font-pixel text-[9px] text-[#58a038] tracking-wider">
            SURFACE HORIZON // +120m
          </span>
        </div>
        <div className="font-pixel text-[8px] text-slate-300 bg-black/75 px-3 py-1.5 border border-slate-700/80 backdrop-blur-sm hidden sm:block">
          LIVE TERRARIA BIOME // 60 FPS
        </div>
      </div>
    </section>
  );
};
