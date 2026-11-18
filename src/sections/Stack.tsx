import React, { useState } from 'react';
import { Cpu, Database, Layers, Terminal, type LucideIcon } from 'lucide-react';
import { STACK, type StackIcon } from '../data/content';
import { pad2 } from '../lib/math';
import { sound } from '../lib/sound';
import { ChapterTitle, Reveal, SectionShell, StageFooter } from '../components/ui';

const ICONS: Record<StackIcon, LucideIcon> = { cpu: Cpu, layers: Layers, database: Database, terminal: Terminal };
const ACCENTS = ['#ff5fa8', '#ffc46b', '#45e3d0', '#9d6bff'];
/** Wedge centre angles: top, right, bottom, left */
const ANGLES = [-90, 0, 90, 180];
const TILT = 44;

const polar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
};

function wedgePath(center: number, inner: number, outer: number, spread = 41) {
  const [x0, y0] = polar(outer, center - spread);
  const [x1, y1] = polar(outer, center + spread);
  const [x2, y2] = polar(inner, center + spread);
  const [x3, y3] = polar(inner, center - spread);
  return `M${x0},${y0} A${outer},${outer} 0 0 1 ${x1},${y1} L${x2},${y2} A${inner},${inner} 0 0 0 ${x3},${y3} Z`;
}

