import React, { useEffect, useState } from 'react';
import { audioManager } from '../utils/audioManager';

interface TerrariaSkyProps {
  theme: 'day' | 'night';
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
}

export const TerrariaSky: React.FC<TerrariaSkyProps> = ({ theme }) => {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const isNight = theme === 'night';

  useEffect(() => {
    if (!isNight) return;

    const interval = setInterval(() => {
      const newStar: ShootingStar = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 10,
      };
      setShootingStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 1500);
    }, 7000);

    return () => clearInterval(interval);
  }, [isNight]);

  const handleStarClick = () => {
    audioManager.playPickupSound();
  };

  return (
    <div
      className={`absolute inset-0 transition-colors duration-1000 overflow-hidden pointer-events-none ${
        isNight
          ? 'bg-gradient-to-b from-[#050713] via-[#0d1430] to-[#181a38]'
          : 'bg-gradient-to-b from-[#38bdf8] via-[#60a5fa] to-[#93c5fd]'
      }`}
    >
      {/* Sun / Moon */}
      {isNight ? (
        <div className="absolute top-10 right-12 md:right-32 w-16 h-16 md:w-20 md:h-20 bg-slate-100 shadow-[0_0_35px_rgba(255,255,255,0.45)] border-2 border-slate-300 flex flex-col justify-between p-2 pointer-events-auto transition-transform hover:scale-110">
          <div className="flex justify-between">
            <span className="w-2.5 h-2.5 bg-slate-400"></span>
            <span className="w-3.5 h-2.5 bg-slate-300"></span>
          </div>
          <div className="flex justify-start">
            <span className="w-4 h-3.5 bg-slate-400 opacity-70"></span>
          </div>
          <div className="flex justify-between items-end">
            <span className="w-3 h-3 bg-slate-400"></span>
            <span className="w-2 h-2 bg-slate-300"></span>
          </div>
        </div>
      ) : (
        <div className="absolute top-10 right-12 md:right-32 w-16 h-16 md:w-20 md:h-20 bg-amber-300 shadow-[0_0_50px_rgba(250,204,21,0.7)] border-2 border-amber-400 flex flex-col justify-between p-2 pointer-events-auto transition-transform hover:scale-110 animate-sun-glow">
          <div className="flex justify-between">
            <span className="w-2 h-2 bg-amber-100"></span>
            <span className="w-2.5 h-2.5 bg-yellow-200"></span>
          </div>
          <div className="flex justify-center">
            <span className="w-4 h-3 bg-amber-400 opacity-80"></span>
          </div>
          <div className="flex justify-between items-end">
            <span className="w-2.5 h-2.5 bg-amber-100"></span>
            <span className="w-2 h-2 bg-amber-200"></span>
          </div>
        </div>
      )}

      {/* Stars in Night Mode */}
      {isNight && (
        <div className="absolute inset-0">
          <div className="absolute top-8 left-16 w-2 h-2 bg-yellow-100 shadow-[0_0_4px_white] animate-star-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-20 left-1/4 w-1.5 h-1.5 bg-cyan-200 shadow-[0_0_4px_cyan] animate-star-pulse" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute top-12 left-1/2 w-2 h-2 bg-white shadow-[0_0_6px_white] animate-star-pulse" style={{ animationDelay: '1.4s' }}></div>
          <div className="absolute top-28 left-2/3 w-1.5 h-1.5 bg-indigo-200 shadow-[0_0_4px_indigo] animate-star-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-16 right-56 w-2 h-2 bg-yellow-200 shadow-[0_0_4px_yellow] animate-star-pulse" style={{ animationDelay: '1.1s' }}></div>
          <div className="absolute top-36 left-32 w-1.5 h-1.5 bg-white shadow-[0_0_4px_white] animate-star-pulse" style={{ animationDelay: '1.8s' }}></div>
          <div className="absolute top-44 left-3/4 w-1.5 h-1.5 bg-sky-200 shadow-[0_0_4px_sky] animate-star-pulse" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute top-24 right-1/4 w-2 h-2 bg-yellow-100 shadow-[0_0_4px_yellow] animate-star-pulse" style={{ animationDelay: '2.1s' }}></div>

          {shootingStars.map((star) => (
            <div
              key={star.id}
              onClick={handleStarClick}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              className="absolute pointer-events-auto cursor-pointer z-20 flex items-center gap-1 -translate-x-full transition-all duration-1000 ease-out"
            >
              <div className="w-3 h-3 bg-yellow-300 shadow-[0_0_12px_#fde047] rotate-45 animate-spin"></div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-transparent"></div>
            </div>
          ))}
        </div>
      )}

      {/* Parallax Clouds */}
      <div className="absolute top-10 left-0 animate-cloud-fast opacity-90">
        <div className={`relative w-44 h-9 ${isNight ? 'bg-slate-700/60' : 'bg-white/80'} shadow-md flex flex-col justify-end`}>
          <div className={`w-24 h-5 ${isNight ? 'bg-slate-700/60' : 'bg-white/80'} -mt-5 ml-8`}></div>
          <div className={`w-14 h-4 ${isNight ? 'bg-slate-700/60' : 'bg-white/80'} -mt-4 ml-14`}></div>
        </div>
      </div>

      <div className="absolute top-24 left-0 animate-cloud-mid opacity-75" style={{ animationDelay: '-14s' }}>
        <div className={`relative w-56 h-12 ${isNight ? 'bg-slate-800/60' : 'bg-white/70'} flex flex-col justify-end`}>
          <div className={`w-32 h-6 ${isNight ? 'bg-slate-800/60' : 'bg-white/70'} -mt-6 ml-10`}></div>
          <div className={`w-18 h-5 ${isNight ? 'bg-slate-800/60' : 'bg-white/70'} -mt-5 ml-20`}></div>
        </div>
      </div>

      <div className="absolute top-36 left-0 animate-cloud-slow opacity-50" style={{ animationDelay: '-32s' }}>
        <div className={`relative w-64 h-14 ${isNight ? 'bg-slate-900/50' : 'bg-white/60'} flex flex-col justify-end`}>
          <div className={`w-36 h-7 ${isNight ? 'bg-slate-900/50' : 'bg-white/60'} -mt-7 ml-12`}></div>
          <div className={`w-20 h-5 ${isNight ? 'bg-slate-900/50' : 'bg-white/60'} -mt-5 ml-24`}></div>
        </div>
      </div>
    </div>
  );
};

