import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { HERO, PROFILE, SECTIONS } from '../data/content';
import { scrollToSection } from '../lib/scroll';
import { useReducedMotionPref, useUi } from '../lib/settings';
import { sound } from '../lib/sound';
import { EASE_OUT, StatusDot } from '../components/ui';

export const Hero: React.FC = () => {
  const reduced = useReducedMotionPref();
  const { booted } = useUi();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const charY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const opacity = useTransform(scrollYProgress, [0, 0.68], [1, 0]);

  const go = (id: string) => {
    sound.click();
    scrollToSection(id);
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
      {/* Legibility gradient weighted to the reading side while keeping the 3D sunset bay open behind the character */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(95deg, rgba(9,4,18,0.78) 0%, rgba(9,4,18,0.38) 50%, transparent 82%), linear-gradient(180deg, rgba(9,4,18,0.28) 0%, transparent 32%, transparent 64%, rgba(9,5,18,0.88) 100%)',
        }}
      />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="shell relative z-10 my-auto flex flex-1 flex-col justify-center pb-20 pt-20 sm:pb-16 sm:pt-24"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Left: GTA VI Poster Typography Lockup */}
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

            {/* Monumental Bebas Neue poster lockup */}
            <div className="mt-4 w-full max-w-full overflow-hidden sm:mt-5">
              <h1
                id="hero-title"
                aria-label={PROFILE.name}
                className="font-poster font-normal uppercase leading-[0.88] tracking-[0.025em] text-[clamp(3.3rem,min(9vw,13.5vh),7rem)] gta-shadow"
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
              className="mt-4 font-hud text-sm font-bold uppercase tracking-[0.2em] text-vice-gold sm:mt-5 sm:text-base"
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

          {/* Right: Frameless GTA VI Key-Art Character Cut-Out of Andika over the 3D Sunset Skyline */}
          <motion.div
            style={reduced ? undefined : { y: charY }}
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 32 }}
            animate={show || reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 32 }}
            transition={{ duration: 1.05, delay: 0.32, ease: EASE_OUT }}
            className="relative flex items-end justify-center lg:col-span-5"
          >
            {/* Subtle warm sunset rim aura behind the transparent character cutout */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-8 bottom-4 -z-10 rounded-full blur-3xl opacity-75"
              style={{
                background:
                  'radial-gradient(circle at 50% 42%, rgba(255, 138, 92, 0.42), rgba(255, 95, 168, 0.32) 48%, rgba(157, 107, 255, 0.12) 72%, transparent 85%)',
              }}
            />

            <img
              src="/andika-gta6.png"
              alt="I Putu Andika Prasetya — GTA VI Key-Art Portrait"
              className="pointer-events-none relative z-10 mx-auto h-auto max-h-[22rem] w-auto object-contain select-none xs:max-h-[25rem] sm:max-h-[29rem] lg:max-h-[36rem]"
              style={{
                filter:
                  'drop-shadow(0 22px 44px rgba(7, 3, 16, 0.9)) drop-shadow(0 0 24px rgba(255, 95, 168, 0.22))',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 86%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 86%, transparent 100%)',
              }}
            />
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
