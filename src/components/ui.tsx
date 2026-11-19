import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SECTIONS, type SectionId } from '../data/content';
import { useReducedMotionPref } from '../lib/settings';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Reveal — fade/slide a block in the first time it scrolls into view  */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Starting offset in px */
  y?: number;
  x?: number;
  as?: 'div' | 'li' | 'article' | 'header' | 'footer' | 'p' | 'span';
}

export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 26, x = 0, as = 'div' }) => {
  const reduced = useReducedMotionPref();
  const Comp = motion[as] as typeof motion.div;
  if (reduced) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -70px 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  );
};

/* ------------------------------------------------------------------ */
/* CountUp — numbers roll up like a score tally                        */
/* ------------------------------------------------------------------ */

function parseValue(raw: string) {
  const match = raw.match(/^([^0-9]*)([0-9][0-9.,]*)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const clean = num.replace(/,/g, '');
  const value = Number(clean);
  if (Number.isNaN(value)) return null;
  const decimals = clean.includes('.') ? clean.split('.')[1].length : 0;
  const padTo = decimals === 0 && clean.length > 1 && clean.startsWith('0') ? clean.length : 0;
  return { prefix, value, suffix, decimals, padTo, grouped: num.includes(',') };
}

export const CountUp: React.FC<{ value: string; className?: string; duration?: number }> = ({
  value,
  className,
  duration = 1.5,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const reduced = useReducedMotionPref();
  const parsed = parseValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || reduced || !inView) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const format = (n: number) => {
      let s = n.toFixed(parsed.decimals);
      if (parsed.padTo) s = s.padStart(parsed.padTo, '0');
      if (parsed.grouped) s = Number(s).toLocaleString('en-US');
      return `${parsed.prefix}${s}${parsed.suffix}`;
    };
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(format(parsed.value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setDisplay(format(0));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="inline-grid" aria-label={value}>
      {/* a hidden twin reserves the final size so the layout never jitters while counting */}
      <span className={`invisible col-start-1 row-start-1 ${className ?? ''}`} aria-hidden="true">
        {value}
      </span>
      <span className={`col-start-1 row-start-1 whitespace-nowrap ${className ?? ''}`} aria-hidden="true">
        {display}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Tilt — subtle pointer-driven 3D tilt with a moving sheen            */
/* ------------------------------------------------------------------ */

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees */
  max?: number;
  style?: React.CSSProperties;
}

export const Tilt: React.FC<TiltProps> = ({ children, className, max = 7, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      el.style.setProperty('--sheen', '1');
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--sheen', '0');
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div style={{ perspective: '1100px' }} className="h-full">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={className}
        style={{
          transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          ...style,
        }}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            opacity: 'var(--sheen, 0)',
            transition: 'opacity 0.4s ease',
            background:
              'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 214, 240, 0.13), transparent 55%)',
          }}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section chrome                                                      */
/* ------------------------------------------------------------------ */

export const StatusDot: React.FC<{ tone?: 'teal' | 'pink' | 'amber'; ping?: boolean; className?: string }> = ({
  tone = 'teal',
  ping = false,
  className = '',
}) => {
  const color = tone === 'teal' ? 'bg-vice-teal' : tone === 'pink' ? 'bg-vice-pink' : 'bg-vice-amber';
  return (
    <span className={`relative inline-flex h-2 w-2 shrink-0 ${className}`} aria-hidden="true">
      {ping && <span className={`absolute inset-0 rounded-full ${color} animate-ping-soft`} />}
      <span className={`relative h-2 w-2 rounded-full ${color}`} />
    </span>
  );
};

/**
 * GTA VI chapter opener: neon script accent + chapter index, bold Oswald/Bebas Neue headline,
 * and optional right-hand controls slot. Responsive across mobile, tablet, and ultrawide.
 */
export const ChapterTitle: React.FC<{
  id: SectionId;
  titleId?: string;
  heading: React.ReactNode;
  lead?: string;
  right?: React.ReactNode;
}> = ({ id, titleId, heading, lead, right }) => {
  const meta = SECTIONS.find((s) => s.id === id)!;
  const scriptWord = meta.label.charAt(0) + meta.label.slice(1).toLowerCase();
  return (
    <Reveal as="header" className="mb-8 sm:mb-11 lg:mb-14">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-vice-pink/35 bg-vice-pink/10 px-3 py-1 font-hud text-xs font-bold uppercase tracking-[0.2em] text-vice-gold">
              <span className="text-vice-pink">{meta.index}</span>
              <span aria-hidden="true" className="text-white/25">/</span>
              <span>{meta.caption}</span>
            </span>
            <span aria-hidden="true" className="vice-script text-2xl sm:text-3xl -rotate-2">
              {scriptWord}
            </span>
          </div>
          <h2
            id={titleId}
            className="mt-3 font-poster text-[clamp(2.35rem,6vw,4.8rem)] uppercase leading-[0.94] tracking-[0.02em] text-ink gta-shadow"
          >
            {heading}
          </h2>
          {lead && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">{lead}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      <div className="hairline mt-6 sm:mt-7" />
    </Reveal>
  );
};

/** Standard section wrapper: scroll anchor, gentle atmospheric scrim and responsive centred shell. */
export const SectionShell: React.FC<{
  id: SectionId;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}> = ({ id, children, className = '', labelledBy }) => (
  <section id={id} aria-labelledby={labelledBy} className={`relative w-full ${className}`}>
    <div className="section-scrim" aria-hidden="true" />
    <div className="shell relative z-10 py-20 sm:py-28 lg:py-[14vh]">{children}</div>
  </section>
);


