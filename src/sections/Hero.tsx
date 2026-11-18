import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Activity, ArrowDown, Cpu, Zap } from 'lucide-react';
import { HERO, PROFILE, SECTIONS } from '../data/content';
import { scrollToSection } from '../lib/scroll';
import { useReducedMotionPref, useUi } from '../lib/settings';
import { sound } from '../lib/sound';
import { EASE_OUT, StatusDot } from '../components/ui';

const METRIC_ICONS = [Cpu, Activity, Zap];

export const Hero: React.FC = () => {
  const reduced = useReducedMotionPref();
  const { booted } = useUi();
  const ref = useRef<HTMLElement>(null);
  const [role, setRole] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setRole((r) => (r + 1) % HERO.roles.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  // the title block drifts up and fades as the camera pushes into the bay
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  const go = (id: string) => {
    sound.click();
    scrollToSection(id);
  };

  // entrance choreography starts once the loading curtain lifts
  const show = booted;
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
          transition: { duration: 0.9, delay, ease: EASE_OUT },
        };

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/* legibility shading: darker on the reading side and at the foot of the frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night-950/35 sm:hidden" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(9,4,18,0.5) 0%, transparent 38%), linear-gradient(180deg, transparent 58%, rgba(9,5,18,0.78) 100%)',
        }}
      />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="shell relative z-10 flex flex-1 flex-col justify-center gap-[clamp(0.9rem,2.3vh,1.6rem)] pb-[clamp(4.5rem,11vh,7rem)] pt-[clamp(5rem,11vh,7rem)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-28 -left-[22%] -z-10 w-[108%]"
          style={{ background: 'radial-gradient(closest-side, rgba(9,4,18,0.80) 0%, rgba(9,4,18,0.52) 52%, transparent 100%)' }}
        />
        {/* telemetry line */}
        <motion.div {...rise(0.05)} className="hidden items-center gap-x-4 gap-y-1 md:flex md:flex-wrap [@media(max-height:760px)]:!hidden" style={{ textShadow: '0 1px 10px rgba(9, 4, 18, 0.8)' }}>
          <span className="hud-label !text-ink-soft">{HERO.telemetry.loc}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-vice-pink" />
          <span className="hud-label !text-ink-soft">{HERO.telemetry.node}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-vice-pink" />
          <span className="hud-label !text-ink-soft">{HERO.telemetry.security}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-vice-pink" />
          <span className="hud-label !text-ink">{HERO.telemetry.verified}</span>
        </motion.div>

        <div className="flex max-w-[54rem] flex-col items-start gap-[clamp(0.9rem,2.3vh,1.6rem)]">
          <motion.p {...rise(0.12)} className="chip !whitespace-normal !border-white/15 !bg-night-950/55 !py-1.5 !text-ink">
            <StatusDot tone="pink" ping />[ {SECTIONS[0].index} // {SECTIONS[0].caption} ]
          </motion.p>

          {/* name lockup */}
          <div className="relative mb-[clamp(0.6rem,2vh,1.4rem)]">
            <h1
              id="hero-title"
              aria-label={PROFILE.name}
              className="font-display uppercase leading-[0.9] tracking-[0.005em] text-[clamp(3rem,min(13.6vw,15.2vh),10rem)]"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(12, 4, 22, 0.55))' }}
            >
              {PROFILE.nameLines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
                  <motion.span
                    className="block bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        i === 0
                          ? 'linear-gradient(180deg, #fffaf0 8%, #ffe2c2 62%, #ffb7a4 100%)'
                          : 'linear-gradient(180deg, #ffe9cf 0%, #ffb49a 46%, #ff6fa9 100%)',
                    }}
                    initial={reduced ? false : { y: '108%' }}
                    animate={reduced ? undefined : { y: show ? '0%' : '108%' }}
                    transition={{ duration: 1.05, delay: 0.18 + i * 0.1, ease: EASE_OUT }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.span
              aria-hidden="true"
              className="neon-script pointer-events-none absolute -bottom-[0.3em] left-[50%] -rotate-[7deg] whitespace-nowrap text-[clamp(1.9rem,5.6vw,4.6rem)] leading-none sm:left-[56%]"
              initial={reduced ? false : { opacity: 0, scale: 0.9, x: -12 }}
              animate={show || reduced ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: -12 }}
              transition={{ duration: 0.9, delay: 0.72, ease: EASE_OUT }}
            >
              Portfolio
            </motion.span>
          </div>

          <motion.div {...rise(0.5)} className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-hud text-[0.86rem] font-semibold uppercase tracking-[0.3em] text-ink sm:text-[0.98rem]">
              {PROFILE.title}
            </p>
            <span aria-hidden="true" className="hidden h-px w-10 bg-white/30 sm:block" />
          </motion.div>

          {/* rotating role */}
          <motion.div
            {...rise(0.58)}
            className="inline-flex items-center gap-3 rounded-md border border-white/12 bg-night-950/60 py-2.5 pl-4 pr-5"
          >
            <span className="hud-label">ROLE //</span>
            <span className="relative block h-6 w-[13.5rem] overflow-hidden sm:w-[15rem]" aria-live="off">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={role}
                  className="absolute inset-0 flex items-center font-hud text-[0.98rem] font-bold tracking-[0.16em] text-vice-gold"
                  initial={reduced ? false : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -18, opacity: 0 }}
                  transition={{ duration: 0.38, ease: EASE_OUT }}
                >
                  {HERO.roles[role]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.p {...rise(0.66)} className="max-w-xl text-[1.02rem] leading-relaxed text-ink sm:text-[1.08rem]" style={{ textShadow: '0 1px 14px rgba(9, 4, 18, 0.75)' }}>
            {HERO.lead}
          </motion.p>

          <motion.div {...rise(0.74)} className="flex flex-wrap items-center gap-4 pl-1.5 pt-1">
            <button type="button" className="btn btn-primary" onClick={() => go('projects')} onMouseEnter={() => sound.hover()}>
              {HERO.primaryCta}
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => go('about')} onMouseEnter={() => sound.hover()}>
              <StatusDot tone="teal" />
              {HERO.secondaryCta}
            </button>
          </motion.div>

          {/* headline metrics */}
          <motion.ul
            {...rise(0.84)}
            className="mt-1 grid w-full max-w-[41rem] grid-cols-3 gap-x-3 rounded-lg border border-white/10 bg-night-950/60 px-3.5 py-3 sm:gap-x-7 sm:px-5"
          >
            {HERO.metrics.map((m, i) => {
              const Icon = METRIC_ICONS[i];
              return (
                <li key={m.label} className="flex items-center gap-3">
                  <Icon className="hidden h-4 w-4 shrink-0 text-vice-pink sm:block" aria-hidden="true" />
                  <span>
                    <span className="stat-num block whitespace-nowrap text-[1.25rem] text-ink sm:text-[1.45rem]">{m.value}</span>
                    <span className="hud-label mt-1 block !text-[0.6rem] !leading-snug !tracking-[0.12em] sm:!text-[0.66rem] sm:!tracking-[0.16em]">
                      {m.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        {...rise(1.1)}
        className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-3 px-4 [@media(max-height:780px)]:!hidden"
      >
        <span aria-hidden="true" className="flex h-8 w-5 shrink-0 items-start justify-center rounded-full border border-white/45 pt-1.5">
          <span className="h-1.5 w-1 rounded-full bg-vice-pink animate-bob" />
        </span>
        <span className="hud-label text-ink-soft">{HERO.scrollCue}</span>
      </motion.div>
    </section>
  );
};
