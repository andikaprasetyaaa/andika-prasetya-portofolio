import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { ABOUT, PROFILE } from '../data/content';
import { useReducedMotionPref } from '../lib/settings';
import { sound } from '../lib/sound';
import { EASE_OUT } from '../components/ui';

const TIPS = [
  'VICE FM 86.9 — SYNTHWAVE SUNSET RADIO STARTS ON ENTRY',
  'PRESS M TO OPEN THE PAUSE MENU AT ANY TIME',
  'PRESS 1 TO 6 TO FAST-TRAVEL BETWEEN CHAPTERS',
  `${ABOUT.metrics[0].value} GPA · UNIVERSITAS UDAYANA`,
  `${ABOUT.metrics[1].value} PRODUCTION AI SYSTEMS SHIPPED`,
];

interface Props {
  ready: boolean;
  onLift: () => void;
  onDone: () => void;
}

/** GTA VI Key-Art boot screen. Entering or skipping automatically starts the Vice FM sunset soundtrack. */
export const LoadingScreen: React.FC<Props> = ({ ready, onLift, onDone }) => {
  const reduced = useReducedMotionPref();
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(0);
  const [show, setShow] = useState(true);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    let raf = 0;
    let value = 0;
    const started = performance.now();
    const MIN_TIME = 1000;
    const tick = (now: number) => {
      const elapsed = now - started;
      const canFinish = readyRef.current && elapsed > MIN_TIME;
      const target = canFinish ? 100 : Math.min(92, 18 + elapsed / 38);
      value += (target - value) * (canFinish ? 0.2 : 0.06);
      if (canFinish && value > 99.4) {
        setProgress(100);
        window.setTimeout(() => setShow(false), 160);
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

  useEffect(() => {
    const skip = () => {
      sound.startMusic();
      setShow(false);
    };
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
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-night-950 cursor-pointer"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: reduced ? 0.3 : 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 55% at 70% 78%, rgba(255,138,92,0.34), transparent 70%), radial-gradient(60% 50% at 30% 20%, rgba(157,107,255,0.25), transparent 70%), linear-gradient(180deg, #120a26 0%, #1d0f38 45%, #3a153f 78%, #5a1f3f 100%)',
            }}
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-sunset" />

          <div className="relative flex flex-1 flex-col justify-between px-5 py-8 sm:px-gutter sm:py-12">
            <div className="flex items-center justify-between gap-4">
              <span className="chip !border-vice-pink/40 !bg-vice-pink/15 !text-ink">
                <Radio className="h-3.5 w-3.5 text-vice-pink animate-pulse" />
                VICE FM 86.9 READY
              </span>
              <span className="font-hud hidden text-sm font-semibold uppercase tracking-[0.22em] text-ink-mute sm:block">
                {PROFILE.coords}
              </span>
            </div>

            <div className="my-auto max-w-5xl py-6">
              <p className="vice-script text-3xl sm:text-5xl -rotate-2 origin-left">Gianyar, Bali</p>
              <div className="overflow-hidden mt-2">
                <motion.p
                  className="font-poster font-normal uppercase leading-[0.88] tracking-[0.02em] text-sunset text-[clamp(3.1rem,11vw,8.5rem)] gta-shadow"
                  initial={reduced ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.06, ease: EASE_OUT }}
                >
                  {PROFILE.name}
                </motion.p>
              </div>
              <p className="mt-3 font-hud text-sm font-bold uppercase tracking-[0.26em] text-vice-gold sm:text-base">
                {PROFILE.title}
              </p>
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="w-full max-w-md">
                <div className="flex items-end justify-between">
                  <span className="font-hud text-xs font-bold uppercase tracking-[0.22em] text-ink-soft">LOADING WORLD SCENE</span>
                  <span className="font-poster text-3xl tabular-nums text-ink">{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
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
                    className="font-hud text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft sm:text-sm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {TIPS[tip]}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-1.5 font-hud text-xs font-bold uppercase tracking-[0.2em] text-vice-amber">
                  CLICK OR PRESS ANY KEY TO ENTER (STARTS GTA RADIO)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
