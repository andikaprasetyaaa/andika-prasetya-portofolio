import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MapPin, Radio, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { ABOUT, HERO, PROFILE, SECTIONS } from '../data/content';
import { scrollToSection } from '../lib/scroll';
import { useReducedMotionPref, useSettings, useUi } from '../lib/settings';
import { RADIO_STATIONS, sound } from '../lib/sound';
import { notify } from '../lib/toast';
import { EASE_OUT, StatusDot } from '../components/ui';

export const Hero: React.FC = () => {
  const reduced = useReducedMotionPref();
  const { booted } = useUi();
  const settings = useSettings();
  const ref = useRef<HTMLElement>(null);
  const station = RADIO_STATIONS[settings.station % RADIO_STATIONS.length] ?? RADIO_STATIONS[0];

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const go = (id: string) => {
    sound.click();
    scrollToSection(id);
  };

  const toggleRadio = () => {
    const on = sound.toggle();
    notify(on ? `PLAYING ${station.name} — ${station.track}` : 'GTA RADIO MUTED');
  };

  const nextStation = () => {
    const next = sound.nextStation();
    notify(`TUNED TO ${next.name} · ${next.track}`);
  };

  const show = booted;
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
          transition: { duration: 0.85, delay, ease: EASE_OUT },
        };

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/* Legibility gradient weighted to reading areas while keeping the 3D bay open */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(95deg, rgba(9,4,18,0.76) 0%, rgba(9,4,18,0.36) 52%, rgba(9,4,18,0.48) 100%), linear-gradient(180deg, rgba(9,4,18,0.32) 0%, transparent 35%, transparent 62%, rgba(9,5,18,0.84) 100%)',
        }}
      />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="shell relative z-10 my-auto flex flex-1 flex-col justify-center pb-24 pt-20 sm:pb-24 sm:pt-24"
      >
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Clean non-overlapping GTA VI Poster Lockup */}
          <div className="flex min-w-0 flex-col items-start lg:col-span-7">
            <motion.div {...rise(0.08)} className="flex flex-wrap items-center gap-3">
              <span className="chip !border-vice-pink/40 !bg-night-950/75 !py-1.5 !text-ink">
                <StatusDot tone="pink" ping />
                {PROFILE.availability}
              </span>
              <span className="inline-flex items-center gap-1.5 font-hud text-xs font-bold uppercase tracking-[0.2em] text-vice-gold sm:text-sm">
                <MapPin className="h-3.5 w-3.5 text-vice-coral" aria-hidden="true" />
                {SECTIONS[0].caption}
              </span>
              <span aria-hidden="true" className="vice-script hidden text-2xl sm:inline-block -rotate-3">
                Bali Portfolio
              </span>
            </motion.div>

            {/* Properly scaled Bebas Neue poster lockup that never overflows into the right column */}
            <div className="mt-4 w-full max-w-full overflow-hidden sm:mt-5">
              <h1
                id="hero-title"
                aria-label={PROFILE.name}
                className="font-poster font-normal uppercase leading-[0.88] tracking-[0.025em] text-[clamp(3.3rem,min(9.2vw,13.5vh),7.1rem)] gta-shadow"
              >
                {PROFILE.nameLines.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.03em]" aria-hidden="true">
                    <motion.span
                      className="block bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          i === 0
                            ? 'linear-gradient(180deg, #fffaf5 12%, #ffe3c8 68%, #ff9e7d 100%)'
                            : 'linear-gradient(100deg, #ffd98a 0%, #ff8a5c 35%, #ff5fa8 70%, #9d6bff 100%)',
                      }}
                      initial={reduced ? false : { y: '108%' }}
                      animate={reduced ? undefined : { y: show ? '0%' : '108%' }}
                      transition={{ duration: 0.95, delay: 0.14 + i * 0.1, ease: EASE_OUT }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>

            <motion.p
              {...rise(0.38)}
              className="mt-4 font-hud text-sm font-bold uppercase tracking-[0.22em] text-vice-gold sm:mt-5 sm:text-base"
            >
              {HERO.eyebrow} &mdash; {PROFILE.title}
            </motion.p>

            <motion.p
              {...rise(0.48)}
              className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base md:text-[1.05rem]"
              style={{ textShadow: '0 2px 16px rgba(9, 4, 18, 0.9)' }}
            >
              {HERO.lead}
            </motion.p>

            <motion.div {...rise(0.58)} className="mt-6 flex w-full flex-wrap items-center gap-3 sm:mt-7 sm:w-auto sm:gap-4">
              <button
                type="button"
                className="btn btn-primary flex-1 sm:flex-initial"
                onClick={() => go('projects')}
                onMouseEnter={() => sound.hover()}
              >
                {HERO.primaryCta}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn btn-ghost flex-1 sm:flex-initial"
                onClick={() => go('about')}
                onMouseEnter={() => sound.hover()}
              >
                {HERO.secondaryCta}
              </button>
            </motion.div>
          </div>

          {/* Right: GTA Radio Soundtrack Deck & Quick Vitals Card */}
          <motion.div {...rise(0.66)} className="min-w-0 lg:col-span-5">
            <div className="panel panel-accent overflow-hidden p-5 sm:p-6">
              {/* Live GTA Radio Station Deck */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <button
                    type="button"
                    onClick={toggleRadio}
                    aria-label={settings.sound ? 'Mute GTA radio' : 'Play GTA radio'}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform hover:scale-105 ${
                      settings.sound ? 'bg-sunset text-night-950 shadow-glow' : 'border border-white/15 bg-white/5 text-ink-mute'
                    }`}
                  >
                    {settings.sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Radio className="h-3.5 w-3.5 shrink-0 text-vice-pink" aria-hidden="true" />
                      <span className="truncate font-hud text-xs font-bold uppercase tracking-[0.18em] text-vice-amber">
                        {station.freq} &middot; {station.name}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-hud text-lg font-bold uppercase tracking-[0.06em] text-ink sm:text-xl">
                      {station.track}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className="hidden xs:flex items-end gap-[3px] h-5 px-1" aria-hidden="true">
                    {[0, 120, 240, 90, 200].map((d, idx) => (
                      <span
                        key={idx}
                        className={`w-[3px] rounded-full bg-sunset transition-all duration-300 ${
                          settings.sound ? 'h-full animate-pulse' : 'h-1.5 opacity-35'
                        }`}
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={nextStation}
                    aria-label="Next GTA theme track"
                    title="Switch GTA Theme Track"
                    className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 font-hud text-xs font-bold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-vice-amber/70 hover:text-ink"
                  >
                    <span>NEXT</span>
                    <SkipForward className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* 3 Responsive Protagonist Vitals */}
              <dl className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
                {ABOUT.metrics.map((m) => (
                  <div key={m.subtitle} className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-3 sm:px-3.5">
                    <dd className="stat-num text-2xl font-normal text-sunset sm:text-3xl">{m.value}</dd>
                    <dt className="mt-1 font-hud text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink sm:text-xs">
                      {m.unit}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        {...rise(0.95)}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden items-center justify-center gap-2.5 px-4 xl:flex [@media(max-height:740px)]:!hidden"
      >
        <ArrowDown className="h-4 w-4 text-vice-coral animate-bob" aria-hidden="true" />
        <span className="font-hud text-xs font-bold uppercase tracking-[0.26em] text-ink-soft">{HERO.scrollCue}</span>
      </motion.div>
    </section>
  );
};
