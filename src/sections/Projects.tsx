import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { PROJECTS_COPY, SHAPE_LABELS } from '../data/content';
import { pad2 } from '../lib/math';
import { PROJECTS, type Project } from '../lib/projectsData';
import { useReducedMotionPref } from '../lib/settings';
import { sound } from '../lib/sound';
import { accentFor } from '../three/accents';
import { MissionModal } from '../components/MissionModal';
import { ChapterTitle, EASE_OUT, Reveal, SectionShell, StatusDot } from '../components/ui';

const HoloViewer = lazy(() => import('../three/HoloViewer'));

const TOTAL = pad2(PROJECTS.length);

export const Projects: React.FC = () => {
  const reduced = useReducedMotionPref();
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState<Project | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const project = PROJECTS[index];
  const accent = accentFor(project.id);

  const select = useCallback((i: number, withSound = true) => {
    setIndex((prev) => {
      const next = (i + PROJECTS.length) % PROJECTS.length;
      if (next !== prev && withSound) sound.slide();
      return next;
    });
  }, []);

  // Keep active pill centered on smaller horizontal scroll rails
  useEffect(() => {
    const rail = railRef.current;
    const el = rail?.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    if (!rail || !el || window.innerWidth >= 1024) return;
    const target = el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2;
    rail.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
  }, [index, reduced]);

  const openModal = (p: Project) => {
    sound.open();
    setModal(p);
  };
  const closeModal = useCallback(() => setModal(null), []);

  const controls = (
    <div className="flex items-center gap-3">
      <span className="chip !border-white/15 !bg-night-900/75 !py-2 !text-ink">
        <StatusDot tone="pink" ping />
        MISSION {pad2(index + 1)} / {TOTAL}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => select(index - 1)}
          aria-label="Previous project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-night-900/75 text-ink-soft transition-colors hover:border-vice-amber/70 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => select(index + 1)}
          aria-label="Next project"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-sunset text-night-950 transition-transform duration-300 hover:scale-105"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <SectionShell id="projects" labelledBy="projects-title">
      <ChapterTitle
        id="projects"
        titleId="projects-title"
        heading={
          <>
            SELECTED <span className="text-sunset">MISSIONS</span>
          </>
        }
        lead={PROJECTS_COPY.sub}
        right={controls}
      />

      {/* Top Responsive GTA VI Mission Selector Strip (01-08) */}
      <Reveal className="mb-5 sm:mb-6">
        <div
          ref={railRef}
          data-lenis-prevent
          className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-1 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible"
        >
          {PROJECTS.map((p, i) => {
            const on = i === index;
            const a = accentFor(p.id);
            return (
              <button
                key={p.id}
                type="button"
                data-idx={i}
                onClick={() => select(i)}
                onMouseEnter={() => sound.hover()}
                aria-current={on ? 'true' : undefined}
                className={`group relative flex shrink-0 snap-center items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300 lg:flex-col lg:items-start lg:gap-1 lg:px-3 ${
                  on
                    ? 'border-white/25 bg-white/[0.11] text-ink shadow-panel'
                    : 'border-white/[0.08] bg-night-950/60 text-ink-mute hover:border-white/20 hover:bg-white/[0.05] hover:text-ink'
                }`}
                style={on ? { borderColor: `${a}88`, boxShadow: `0 12px 30px -14px ${a}66` } : undefined}
              >
                <span className="font-poster text-lg leading-none" style={{ color: on ? a : undefined }}>
                  {pad2(i + 1)}
                </span>
                <span className="truncate font-hud text-xs font-bold uppercase tracking-[0.08em] lg:w-full">
                  {p.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Main Single-Spotlight GTA VI Mission Card */}
      <Reveal>
        <article
          className="panel overflow-hidden transition-colors duration-500"
          style={{ borderColor: `${accent}48` }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px] transition-colors duration-500"
            style={{ background: accent }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left / Top: Spacious Interactive GTA VI 3D Sunset Diorama Viewport */}
            <div
              className="relative h-[18rem] overflow-hidden border-b border-white/[0.08] xs:h-[20.5rem] sm:h-[23.5rem] lg:col-span-6 lg:h-auto lg:min-h-[27.5rem] lg:border-b-0 lg:border-r"
              style={{
                background: `radial-gradient(85% 75% at 50% 44%, rgba(255, 138, 92, 0.24), ${accent}22 48%, rgba(16, 8, 32, 0.94) 100%), linear-gradient(180deg, #1b0d38 0%, #35144a 52%, #130824 100%)`,
                transition: 'background 0.5s ease',
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                  maskImage: 'radial-gradient(70% 70% at 50% 60%, #000, transparent)',
                  WebkitMaskImage: 'radial-gradient(70% 70% at 50% 60%, #000, transparent)',
                }}
              />

              {/* Top-left 3D schematic label + Top-right giant ghost number */}
              <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between">
                <span className="chip !border-white/15 !bg-night-950/75" style={{ color: accent }}>
                  {SHAPE_LABELS[project.wireframeShape] ?? '3D HOLOGRAM'}
                </span>
                <span
                  aria-hidden="true"
                  className="font-poster text-6xl leading-none opacity-15 select-none sm:text-7xl"
                  style={{ color: accent }}
                >
                  {pad2(index + 1)}
                </span>
              </div>

              <Suspense fallback={null}>
                <HoloViewer
                  shape={project.wireframeShape}
                  accent={accent}
                  interactive
                  paused={Boolean(modal)}
                  className="h-full w-full"
                />
              </Suspense>

              {/* Floating Key Metric inside bottom of 3D stage */}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
                <div className="rounded-xl border border-white/10 bg-night-950/80 px-3.5 py-2 backdrop-blur-md">
                  <p className="hud-label !text-[0.68rem]">{project.metricLabel}</p>
                  <p className="stat-num mt-0.5 text-2xl sm:text-3xl" style={{ color: accent }}>
                    {project.metricValue}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-night-950/75 px-3 py-1 font-hud text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-soft">
                  {PROJECTS_COPY.dragHint}
                </span>
              </div>
            </div>

            {/* Right: Crisp Oswald/Outfit Editorial Story */}
            <div className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-6 lg:p-9">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={project.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  className="flex flex-col"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-hud text-xs font-bold uppercase tracking-[0.2em] sm:text-sm" style={{ color: accent }}>
                      {project.category} &middot; {project.deploymentId}
                    </span>
                    <span className="chip !border-white/15 !text-[0.7rem]">{project.badge}</span>
                  </div>

                  {/* Crisp Oswald headline with generous kerning so titles never squish */}
                  <h3 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.65rem)] font-bold uppercase leading-[1.04] tracking-[0.02em] text-ink">
                    {project.title}
                  </h3>

                  <p className="mt-1.5 font-hud text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute sm:text-sm">
                    {project.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-[1.7] text-ink-soft sm:text-base">{project.pitch}</p>

                  {/* Clean Architecture & Runtime Strip */}
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                    <div>
                      <p className="hud-label !text-[0.68rem]">{project.architectureLabel}</p>
                      <p className="mt-1 font-hud text-sm font-bold uppercase tracking-[0.08em] text-ink sm:text-base">
                        {project.architectureValue}
                      </p>
                    </div>
                    <div>
                      <p className="hud-label !text-[0.68rem]">RUNTIME</p>
                      <p className="mt-1 truncate font-mono text-xs text-ink-soft sm:text-sm">{project.specs.runtime}</p>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-5">
                <button
                  type="button"
                  className="btn btn-primary flex-1 sm:flex-initial"
                  onClick={() => openModal(project)}
                  onMouseEnter={() => sound.hover()}
                >
                  {PROJECTS_COPY.inspect}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost flex-1 sm:flex-initial"
                  onClick={() => sound.click()}
                  onMouseEnter={() => sound.hover()}
                >
                  <Github className="h-4 w-4" />
                  {PROJECTS_COPY.openRepo}
                </a>
              </div>
            </div>
          </div>
        </article>
      </Reveal>

      <MissionModal project={modal} onClose={closeModal} />
    </SectionShell>
  );
};
