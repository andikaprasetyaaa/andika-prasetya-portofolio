import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotionPref } from '../lib/settings';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, [data-cursor="link"]';

/**
 * A soft reticle that trails the pointer and opens up over anything clickable.
 * The native cursor stays visible — this only adds feedback, it never replaces it.
 */
export const Cursor: React.FC = () => {
  const reduced = useReducedMotionPref();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;

    let isHot = false;
    let isVisible = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) {
        isVisible = true;
        setVisible(true);
      }
      const target = e.target as Element | null;
      const next = Boolean(target?.closest?.(INTERACTIVE));
      if (next !== isHot) {
        isHot = next;
        setHot(next);
      }
    };
    const leave = () => {
      isVisible = false;
      setVisible(false);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [x, y]);

  if (!enabled || reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
        animate={{
          width: hot ? 44 : 26,
          height: hot ? 44 : 26,
          opacity: visible ? (hot ? 0.95 : 0.5) : 0,
          borderColor: hot ? 'rgba(255, 95, 168, 0.9)' : 'rgba(255, 240, 250, 0.55)',
          backgroundColor: hot ? 'rgba(255, 95, 168, 0.10)' : 'rgba(255, 95, 168, 0)',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    </motion.div>
  );
};
