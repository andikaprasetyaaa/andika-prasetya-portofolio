import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Menu, Radio, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { PROFILE, SECTIONS } from '../data/content';
import { scrollState, scrollToSection, onScrollFrame, useActiveSection } from '../lib/scroll';
import { uiStore, useSettings } from '../lib/settings';
import { RADIO_STATIONS, sound } from '../lib/sound';
import { notify } from '../lib/toast';
import { StatusDot } from '../components/ui';

/** Fixed GTA VI header + mobile/tablet bottom fast-travel dock + live Vice FM radio controller. */
export const TopBar: React.FC = () => {
  const active = useActiveSection();
  const settings = useSettings();
  const barRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const station = RADIO_STATIONS[settings.station % RADIO_STATIONS.length] ?? RADIO_STATIONS[0];

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
    notify(on ? `PLAYING — ${station.track}` : 'RADIO & AUDIO MUTED');
  };

  const switchStation = () => {
    const next = sound.nextStation();
    notify(`TUNED TO ${next.name} — ${next.track}`);
  };

  const openMenu = () => {
    sound.open();
    uiStore.set({ menuOpen: true });
  };

  return (
    <>
      <header
        ref={barRef}
        data-scrolled="false"
        className="group/bar fixed inset-x-0 top-0 z-40 h-14 sm:h-16 transition-colors duration-500 data-[scrolled=true]:bg-night-950/90 data-[scrolled=true]:backdrop-blur-md"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night-950/75 to-transparent transition-opacity duration-500 group-data-[scrolled=true]/bar:opacity-0"
        />

        <div className="relative flex h-full items-center justify-between gap-2 px-3.5 sm:gap-4 sm:px-gutter">
          {/* GTA VI Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go('hero')}
              onMouseEnter={() => sound.hover()}
              aria-label="Back to top"
              className="group flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sunset p-[1.5px] shadow-glow sm:h-9 sm:w-9">
                <span className="flex h-full w-full items-center justify-center rounded-[7px] bg-night-950 font-poster font-normal text-base leading-none text-sunset sm:text-lg">
                  AP
                </span>
              </span>
              <span className="font-poster font-normal text-xl uppercase tracking-[0.08em] text-ink sm:text-2xl">
                {PROFILE.brand}
              </span>
              <span className="vice-script hidden text-lg sm:inline-block -rotate-3">Bali</span>
            </button>
            <span className="chip hidden 2xl:inline-flex !border-vice-teal/30 !bg-vice-teal/10 !text-vice-mint">
              <StatusDot ping />
              {PROFILE.availability}
            </span>
          </div>

          {/* Desktop chapter nav */}
          <nav aria-label="Sections" className="hidden xl:flex items-center gap-1">
            {SECTIONS.map((s, i) => {
              const isActive = active === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(s.id)}
                  onMouseEnter={() => sound.hover()}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative whitespace-nowrap px-3.5 py-2 font-hud text-[0.92rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'
                  }`}
                >
                  <span className={isActive ? 'text-vice-coral' : 'text-ink-faint'}>{s.index}</span> {s.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-sunset"
                      transition={{ type: 'spring', stiffness: 440, damping: 38 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* GTA VI Radio Deck + Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Interactive Radio Station Widget */}
            <div className="flex items-center overflow-hidden rounded-full border border-white/15 bg-night-900/75 backdrop-blur-md">
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={settings.sound}
                aria-label={settings.sound ? 'Mute GTA radio music' : 'Play GTA radio music'}
                title={settings.sound ? `Playing ${station.name} (${station.freq}) — Click to mute` : 'Click to play GTA VI Radio BGM'}
                className={`flex h-9 items-center gap-2 px-3 font-hud text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                  settings.sound ? 'text-ink hover:text-vice-gold' : 'text-ink-mute hover:text-ink'
                }`}
              >
                {settings.sound ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-vice-pink" />
                    <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
                      <span className="w-[2px] h-full bg-vice-amber animate-pulse" />
                      <span className="w-[2px] h-2 bg-vice-pink animate-pulse [animation-delay:150ms]" />
                      <span className="w-[2px] h-3 bg-vice-teal animate-pulse [animation-delay:300ms]" />
                    </span>
                  </>
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
                <span className="hidden xs:inline">{settings.sound ? station.name : 'RADIO OFF'}</span>
              </button>
              <button
                type="button"
                onClick={switchStation}
                aria-label="Next radio station"
                title={`Switch station (Current: ${station.name} ${station.freq})`}
                className="flex h-9 w-8 items-center justify-center border-l border-white/10 text-ink-soft transition-colors hover:bg-white/10 hover:text-vice-gold"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>

            <a
              href={PROFILE.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              className="btn btn-primary btn-sm hidden md:inline-flex"
            >
              RESUME
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={openMenu}
              aria-label="Open menu"
              aria-haspopup="dialog"
              className="flex h-9 items-center gap-2 rounded-full border border-white/15 bg-night-900/75 px-3 font-hud text-xs font-bold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-vice-amber/70 hover:text-ink sm:px-3.5"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">MENU</span>
            </button>
          </div>
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]">
          <div ref={progressRef} className="h-full origin-left bg-sunset" style={{ transform: 'scaleX(0)' }} />
        </div>
      </header>

      {/* Dynamic Mobile & Tablet Floating Bottom Chapter Dock (< xl) */}
      <nav
        aria-label="Quick section navigation"
        className="fixed inset-x-0 bottom-3 z-30 mx-auto flex max-w-[94vw] items-center justify-between gap-1 overflow-x-auto rounded-full border border-white/15 bg-night-950/90 px-2 py-1.5 shadow-[0_16px_40px_rgba(4,2,10,0.9)] backdrop-blur-xl sm:max-w-md xl:hidden no-scrollbar"
      >
        {SECTIONS.map((s, i) => {
          const isActive = active === i;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 font-hud text-[0.72rem] font-bold uppercase tracking-[0.12em] transition-colors sm:px-3 sm:text-xs ${
                isActive ? 'bg-sunset text-night-950 shadow-glow' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <span>{s.index}</span>
              <span className="hidden xs:inline">{s.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={switchStation}
          aria-label="Switch GTA radio station"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-vice-pink/40 bg-vice-pink/15 text-vice-pink"
          title="Next Radio Station"
        >
          <Radio className="h-3.5 w-3.5" />
        </button>
      </nav>
    </>
  );
};
