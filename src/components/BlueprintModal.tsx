import React, { useEffect } from 'react';
import { Project } from '../types';
import { audioManager } from '../utils/audioManager';
import { X, ExternalLink, Activity, Layers, Star, Code2 } from 'lucide-react';

interface BlueprintModalProps {
  theme: 'day' | 'night';
  project: Project | null;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  theme,
  project,
  onClose,
}) => {
  const isNight = theme === 'night';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`border-2 max-w-2xl w-full flex flex-col gap-6 shadow-2xl relative p-6 md:p-8 overflow-hidden transition-colors ${
          isNight
            ? 'bg-[#181824] border-[#58a038] text-white'
            : 'bg-white border-[#58a038] text-[#0f172a]'
        }`}
      >
        {/* Modal Top Bar */}
        <div
          className={`flex items-center justify-between pb-3 border-b px-4 py-2.5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 ${
            isNight
              ? 'bg-black/60 border-slate-800'
              : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#58a038] animate-pulse"></span>
            <span
              className={`font-pixel text-[10px] ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              SCHEMATIC // {project.strata}
            </span>
          </div>
          <button
            onClick={() => {
              audioManager.playClickSound();
              onClose();
            }}
            className={`px-2.5 py-1 font-pixel text-[9px] uppercase transition-colors flex items-center gap-1 border ${
              isNight
                ? 'bg-slate-800 hover:bg-[#58a038] text-slate-300 hover:text-black border-slate-700'
                : 'bg-slate-200 hover:bg-[#58a038] text-slate-800 hover:text-black border-slate-300'
            }`}
          >
            <span>[ESC : CLOSE]</span>
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Blueprint Header */}
        <div className="flex flex-col gap-1 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-silkscreen text-xs text-[#58a038] font-bold">
              {project.category}
            </span>
            <span className={isNight ? 'text-slate-600' : 'text-slate-400'}>•</span>
            <span className="font-silkscreen text-xs text-amber-500 flex items-center gap-1 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {project.starsCount} Stars
            </span>
          </div>
          <h2
            className={`font-pixel text-base md:text-lg mt-1 leading-snug ${
              isNight ? 'text-white' : 'text-[#0f172a]'
            }`}
          >
            {project.title}
          </h2>
          <span
            className={`font-silkscreen text-xs ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            repo: {project.repoName}
          </span>
        </div>

        {/* Telemetry Benchmarks Box */}
        <div
          className={`border p-4 flex flex-col gap-2 ${
            isNight
              ? 'bg-black/70 border-slate-800'
              : 'bg-slate-50 border-slate-200 shadow-inner'
          }`}
        >
          <span className="font-silkscreen text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#58a038]" />
            TELEMETRY SPECIFICATIONS &amp; BENCHMARKS
          </span>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {project.telemetry.map((t) => (
              <div
                key={t.label}
                className={`flex flex-col p-2 border ${
                  isNight
                    ? 'bg-[#14141d] border-slate-800/80'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <span className="font-silkscreen text-[9px] text-slate-500 uppercase">
                  {t.label}
                </span>
                <span className="font-silkscreen text-xs text-[#58a038] font-bold mt-0.5">
                  {t.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture Description */}
        <div className="flex flex-col gap-1.5">
          <span className="font-silkscreen text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-500" />
            SYSTEM ARCHITECTURE &amp; DEPLOYMENT
          </span>
          <p
            className={`font-silkscreen text-xs leading-relaxed p-3 border ${
              isNight
                ? 'text-slate-300 bg-black/40 border-slate-800/70'
                : 'text-slate-700 bg-slate-50 border-slate-200'
            }`}
          >
            {project.fullOverview}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-silkscreen text-[10px] text-slate-500 mr-1 flex items-center gap-1">
            <Code2 className="w-3 h-3 text-purple-500" />
            STACK:
          </span>
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className={`px-2 py-0.5 border font-silkscreen text-[9px] ${
                isNight
                  ? 'bg-black/60 border-slate-700 text-slate-300'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between pt-3 border-t ${
            isNight ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioManager.playClickSound()}
            className={`px-4 py-2 font-pixel text-[10px] uppercase transition-colors flex items-center gap-2 border ${
              isNight
                ? 'bg-slate-800 hover:bg-[#58a038] text-white hover:text-black border-slate-700'
                : 'bg-slate-100 hover:bg-[#58a038] text-slate-900 hover:text-black border-slate-300'
            }`}
          >
            <span>VIEW ON GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              audioManager.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-[#58a038] hover:bg-[#46822c] text-black font-pixel text-[10px] font-bold uppercase transition-colors shadow-md"
          >
            DISMISS VIEWPORT
          </button>
        </div>
      </div>
    </div>
  );
};