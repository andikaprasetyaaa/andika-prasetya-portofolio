import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, Database, ExternalLink, Github, Server, X } from 'lucide-react';
import { PROJECTS_COPY, SHAPE_LABELS } from '../data/content';
import type { Project } from '../lib/projectsData';
import { uiStore } from '../lib/settings';
import { sound } from '../lib/sound';
import { accentFor } from '../three/accents';
import { EASE_OUT, StatusDot } from './ui';

const HoloViewer = lazy(() => import('../three/HoloViewer'));

interface Props {
  project: Project | null;
  onClose: () => void;
}

/** Full mission briefing: everything about one project, with a hologram you can spin. */
export const MissionModal: React.FC<Props> = ({ project, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const open = Boolean(project);

  useEffect(() => {
    if (!open) return;
    uiStore.set({ modalOpen: true });
    lastFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') ?? []);
    const t = window.setTimeout(() => focusables()[0]?.focus(), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey, true);
      uiStore.set({ modalOpen: false });
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const close = () => {
    sound.close();
    onClose();
  };

  const accent = project ? accentFor(project.id) : '#ff5fa8';

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="mission-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-night-950/85 backdrop-blur-md" onClick={close} aria-hidden="true" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mission-title"
            className="panel relative z-10 flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden"
            style={{ borderColor: `${accent}55` }}
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5" style={{ background: accent }} />

            {/* top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-night-950/50 px-5 py-3.5 sm:px-7">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <StatusDot ping />
                <span className="hud-label !text-ink">DEPLOYMENT // {project.deploymentId}</span>
                <span className="hud-label hidden sm:inline">|</span>
                <span className="hud-label">{project.category}</span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close briefing"
                className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-white/10 px-2.5 font-hud text-[0.7rem] font-semibold tracking-[0.16em] text-ink-soft transition-colors hover:border-vice-pink/60 hover:text-ink"
              >
                <X className="h-4 w-4" />
                <kbd className="hidden sm:inline text-[0.62rem] text-ink-mute">ESC</kbd>
              </button>
            </div>

            {/* body */}
            <div data-lenis-prevent className="overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 gap-7 p-5 sm:p-7 lg:grid-cols-12 lg:gap-9">
                {/* left: hologram + numbers */}
                <div className="flex flex-col gap-4 lg:col-span-5">
                  <div
                    className="relative h-60 overflow-hidden rounded-lg border border-white/[0.08] sm:h-72"
                    style={{ background: `radial-gradient(80% 70% at 50% 100%, ${accent}26, transparent 70%), #0a0614` }}
                  >
                    <Suspense fallback={null}>
                      <HoloViewer shape={project.wireframeShape} accent={accent} interactive className="h-full w-full" />
                    </Suspense>
                    <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-3">
                      <span className="hud-label !text-[0.64rem]" style={{ color: accent }}>
                        {SHAPE_LABELS[project.wireframeShape] ?? '3D CAD SCHEMATIC'}
                      </span>
                      <span className="hud-label hidden !text-[0.62rem] sm:block">{PROJECTS_COPY.modal.renderNote}</span>
                    </div>
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
                      <span className="hud-label !text-[0.62rem]">{PROJECTS_COPY.modal.engine}</span>
                      <span className="hud-label !text-[0.62rem] !text-ink-soft">DRAG TO SPIN</span>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-md border border-white/[0.07] bg-white/[0.035] px-3.5 py-3">
                      <dt className="hud-label !text-[0.64rem]">{project.metricLabel}</dt>
                      <dd className="stat-num mt-2 text-[1.7rem]" style={{ color: accent }}>
                        {project.metricValue}
                      </dd>
                    </div>
                    <div className="rounded-md border border-white/[0.07] bg-white/[0.035] px-3.5 py-3">
                      <dt className="hud-label !text-[0.64rem]">{project.architectureLabel}</dt>
                      <dd className="mt-2 font-hud text-[0.9rem] font-bold leading-snug text-ink">{project.architectureValue}</dd>
                    </div>
                    <div className="col-span-2 flex items-center justify-between rounded-md border border-white/[0.07] bg-white/[0.035] px-3.5 py-2.5">
                      <dt className="hud-label !text-[0.64rem]">{PROJECTS_COPY.modal.verificationLabel}</dt>
                      <dd className="font-hud text-[0.8rem] font-bold tracking-[0.12em] text-vice-mint">
                        {PROJECTS_COPY.modal.verificationValue}
                      </dd>
                    </div>
                  </dl>

                  <dl className="flex flex-col gap-2.5 rounded-md border border-white/[0.07] bg-night-950/40 p-3.5">
                    {[
                      { icon: Cpu, label: 'RUNTIME', value: project.specs.runtime },
                      { icon: Server, label: 'THROUGHPUT', value: project.specs.throughput },
                      { icon: Database, label: 'STORAGE', value: project.specs.storage },
                    ].map((s) => (
                      <div key={s.label} className="flex items-start gap-3">
                        <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-mute" aria-hidden="true" />
                        <div>
                          <dt className="hud-label !text-[0.62rem]">{s.label}</dt>
                          <dd className="mt-0.5 font-mono text-[0.8rem] leading-snug text-ink">{s.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* right: story */}
                <div className="flex flex-col gap-6 lg:col-span-7">
                  <div>
                    <p className="hud-label">{project.subtitle}</p>
                    <h2 id="mission-title" className="mt-2.5 font-display text-[clamp(1.8rem,3.4vw,2.7rem)] uppercase leading-[1.03] text-ink">
                      {project.title}
                    </h2>
                    <span className="chip mt-4" style={{ borderColor: `${accent}66`, color: accent }}>
                      <StatusDot ping />
                      {project.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="hud-label">{PROJECTS_COPY.modal.overview}</h3>
                    <p className="mt-2.5 text-[1rem] leading-[1.75] text-ink-soft">{project.fullOverview}</p>
                  </div>

                  <div>
                    <h3 className="hud-label">{PROJECTS_COPY.modal.features}</h3>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {project.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[0.96rem] leading-relaxed text-ink-soft">
                          <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: accent }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-night-950/50 px-5 py-4 sm:px-7">
              <span className="hud-label">{PROJECTS_COPY.modal.status}</span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.click()}
                className="btn btn-primary btn-sm"
              >
                <Github className="h-4 w-4" />
                {PROJECTS_COPY.openRepo}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
