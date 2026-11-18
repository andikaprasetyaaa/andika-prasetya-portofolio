import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ABOUT, PROFILE } from '../data/content';
import { useReducedMotionPref } from '../lib/settings';
import { EASE_OUT } from '../components/ui';

const TIPS = [
  'TIP — PRESS M TO OPEN THE MENU AT ANY TIME',
  'TIP — PRESS 1 TO 6 TO FAST-TRAVEL BETWEEN SECTIONS',
  `INTEL — ${ABOUT.metrics[0].value} ${ABOUT.metrics[0].unit} · ${ABOUT.metrics[0].subtitle.toUpperCase()}`,
  `INTEL — ${ABOUT.metrics[1].value} ${ABOUT.metrics[1].unit.toUpperCase()} ${ABOUT.metrics[1].subtitle.toUpperCase()}`,
  'TIP — THE SUN SETS AS YOU SCROLL. KEEP GOING.',
];

interface Props {
  /** True once the world and fonts are ready */
  ready: boolean;
  /** Called the moment the curtain starts to lift (the page behind should start its entrance) */
  onLift: () => void;
  /** Called when the curtain has fully lifted */
  onDone: () => void;
}

/** Game-style boot screen. It lifts as soon as the world has rendered — click or press any key to skip. */
export const LoadingScreen: React.FC<Props> = ({ ready, onLift, onDone }) => {
  const reduced = useReducedMotionPref();
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(0);
  const [show, setShow] = useState(true);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  // Progress eases towards 92% while loading, then completes.
  useEffect(() => {
    let raf = 0;
    let value = 0;
    const started = performance.now();
    const MIN_TIME = 1100;
    const tick = (now: number) => {
      const elapsed = now - started;
      const canFinish = readyRef.current && elapsed > MIN_TIME;
      const target = canFinish ? 100 : Math.min(92, 18 + elapsed / 38);
      value += (target - value) * (canFinish ? 0.2 : 0.06);
      if (canFinish && value > 99.4) {
        setProgress(100);
        window.setTimeout(() => setShow(false), 180);
        return;
      }
      setProgress(value);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTip((t) => (t + 1) % TIPS.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!show) onLift();
  }, [show, onLift]);

  // any key / click skips the intro
  useEffect(() => {
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="boot"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-night-950"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: reduced ? 0.3 : 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* dusk glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 55% at 70% 78%, rgba(255,138,92,0.30), transparent 70%), radial-gradient(60% 50% at 30% 20%, rgba(157,107,255,0.22), transparent 70%), linear-gradient(180deg, #120a26 0%, #1d0f38 45%, #3a153f 78%, #5a1f3f 100%)',
            }}
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-sunset" />

          <div className="relative flex flex-1 flex-col justify-between px-gutter py-10 sm:py-14">
            <div className="flex items-center justify-between">
              <span className="hud-label text-ink-soft">{PROFILE.brand} // BOOT SEQUENCE</span>
              <span className="hud-label hidden sm:block">{PROFILE.coords}</span>
            </div>

            <div className="max-w-5xl">
              <motion.p
                className="neon-script text-4xl sm:text-6xl -rotate-3 origin-left"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                Portfolio
              </motion.p>
              <div className="overflow-hidden">
                <motion.p
                  className="mt-3 font-display uppercase leading-[0.92] text-sunset text-[clamp(2.6rem,9vw,7.5rem)]"
                  initial={reduced ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08, ease: EASE_OUT }}
                >
                  {PROFILE.name}
                </motion.p>
              </div>
              <p className="hud-label mt-5 text-ink-soft !tracking-[0.3em]">{PROFILE.title}</p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="w-full max-w-md">
                <div className="flex items-end justify-between">
                  <span className="hud-label text-ink">LOADING WORLD</span>
                  <span className="font-display text-3xl tabular-nums text-ink">{Math.round(progress)}%</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full origin-left rounded-full bg-sunset"
                    style={{ transform: `scaleX(${progress / 100})`, transition: 'transform 0.12s linear' }}
                  />
                </div>
              </div>
              <div className="min-h-[2.6rem] md:max-w-sm md:text-right">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tip}
                    className="hud-label !leading-relaxed text-ink-soft"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                  >
                    {TIPS[tip]}
                  </motion.p>
                </AnimatePresence>
                <p className="hud-label mt-2">CLICK OR PRESS ANY KEY TO SKIP</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