/** Selector wheel with the headline tools orbiting it on a tilted ring (pure CSS 3D). */
const Orbital: React.FC<{ active: number; onSelect: (i: number) => void }> = ({ active, onSelect }) => {
  const cat = STACK.categories[active];
  const Icon = ICONS[cat.icon];
  const preserve: React.CSSProperties = { transformStyle: 'preserve-3d' };

  return (
    <div
      className="group/orbit relative mx-auto aspect-square w-[230px] sm:w-[360px] sm:[--r:186px] lg:w-full lg:max-w-[400px] lg:[--r:min(198px,15.2vw)]"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute inset-0" style={preserve}>
        {/* soft glow under the core */}
        <div
          aria-hidden="true"
          className="absolute inset-[14%] rounded-full blur-3xl transition-colors duration-700"
          style={{ background: `${ACCENTS[active]}30` }}
        />

        {/* selector wheel */}
        <div className="absolute inset-[4%] sm:inset-[27%]" style={preserve}>
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" role="group" aria-label="Skill categories">
            <circle cx="100" cy="100" r="98.5" fill="none" stroke="#ffffff" strokeOpacity="0.1" />
            {STACK.categories.map((c, i) => {
              const on = i === active;
              return (
                <path
                  key={c.id}
                  d={wedgePath(ANGLES[i], 47, 95)}
                  fill={on ? ACCENTS[i] : '#1a0f2e'}
                  fillOpacity={on ? 0.9 : 0.86}
                  stroke={on ? ACCENTS[i] : '#ffffff'}
                  strokeOpacity={on ? 1 : 0.14}
                  strokeWidth="1"
                  className="cursor-pointer transition-[fill,fill-opacity] duration-300 hover:fill-opacity-100 focus:outline-none focus-visible:stroke-[3]"
                  tabIndex={0}
                  role="button"
                  aria-pressed={on}
                  aria-label={c.title}
                  onMouseEnter={() => {
                    if (!on) sound.hover();
                    onSelect(i);
                  }}
                  onFocus={() => onSelect(i)}
                  onClick={() => {
                    sound.click();
                    onSelect(i);
                  }}
                />
              );
            })}
            <circle cx="100" cy="100" r="42" fill="#0e0819" stroke={ACCENTS[active]} strokeOpacity="0.7" strokeWidth="1.5" className="transition-[stroke] duration-500" />
          </svg>

          {/* wedge icons */}
          {STACK.categories.map((c, i) => {
            const WIcon = ICONS[c.icon];
            const [x, y] = polar(71, ANGLES[i]);
            return (
              <span
                key={c.id}
                aria-hidden="true"
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
                style={{ left: `${x / 2}%`, top: `${y / 2}%`, color: i === active ? '#14081f' : '#a394b8' }}
              >
                <WIcon className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
              </span>
            );
          })}

          {/* hub */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: ACCENTS[active] }} aria-hidden="true" />
            <span className="mt-1 font-display text-xl leading-none text-ink sm:text-2xl">{pad2(active + 1)}</span>
            <span className="mt-0.5 font-hud text-[0.5rem] font-bold tracking-[0.2em] text-ink-mute sm:text-[0.56rem]">/ 04</span>
          </div>
        </div>

        {/* tilted orbit */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block" style={{ ...preserve, transform: `rotateX(${TILT}deg)` }}>
          <div className="absolute left-1/2 top-1/2 h-[calc(var(--r)*2)] w-[calc(var(--r)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" />
          <div className="absolute inset-0 animate-spin-slow group-hover/orbit:[animation-play-state:paused]" style={preserve}>
            {STACK.orbit.map((node, i) => {
              const theta = (i / STACK.orbit.length) * 360;
              return (
                <div
                  key={node.label}
                  className="absolute left-1/2 top-1/2"
                  style={{ ...preserve, transform: `rotateZ(${theta}deg) translateX(var(--r))` }}
                >
                  <div style={{ ...preserve, transform: `rotateZ(${-theta}deg)` }}>
                    <div className="animate-spin-slow-rev group-hover/orbit:[animation-play-state:paused]" style={preserve}>
                      <div style={{ transform: `rotateX(${-TILT}deg)` }}>
                        <span className="chip -translate-x-1/2 -translate-y-1/2 !border-white/15 !bg-night-850/95 !px-2.5 !py-1.5 shadow-panel">
                          <span className="text-[0.6rem] text-vice-pink">{node.category}</span>
                          <span className="text-ink">{node.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Stack: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <SectionShell id="stack" labelledBy="stack-title" className="overflow-hidden">
      <ChapterTitle id="stack" status={STACK.status} />

      <Reveal className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <h2
          id="stack-title"
          className="max-w-3xl font-display text-[clamp(2.2rem,5vw,4.1rem)] uppercase leading-[0.98] tracking-[0.005em] text-ink"
        >
          {STACK.heading}
        </h2>
        <p className="max-w-md text-[0.98rem] leading-relaxed text-ink-soft lg:text-right">{STACK.lead}</p>
      </Reveal>

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5" y={0} x={-24}>
          <Orbital active={active} onSelect={setActive} />
          <ul className="mt-7 flex flex-wrap justify-center gap-2 sm:hidden">
            {STACK.orbit.map((node) => (
              <li key={node.label} className="chip !bg-night-850/90">
                <span className="text-[0.6rem] text-vice-pink">{node.category}</span>
                <span className="text-ink">{node.label}</span>
              </li>
            ))}
          </ul>
          <p className="hud-label mt-6 text-center">{STACK.orbitLabel}</p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {STACK.categories.map((cat, i) => {
            const Icon = ICONS[cat.icon];
            const on = i === active;
            const accent = ACCENTS[i];
            return (
              <Reveal as="li" key={cat.id} delay={0.07 * i}>
                <div
                  onMouseEnter={() => setActive(i)}
                  className="panel h-full p-5 transition-[border-color,transform,box-shadow] duration-500 ease-out-expo"
                  style={{
                    borderColor: on ? `${accent}8c` : undefined,
                    transform: on ? 'translateY(-4px)' : undefined,
                    boxShadow: on ? `0 24px 60px -30px ${accent}99` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-500"
                        style={{ background: on ? accent : `${accent}22`, color: on ? '#14081f' : accent }}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <h3 className="font-hud text-[0.86rem] font-bold uppercase leading-tight tracking-[0.12em] text-ink">{cat.title}</h3>
                    </div>
                    <span className="hud-label shrink-0 !text-[0.64rem]">{cat.id}</span>
                  </div>
                  <ul className="mt-3 flex flex-col">
                    {cat.skills.map((skill, k) => (
                      <li key={skill.name} className="flex items-baseline gap-3 border-b border-white/[0.05] py-2.5 last:border-b-0">
                        <span className="font-mono text-[0.7rem] text-ink-faint">{pad2(k + 1)}</span>
                        <span className="font-hud text-[0.96rem] font-semibold text-ink">{skill.name}</span>
                        <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-white/15" />
                        <span className="hud-label !text-[0.66rem] !tracking-[0.14em]">{skill.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <StageFooter id="stack" left={STACK.footer[0]} right={STACK.footer[1]} />
    </SectionShell>
  );
};
