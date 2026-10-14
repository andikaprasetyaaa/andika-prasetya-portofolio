import React from 'react';
import { scrollToSection } from '../lib/lenis';
import { soundManager } from './SoundManager';

interface SlideProgressProps {
  currentSection: number; // 1 to 6
}

export const SlideProgress: React.FC<SlideProgressProps> = ({ currentSection }) => {
  const sections = ['hero', 'about', 'projects', 'stack', 'timeline', 'contact'];

  const handleClick = (idx: number) => {
    soundManager.playClick();
    scrollToSection(sections[idx]);
  };

  const progressPercent = Math.min(100, Math.max(0, ((currentSection - 1) / 5) * 100));

  return (
    <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-space-md select-none">
      {/* Monospace Section Counter */}
      <span className="font-mono text-[9px] text-[#e5e2e1] tracking-widest">
        0{currentSection} / 06
      </span>

      {/* Progress Track Line */}
      <div className="w-px h-16 bg-[#2a2a2a] relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-white transition-all duration-300 ease-out"
          style={{ height: `${progressPercent}%` }}
        />
      </div>

      {/* 6 Section Dots */}
      <div className="flex flex-col gap-2">
        {sections.map((sec, idx) => {
          const isActive = currentSection === idx + 1;
          return (
            <button
              key={sec}
              onClick={() => handleClick(idx)}
              aria-label={`Jump to section ${idx + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? 'bg-white scale-125' : 'bg-[#353534] hover:bg-[#8e9192]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

