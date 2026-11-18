import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Menu, Volume2, VolumeX } from 'lucide-react';
import { PROFILE, SECTIONS } from '../data/content';
import { scrollState, scrollToSection, onScrollFrame, useActiveSection } from '../lib/scroll';
import { uiStore, useSettings } from '../lib/settings';
import { sound } from '../lib/sound';
import { notify } from '../lib/toast';
import { StatusDot } from '../components/ui';

/** Fixed top HUD: brand, section tabs, quick actions and the page progress line. */
export const TopBar: React.FC = () => {
  const active = useActiveSection();
  const settings = useSettings();
  const barRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // progress line + "scrolled" state are driven straight from scroll, no re-renders
  useEffect(() => {
    const apply = () => {
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${scrollState.progress})`;
      if (barRef.current) barRef.current.dataset.scrolled = scrollState.y > 24 ? 'true' : 'false';
    };
    apply();
    return onScrollFrame(apply);
  }, []);

  const go = (id: string) => {
    sound.click();
    scrollToSection(id);
  };

  const toggleSound = () => {
    const on = sound.toggle();
    notify(on ? 'SOUND FX ENABLED' : 'SOUND FX MUTED');
  };

  const openMenu = () => {
    sound.open();
    uiStore.set({ menuOpen: true });
  };

  return (
    <header
      ref={barRef}
      data-scrolled="false"
      className="group/bar fixed inset-x-0 top-0 z-40 h-16 transition-colors duration-500 data-[scrolled=true]:bg-night-950/90 data-[scrolled=true]:backdrop-blur-md"
    >
      {/* soft top shade so the HUD stays legible over a bright sky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night-950/70 to-transparent transition-opacity duration-500 group-data-[scrolled=true]/bar:opacity-0"
      />

      <div className="relative flex h-full items-center justify-between gap-4 px-gutter">
        {/* brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go('hero')}
            onMouseEnter={() => sound.hover()}
            aria-label="Back to top"
            className="group flex items-center gap-3"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-[9px] bg-sunset p-px transition-transform duration-500 ease-out-expo group-hover:rotate-[-6deg] group-hover:scale-105">
              <span className="flex h-full w-full items-center justify-center rounded-[8px] bg-night-900">
                <span className="font-display text-lg leading-none text-sunset">{PROFILE.monogram}</span>
              </span>
            </span>
            <span className="font-display text-xl tracking-[0.08em] text-ink">{PROFILE.brand}</span>
          </button>
          <span className="chip hidden 2xl:inline-flex !border-vice-teal/30 !bg-vice-teal/10 !text-vice-mint">
            <StatusDot ping />
            {PROFILE.availability}
          </span>
        </div>

        {/* section tabs */}
        <nav aria-label="Sections" className="hidden xl:flex items-center gap-0.5">
          {SECTIONS.map((s, i) => {
            const isActive = active === i;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                onMouseEnter={() => sound.hover()}
                aria-current={isActive ? 'true' : undefined}
                className={`relative whitespace-nowrap px-3 py-2 font-hud text-[0.78rem] font-semibold tracking-[0.15em] transition-colors duration-300 ${
                  isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'
                }`}
              >
                <span className={isActive ? 'text-vice-amber' : ''}>{s.index}.</span> {s.label}
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-sunset"
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={settings.sound}
            aria-label={settings.sound ? 'Mute sound effects' : 'Enable sound effects'}
            title={settings.sound ? 'Sound on' : 'Sound off'}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-night-900/50 text-ink-soft transition-colors hover:border-vice-pink/60 hover:text-ink"
          >
            {settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <a
            href={PROFILE.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.click()}
            onMouseEnter={() => sound.hover()}
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            RESUME
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-night-900/50 px-3 font-hud text-[0.74rem] font-semibold tracking-[0.16em] text-ink-soft transition-colors hover:border-vice-pink/60 hover:text-ink"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">MENU</span>
            <kbd className="hidden xl:inline rounded border border-white/15 px-1.5 py-0.5 text-[0.62rem] text-ink-mute">M</kbd>
          </button>
        </div>
      </div>

      {/* page progress */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]">
        <div ref={progressRef} className="h-full origin-left bg-sunset" style={{ transform: 'scaleX(0)' }} />
      </div>
    </header>
  );
};
