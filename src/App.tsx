import React, { useState, useEffect } from 'react';
import { TerrariaHeader } from './components/TerrariaHeader';
import { StrataSurfaceHero } from './components/StrataSurfaceHero';
import { StrataTopsoil } from './components/StrataTopsoil';
import { StrataProjects } from './components/StrataProjects';
import { StrataTechConduits } from './components/StrataTechConduits';
import { StrataCareerLogs } from './components/StrataCareerLogs';
import { StrataObsidianCore } from './components/StrataObsidianCore';
import { SoundtrackHUD } from './components/SoundtrackHUD';
import { LateralAltitudeHUD } from './components/LateralAltitudeHUD';
import { TerrariaFooter } from './components/TerrariaFooter';
import { BlueprintModal } from './components/BlueprintModal';
import { Project } from './types';
import { audioManager } from './utils/audioManager';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'day' | 'night'>('night');
  const [currentAltitude, setCurrentAltitude] = useState<string>('+120m');
  const [activeBlueprint, setActiveBlueprint] = useState<Project | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'night') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    const nextTheme = theme === 'day' ? 'night' : 'day';
    setTheme(nextTheme);
    audioManager.switchTheme(nextTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const sections = [
        { id: 'strata-surface', label: '+120m' },
        { id: 'strata-topsoil', label: '000m' },
        { id: 'strata-labs', label: '-140m' },
        { id: 'strata-conduits', label: '-380m' },
        { id: 'strata-logs', label: '-720m' },
        { id: 'strata-core', label: '-1250m' },
      ];

      let current = '+120m';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPos) {
          current = sec.label;
        }
      }
      setCurrentAltitude(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'night' ? 'bg-[#0a0a0f] text-slate-100' : 'bg-[#e2e8f0] text-slate-900'}`}>
      <TerrariaHeader
        theme={theme}
        onThemeToggle={handleThemeToggle}
        currentAltitude={currentAltitude}
      />

      <main className="w-full relative pb-16">
        <StrataSurfaceHero theme={theme} />
        <StrataTopsoil theme={theme} />
        <StrataProjects theme={theme} onOpenBlueprint={(p) => setActiveBlueprint(p)} />
        <StrataTechConduits theme={theme} />
        <StrataCareerLogs theme={theme} />
        <StrataObsidianCore theme={theme} onThemeToggle={handleThemeToggle} />
      </main>

      <SoundtrackHUD theme={theme} onThemeToggle={handleThemeToggle} />
      <LateralAltitudeHUD theme={theme} currentAltitude={currentAltitude} />
      <TerrariaFooter theme={theme} />

      <BlueprintModal
        theme={theme}
        project={activeBlueprint}
        onClose={() => setActiveBlueprint(null)}
      />
    </div>
  );
};

export default App;

