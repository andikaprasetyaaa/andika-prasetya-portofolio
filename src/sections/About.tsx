import React from 'react';
import { ABOUT, PROFILE } from '../data/content';
import { ChapterTitle, CountUp, Reveal, SectionShell, StatusDot, Tilt } from '../components/ui';

const ATTRIBUTES = [
  { label: 'NLP & Transformer LLMs', pct: 98 },
  { label: 'GraphRAG & Vector Search', pct: 96 },
  { label: 'Data & ETL Engineering', pct: 95 },
  { label: 'Computer Vision & Edge AI', pct: 92 },
];

export const About: React.FC = () => {
  return (
    <SectionShell id="about" labelledBy="about-title">
      <ChapterTitle
        id="about"
        titleId="about-title"
        heading={
          <>
            BUILT FROM <span className="text-sunset">RAW DATA</span> TO PRODUCTION.
          </>
        }
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left: Rockstar character quote + story + responsive 3-column metrics */}
        <div className="flex flex-col gap-7 lg:col-span-7">
          <Reveal>
            <blockquote className="font-display text-[clamp(1.65rem,3.3vw,2.75rem)] font-bold uppercase leading-[1.08] tracking-[0.02em] text-ink">
              &ldquo;{ABOUT.quote}&rdquo;
            </blockquote>
            <p className="mt-4 max-w-2xl text-sm leading-[1.75] text-ink-soft sm:mt-5 sm:text-base md:text-[1.05rem]">
              {ABOUT.body}
            </p>
            <div className="mt-4 rounded-xl border-l-2 border-vice-pink bg-white/[0.03] px-4 py-3">
              <span className="font-hud text-xs font-bold uppercase tracking-[0.18em] text-vice-amber">
                {ABOUT.focusLabel} &mdash;
              </span>{' '}
              <span className="text-sm text-ink-soft">{ABOUT.focus}</span>
            </div>
          </Reveal>

          {/* Responsive GTA stats: 1 col on tiny <420px phones, 3 cols from xs upward */}
          <ul className="grid grid-cols-1 gap-3.5 border-t border-white/[0.12] pt-6 xs:grid-cols-3 sm:gap-6 sm:pt-7">
            {ABOUT.metrics.map((m, i) => (
              <Reveal
                as="li"
                key={m.subtitle}
                delay={0.06 * i}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5"
              >
                <CountUp value={m.value} className="stat-num text-[clamp(2.2rem,4.2vw,3.3rem)] text-sunset" />
                <p className="mt-1 font-hud text-sm font-bold uppercase tracking-[0.14em] text-ink">{m.unit}</p>
                <p className="mt-0.5 text-xs text-ink-mute">{m.subtitle}</p>
              </Reveal>
            ))}
          </ul>

          {/* Focus domain pills */}
          <Reveal>
            <p className="hud-label mb-2.5 !text-[0.74rem]">CORE SPECIALIZATIONS</p>
            <ul className="flex flex-wrap gap-2">
              {ABOUT.domains.map((d) => (
                <li key={d} className="chip !whitespace-normal">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Right: GTA VI Protagonist Dossier Card with Skill Attribute Bars */}
        <Reveal className="lg:col-span-5" x={20} y={0} delay={0.08}>
          <Tilt className="panel panel-accent relative overflow-hidden p-5 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-55 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,95,168,0.34), rgba(157,107,255,0.12) 60%, transparent 72%)' }}
            />

            <div className="relative flex items-center justify-between gap-2">
              <span className="hud-label !text-[0.72rem] text-vice-coral">ENGINEER DOSSIER</span>
              <span className="vice-script text-xl -rotate-2">Gianyar, Bali</span>
            </div>

            <div className="relative mt-4 flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-sunset p-[2px] shadow-glow sm:h-16 sm:w-16">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-night-900">
                  <span className="font-poster text-2xl leading-none text-sunset sm:text-3xl">{PROFILE.monogram}</span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-night-900">
                  <StatusDot ping />
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl font-bold uppercase leading-tight tracking-[0.02em] text-ink sm:text-2xl">
                  {PROFILE.name}
                </p>
                <p className="mt-1 font-hud text-xs font-bold uppercase tracking-[0.18em] text-vice-gold">
                  {PROFILE.title}
                </p>
              </div>
            </div>

            <dl className="relative mt-5 grid grid-cols-1 gap-2.5 border-t border-white/[0.08] pt-5 xs:grid-cols-2">
              {ABOUT.dossierFields.map((f) => (
                <div key={f.label} className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-3.5 py-2.5">
                  <dt className="hud-label !text-[0.68rem]">{f.label}</dt>
                  <dd className="mt-0.5 text-xs font-semibold text-ink sm:text-sm">{f.value}</dd>
                </div>
              ))}
            </dl>

            {/* GTA Character Attribute Bars */}
            <div className="relative mt-5 border-t border-white/[0.08] pt-5">
              <p className="hud-label mb-3 !text-[0.7rem]">TECHNICAL ATTRIBUTES</p>
              <ul className="flex flex-col gap-2.5">
                {ATTRIBUTES.map((attr) => (
                  <li key={attr.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-hud font-bold uppercase tracking-[0.12em] text-ink-soft">{attr.label}</span>
                      <span className="font-mono text-[0.7rem] text-vice-amber">{attr.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-sunset" style={{ width: `${attr.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </SectionShell>
  );
};
