import React, { useState } from 'react';
import { Cpu, Database, Layers, Terminal, type LucideIcon } from 'lucide-react';
import { STACK, type StackIcon } from '../data/content';
import { pad2 } from '../lib/math';
import { sound } from '../lib/sound';
import { ChapterTitle, Reveal, SectionShell } from '../components/ui';

const ICONS: Record<StackIcon, LucideIcon> = { cpu: Cpu, layers: Layers, database: Database, terminal: Terminal };
const ACCENTS = ['#ff5fa8', '#ffc46b', '#45e3d0', '#9d6bff'];
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

/** GTA-inspired selector wheel with core tools orbiting on a tilted ring. */
const Orbital: React.FC<{ active: number; onSelect: (i: number) => void }> = ({ active, onSelect }) => {
  const cat = STACK.categories[active];
  const Icon = ICONS[cat.icon];
  const preserve: React.CSSProperties = { transformStyle: 'preserve-3d' };

  return (
    <div
      className="group/orbit relative mx-auto aspect-square w-[230px] sm:w-[350px] sm:[--r:182px] lg:w-full lg:max-w-[390px] lg:[--r:min(194px,15vw)]"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute inset-0" style={preserve}>
        <div
          aria-hidden="true"
          className="absolute inset-[14%] rounded-full blur-3xl transition-colors duration-700"
          style={{ background: `${ACCENTS[active]}30` }}
        />

        {/* Weapon-wheel selector */}
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
                  fillOpacity={on ? 0.92 : 0.86}
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
            <circle
              cx="100"
              cy="100"
              r="42"
              fill="#0e0819"
              stroke={ACCENTS[active]}
              strokeOpacity="0.75"
              strokeWidth="1.5"
              className="transition-[stroke] duration-500"
            />
          </svg>

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

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: ACCENTS[active] }} aria-hidden="true" />
            <span className="mt-1 font-display text-xl leading-none text-ink sm:text-2xl">{pad2(active + 1)}</span>
            <span className="mt-0.5 font-hud text-[0.62rem] font-bold tracking-[0.2em] text-ink-mute">/ 04</span>
          </div>
        </div>

        {/* Tilted orbital badges */}
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
                        <span className="chip -translate-x-1/2 -translate-y-1/2 !border-white/15 !bg-night-850/95 !px-3 !py-1.5 shadow-panel">
                          <span className="text-[0.65rem] text-vice-coral">{node.category}</span>
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
      <ChapterTitle
        id="stack"
        titleId="stack-title"
        heading={
          <>
            THE <span className="text-sunset">ARSENAL</span>
          </>
        }
        lead={STACK.lead}
      />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5" y={0} x={-20}>
          <Orbital active={active} onSelect={setActive} />
          <ul className="mt-7 flex flex-wrap justify-center gap-2 sm:hidden">
            {STACK.orbit.map((node) => (
              <li key={node.label} className="chip !bg-night-850/90">
                <span className="text-[0.65rem] text-vice-coral">{node.category}</span>
                <span className="text-ink">{node.label}</span>
              </li>
            ))}
          </ul>
          <p className="hud-label mt-5 text-center">{STACK.orbitHint}</p>
        </Reveal>

        {/* Clean 2x2 GTA loadout grid without dotted spreadsheet noise */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {STACK.categories.map((cat, i) => {
            const Icon = ICONS[cat.icon];
            const on = i === active;
            const accent = ACCENTS[i];
            return (
              <Reveal as="li" key={cat.id} delay={0.06 * i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    sound.click();
                    setActive(i);
                  }}
                  aria-pressed={on}
                  className="panel flex h-full w-full flex-col justify-between p-6 text-left transition-[border-color,transform,box-shadow] duration-500 ease-out-expo"
                  style={{
                    borderColor: on ? `${accent}88` : undefined,
                    transform: on ? 'translateY(-3px)' : undefined,
                    boxShadow: on ? `0 22px 54px -26px ${accent}80` : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
                        style={{ background: on ? accent : `${accent}20`, color: on ? '#14081f' : accent }}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="font-hud text-xs font-bold tracking-[0.18em] text-ink-mute">{cat.id}</span>
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold uppercase leading-tight tracking-[0.02em] text-ink sm:text-2xl">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">{cat.summary}</p>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.08] pt-4">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="chip !px-2.5 !py-1 !text-[0.72rem]">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </button>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
};
