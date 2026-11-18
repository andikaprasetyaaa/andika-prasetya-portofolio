import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SECTIONS } from '../data/content';
import { clamp, pad2, smoothstep } from '../lib/math';
import { onScrollFrame, scrollState, scrollToSection, useActiveSection } from '../lib/scroll';
import { sound } from '../lib/sound';

/** Waypoints of the route across the bay, in the 200×200 map space. One per section. */
const WAYPOINTS: Array<[number, number]> = [
  [100, 182],
  [84, 156],
  [114, 132],
  [90, 108],
  [118, 86],
  [104, 62],
];

const SEGMENTS = WAYPOINTS.slice(1).map(([x, y], i) => {
  const [px, py] = WAYPOINTS[i];
  return Math.hypot(x - px, y - py);
});
const TOTAL = SEGMENTS.reduce((a, b) => a + b, 0);
const ROUTE_D = `M${WAYPOINTS.map(([x, y]) => `${x},${y}`).join(' L')}`;

/** Viewport width from which the radar can stay open without covering the content column */
const WIDE = 1700;

/** In-world clock: the sun sets as you travel down the page. */
function worldClock(journey: number) {
  const tod = smoothstep(0.12, 1.9, journey);
  const minutes = 17 * 60 + 40 + tod * 330 + clamp((journey - 1.9) / 3.1) * 40;
  const m = Math.round(minutes) % (24 * 60);
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

/** Open-world style radar: shows where you are on the route and lets you fast-travel. */
export const Minimap: React.FC = () => {
  const active = useActiveSection();
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= WIDE);
  const [hover, setHover] = useState(false);
  const playerRef = useRef<SVGGElement>(null);
  const doneRef = useRef<SVGPathElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= WIDE);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const apply = () => {
      const j = clamp(scrollState.journey, 0, WAYPOINTS.length - 1);
      const i = Math.min(Math.floor(j), WAYPOINTS.length - 2);
      const f = j - i;
      const [ax, ay] = WAYPOINTS[i];
      const [bx, by] = WAYPOINTS[i + 1];
      const x = ax + (bx - ax) * f;
      const y = ay + (by - ay) * f;
      const angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI + 90;
      playerRef.current?.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(1)})`);
      let done = 0;
      for (let k = 0; k < i; k++) done += SEGMENTS[k];
      done += SEGMENTS[i] * f;
      doneRef.current?.setAttribute('stroke-dasharray', `${done.toFixed(2)} ${TOTAL + 10}`);
      if (clockRef.current) clockRef.current.textContent = worldClock(scrollState.journey);
      if (ringRef.current) {
        const c = 2 * Math.PI * 21;
        ringRef.current.setAttribute('stroke-dasharray', `${(scrollState.progress * c).toFixed(2)} ${c.toFixed(2)}`);
      }
    };
    apply();
    return onScrollFrame(apply);
  }, []);

  const expanded = wide || hover || active === 0;
  const meta = SECTIONS[active];

  const blocks = useMemo(() => {
    // little city blocks on the mainland
    const out: Array<[number, number, number, number]> = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 11; col++) {
        const w = 10 + ((col * 7 + row * 3) % 5);
        out.push([6 + col * 17.5, 6 + row * 15, w, 9]);
      }
    }
    return out;
  }, []);

  const go = (id: string) => {
    sound.click();
    scrollToSection(id);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-30 hidden lg:block" aria-label="Section radar">
      {/* expanded radar */}
      <div
        data-expanded={expanded}
        onMouseLeave={() => setHover(false)}
        className="pointer-events-auto origin-bottom-right transition-[transform,opacity] duration-500 ease-out-expo data-[expanded=false]:pointer-events-none data-[expanded=false]:scale-[0.28] data-[expanded=false]:opacity-0"
      >
        <div className="relative h-[176px] w-[176px] overflow-hidden rounded-[20px] border border-white/15 bg-night-900/90 shadow-[0_18px_50px_-18px_rgba(4,2,10,0.9)]">
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="mm-route" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#ffc46b" />
                <stop offset="0.5" stopColor="#ff5fa8" />
                <stop offset="1" stopColor="#9d6bff" />
              </linearGradient>
              <radialGradient id="mm-vignette" cx="50%" cy="50%" r="72%">
                <stop offset="0.55" stopColor="#0c0716" stopOpacity="0" />
                <stop offset="1" stopColor="#0c0716" stopOpacity="0.75" />
              </radialGradient>
            </defs>
            {/* water */}
            <rect width="200" height="200" fill="#150c28" />
            {[92, 118, 144, 170].map((y) => (
              <path
                key={y}
                d={`M0,${y} C30,${y - 5} 60,${y + 5} 100,${y} S170,${y - 5} 200,${y}`}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.045"
                strokeWidth="1"
              />
            ))}
            {/* mainland + city blocks */}
            <path d="M0,0 H200 V54 C176,62 152,50 128,58 C106,66 90,56 68,62 C46,68 24,56 0,64 Z" fill="#2a1a49" />
            {blocks.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#ffffff" fillOpacity="0.07" />
            ))}
            {/* sand bars */}
            <ellipse cx="34" cy="152" rx="24" ry="13" fill="#3b2862" />
            <ellipse cx="168" cy="150" rx="24" ry="14" fill="#3b2862" />
            <ellipse cx="34" cy="104" rx="20" ry="7" fill="#3b2862" />
            <ellipse cx="170" cy="112" rx="22" ry="8" fill="#3b2862" />
            {/* causeway */}
            <path d="M0,76 H200" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.2" />
            <path d="M0,76 H200" stroke="#ff5fa8" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="3 5" />
            {/* route */}
            <path d={ROUTE_D} fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 6" />
            <path ref={doneRef} d={ROUTE_D} fill="none" stroke="url(#mm-route)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`0 ${TOTAL + 10}`} />
            <rect width="200" height="200" fill="url(#mm-vignette)" />
            {/* player */}
            <g ref={playerRef} transform={`translate(${WAYPOINTS[0][0]} ${WAYPOINTS[0][1]})`}>
              <circle r="11" fill="#ff5fa8" fillOpacity="0.18" />
              <path d="M0,-8 L5.5,6.5 L0,3.4 L-5.5,6.5 Z" fill="#ffffff" stroke="#ff5fa8" strokeWidth="1.2" strokeLinejoin="round" />
            </g>
          </svg>

          {/* fast-travel blips */}
          {SECTIONS.map((s, i) => {
            const [x, y] = WAYPOINTS[i];
            const state = i === active ? 'active' : i < active ? 'done' : 'todo';
            return (
              <button
                key={s.id}
                type="button"
                tabIndex={expanded ? 0 : -1}
                onClick={() => go(s.id)}
                onMouseEnter={() => sound.hover()}
                aria-label={`Go to ${s.label.toLowerCase()}`}
                title={`${s.index} · ${s.label}`}
                style={{ left: `${x / 2}%`, top: `${y / 2}%` }}
                className={`absolute flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-hud text-[0.56rem] font-bold leading-none transition-all duration-300 hover:scale-125 ${
                  state === 'active'
                    ? 'border-white bg-vice-pink text-night-950 shadow-[0_0_14px_rgba(255,95,168,0.8)]'
                    : state === 'done'
                      ? 'border-vice-teal/80 bg-vice-teal/85 text-night-950'
                      : 'border-white/45 bg-night-900 text-ink-soft'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <span className="absolute left-2.5 top-2 font-hud text-[0.6rem] font-bold tracking-[0.18em] text-ink-mute" aria-hidden="true">
            N
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-night-900/85 px-3 py-1.5">
          <span className="font-hud text-[0.72rem] font-semibold tracking-[0.16em] text-ink">
            <span className="text-vice-amber">{meta.index}</span>
            <span className="text-ink-mute"> / {pad2(SECTIONS.length)}</span>
            <span className="ml-2">{meta.label}</span>
          </span>
          <span ref={clockRef} className="font-mono text-[0.72rem] text-ink-soft" title="In-world time">
            17:40
          </span>
        </div>
      </div>

      {/* collapsed: a compass button that expands on hover / focus */}
      <button
        type="button"
        data-expanded={expanded}
        onMouseEnter={() => setHover(true)}
        onFocus={() => setHover(true)}
        onClick={() => setHover(true)}
        tabIndex={expanded ? -1 : 0}
        aria-label={`Open section radar — currently ${meta.label.toLowerCase()}`}
        className="pointer-events-auto absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-night-900/90 font-hud text-[0.78rem] font-bold text-ink shadow-[0_12px_30px_-12px_rgba(4,2,10,0.9)] transition-[transform,opacity] duration-300 data-[expanded=true]:pointer-events-none data-[expanded=true]:scale-50 data-[expanded=true]:opacity-0"
      >
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="24" cy="24" r="21" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
          <circle ref={ringRef} cx="24" cy="24" r="21" fill="none" stroke="#ff5fa8" strokeWidth="2" strokeLinecap="round" strokeDasharray="0 132" />
        </svg>
        <span className="text-vice-amber">{meta.index}</span>
      </button>
    </div>
  );
};
