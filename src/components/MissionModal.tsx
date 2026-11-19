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

/** Full GTA-style project briefing modal with interactive 3D hologram. */
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
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px]" style={{ background: accent }} />

            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-night-950/45 px-5 py-3.5 sm:px-7">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <StatusDot ping />
                <span className="font-hud text-sm font-bold uppercase tracking-[0.18em] text-ink">{project.category}</span>
                <span className="text-ink-faint">&middot;</span>
                <span className="font-hud text-sm font-semibold uppercase tracking-[0.16em] text-ink-mute">{project.badge}</span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close briefing"
                className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/15 px-3.5 font-hud text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-vice-amber/70 hover:text-ink"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">CLOSE</span>
              </button>
            </div>

            {/* Body */}
            <div data-lenis-prevent className="overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 gap-7 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10">
                {/* Left: 3D hologram + specs */}
                <div className="flex flex-col gap-4 lg:col-span-5">
                  <div
                    className="relative h-64 overflow-hidden rounded-2xl border border-white/[0.08] sm:h-72"
                    style={{ background: `radial-gradient(80% 70% at 50% 100%, ${accent}26, transparent 70%), #0a0614` }}
                  >
                    <Suspense fallback={null}>
                      <HoloViewer shape={project.wireframeShape} accent={accent} interactive className="h-full w-full" />
                    </Suspense>
                    <div className="pointer-events-none absolute inset-x-4 top-3.5 flex items-center justify-between gap-3">
                      <span className="font-hud text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
                        {SHAPE_LABELS[project.wireframeShape] ?? '3D HOLOGRAM'}
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between gap-3">
                      <span className="font-hud text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">
                        {PROJECTS_COPY.modal.engine}
                      </span>
                      <span className="font-hud text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                        {PROJECTS_COPY.dragHint}
                      </span>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                      <dt className="hud-label !text-[0.72rem]">{project.metricLabel}</dt>
                      <dd className="stat-num mt-1.5 text-[1.9rem]" style={{ color: accent }}>
                        {project.metricValue}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                      <dt className="hud-label !text-[0.72rem]">{project.architectureLabel}</dt>
                      <dd className="mt-2 font-hud text-base font-bold uppercase leading-snug tracking-[0.06em] text-ink">
                        {project.architectureValue}
                      </dd>
                    </div>
                  </dl>

                  <dl className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-night-950/40 p-4">
                    {[
                      { icon: Cpu, label: 'RUNTIME', value: project.specs.runtime },
                      { icon: Server, label: 'THROUGHPUT', value: project.specs.throughput },
                      { icon: Database, label: 'STORAGE', value: project.specs.storage },
                    ].map((s) => (
                      <div key={s.label} className="flex items-start gap-3">
                        <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-mute" aria-hidden="true" />
                        <div>
                          <dt className="hud-label !text-[0.7rem]">{s.label}</dt>
                          <dd className="mt-0.5 font-mono text-xs leading-snug text-ink">{s.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Right: Story */}
                <div className="flex flex-col gap-6 lg:col-span-7">
                  <div>
                    <p className="hud-label" style={{ color: accent }}>
                      {project.subtitle}
                    </p>
                    <h2 id="mission-title" className="mt-2 font-display text-[clamp(2rem,3.6vw,3rem)] uppercase leading-[0.98] text-ink">
                      {project.title}
                    </h2>
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

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-night-950/45 px-5 py-4 sm:px-7">
              <span className="font-mono text-xs text-ink-mute">{project.repo}</span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.click()}
                className="btn btn-primary btn-sm"
              >
                <Github className="h-4 w-4" />
                {PROJECTS_COPY.modal.openRepo}
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
