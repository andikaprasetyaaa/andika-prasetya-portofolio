import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, Github } from 'lucide-react';
import { PROJECTS_COPY, SHAPE_LABELS } from '../data/content';
import { pad2 } from '../lib/math';
import { PROJECTS, type Project } from '../lib/projectsData';
import { useReducedMotionPref } from '../lib/settings';
import { sound } from '../lib/sound';
import { accentFor } from '../three/accents';
import { MissionModal } from '../components/MissionModal';
import { ChapterTitle, EASE_OUT, Reveal, SectionShell, StageFooter, StatusDot } from '../components/ui';

const HoloViewer = lazy(() => import('../three/HoloViewer'));

const TOTAL = pad2(PROJECTS.length);

export const Projects: React.FC = () => {
  const reduced = useReducedMotionPref();
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState<Project | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const hoverTimer = useRef(0);

  const project = PROJECTS[index];
  const accent = accentFor(project.id);

  const select = useCallback((i: number, withSound = true) => {
    setIndex((prev) => {
      const next = (i + PROJECTS.length) % PROJECTS.length;
      if (next !== prev && withSound) sound.slide();
      return next;
    });
  }, []);

  // keep the active chip visible in the phone selector
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!strip || !el) return;
    const target = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2;
    strip.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
  }, [index, reduced]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const openModal = (p: Project) => {
    sound.open();
    setModal(p);
  };
  const closeModal = useCallback(() => setModal(null), []);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowDown' ? 1 : -1) + PROJECTS.length) % PROJECTS.length;
    select(next);
    listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus();
  };

  return (
    <SectionShell id="projects" labelledBy="projects-title">
      <ChapterTitle id="projects" />

      <Reveal className="mb-9 flex flex-col gap-5 md:mb-11 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="projects-title"
            className="font-display text-[clamp(2.3rem,5.4vw,4.4rem)] uppercase leading-[0.98] tracking-[0.005em] text-ink"
          >
            {PROJECTS_COPY.heading}
          </h2>
          <p className="hud-label mt-3 !leading-relaxed">{PROJECTS_COPY.sub}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="chip !py-2 !text-ink">
            <StatusDot tone="pink" ping />
            CARD [{pad2(index + 1)} / {TOTAL}]
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => select(index - 1)}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/12 bg-night-900/60 text-ink-soft transition-colors hover:border-vice-pink/60 hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => select(index + 1)}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-md bg-sunset text-night-950 transition-transform duration-300 hover:scale-105"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {/* phone / tablet selector */}
      <div
        ref={stripRef}
        className="no-scrollbar -mx-[clamp(1.25rem,4vw,3.5rem)] mb-5 flex snap-x gap-2 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-1 lg:hidden"
        data-lenis-prevent
      >
        {PROJECTS.map((p, i) => {
          const on = i === index;
          return (
            <button
              key={p.id}
              type="button"
              data-index={i}
              onClick={() => select(i)}
              aria-pressed={on}
              className={`flex shrink-0 snap-center items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                on ? 'border-transparent bg-white/[0.09]' : 'border-white/10 bg-night-900/60'
              }`}
              style={on ? { boxShadow: `inset 0 -2px 0 0 ${accentFor(p.id)}` } : undefined}
            >
              <span className="font-display text-lg leading-none" style={{ color: on ? accentFor(p.id) : '#7d6f94' }}>
                {pad2(i + 1)}
              </span>
              <span className={`max-w-[11rem] truncate font-hud text-[0.82rem] font-semibold ${on ? 'text-ink' : 'text-ink-mute'}`}>
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-9">
        {/* mission list (desktop) */}
        <Reveal className="hidden lg:col-span-5 lg:block" x={-24} y={0}>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <span className="hud-label !text-ink-soft">SELECT DEPLOYMENT</span>
              <span className="hud-label hidden xl:block">↑ ↓ NAVIGATE · ENTER INSPECT</span>
            </div>
            <ul ref={listRef} onKeyDown={onListKey} className="py-1.5">
              {PROJECTS.map((p, i) => {
                const on = i === index;
                const a = accentFor(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      data-index={i}
                      tabIndex={on ? 0 : -1}
                      aria-current={on ? 'true' : undefined}
                      onClick={() => (on ? openModal(p) : select(i))}
                      onMouseEnter={() => {
                        window.clearTimeout(hoverTimer.current);
                        hoverTimer.current = window.setTimeout(() => select(i), 70);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          openModal(p);
                        }
                      }}
                      className="group relative flex w-full items-center gap-4 px-5 py-3 text-left outline-none"
                    >
                      {on && (
                        <motion.span
                          layoutId="mission-highlight"
                          aria-hidden="true"
                          className="absolute inset-x-1.5 inset-y-0.5 rounded-md"
                          style={{ background: `linear-gradient(90deg, ${a}2e, ${a}0a 70%, transparent)`, boxShadow: `inset 3px 0 0 0 ${a}` }}
                          transition={{ type: 'spring', stiffness: 480, damping: 42 }}
                        />
                      )}
                      <span
                        className="relative w-9 font-display text-[1.6rem] leading-none transition-colors duration-300"
                        style={{ color: on ? a : '#6c5e83' }}
                      >
                        {pad2(i + 1)}
                      </span>
                      <span className="relative min-w-0 flex-1">
                        <span
                          className={`block truncate font-hud text-[0.98rem] font-bold tracking-[0.02em] transition-colors duration-300 ${
                            on ? 'text-ink' : 'text-ink-soft group-hover:text-ink'
                          }`}
                        >
                          {p.title}
                        </span>
                        <span className="mt-1 block truncate font-hud text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
                          {p.deploymentId} · {p.category}
                        </span>
                      </span>
                      <ChevronRight
                        className={`relative h-4 w-4 shrink-0 transition-all duration-300 ${
                          on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                        }`}
                        style={{ color: a }}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* briefing */}
        <Reveal className="lg:sticky lg:top-24 lg:col-span-7" x={24} y={0}>
          <article className="panel overflow-hidden" style={{ borderColor: `${accent}40`, transition: 'border-color 0.5s ease' }}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 transition-colors duration-500" style={{ background: accent }} />

            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3.5">
              <span className="hud-label !text-ink">DEPLOYMENT_ID // {project.deploymentId}</span>
              <span className="chip" style={{ borderColor: `${accent}66`, color: accent }}>
                <StatusDot ping />
                {project.badge}
              </span>
            </div>

            {/* hologram bay */}
            <div
              className="relative h-56 overflow-hidden border-b border-white/[0.08] sm:h-64 lg:h-[18.5rem]"
              style={{
                background: `radial-gradient(75% 65% at 50% 100%, ${accent}24, transparent 70%), #0a0614`,
                transition: 'background 0.5s ease',
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                  maskImage: 'radial-gradient(70% 70% at 50% 60%, #000, transparent)',
                  WebkitMaskImage: 'radial-gradient(70% 70% at 50% 60%, #000, transparent)',
                }}
              />
              <Suspense fallback={null}>
                <HoloViewer shape={project.wireframeShape} accent={accent} paused={Boolean(modal)} className="h-full w-full" />
              </Suspense>
              <div className="pointer-events-none absolute inset-x-4 top-3.5 flex items-center justify-between gap-3">
                <span className="hud-label !text-[0.66rem]" style={{ color: accent }}>
                  [ {SHAPE_LABELS[project.wireframeShape] ?? '3D SCHEMATIC'} ]
                </span>
                <span className="hud-label flex items-center gap-2 !text-[0.66rem] !text-ink-soft">
                  <StatusDot ping />
                  {PROJECTS_COPY.online}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-4 bottom-3.5 flex items-end justify-between gap-4">
                <div>
                  <p className="hud-label !text-[0.64rem]">{project.metricLabel}</p>
                  <p className="stat-num mt-1.5 text-[2rem] sm:text-[2.3rem]" style={{ color: accent }}>
                    {project.metricValue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="hud-label !text-[0.64rem]">{project.architectureLabel}</p>
                  <p className="mt-1.5 font-hud text-[0.84rem] font-bold tracking-[0.06em] text-ink">{project.architectureValue}</p>
                </div>
              </div>
            </div>

            {/* copy */}
            <div className="p-5 sm:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={project.id}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  <p className="hud-label">{project.subtitle}</p>
                  <h3 className="mt-2.5 font-display text-[clamp(1.55rem,2.6vw,2.15rem)] uppercase leading-[1.05] text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-3.5 text-[0.98rem] leading-[1.7] text-ink-soft">{project.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap items-center gap-3 pl-1.5">
                <button type="button" className="btn btn-primary" onClick={() => openModal(project)} onMouseEnter={() => sound.hover()}>
                  {PROJECTS_COPY.inspect}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  onClick={() => sound.click()}
                  onMouseEnter={() => sound.hover()}
                >
                  <Github className="h-4 w-4" />
                  GITHUB
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </div>

      <StageFooter id="projects" left="PRODUCTION PROTOCOLS" right={`${PROJECTS_COPY.totalLabel}: ${TOTAL}`} />

      <MissionModal project={modal} onClose={closeModal} />
    </SectionShell>
  );
};
