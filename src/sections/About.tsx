import React from 'react';
import { Activity, Award, BadgeCheck, GitBranch, GraduationCap, Layers, Quote } from 'lucide-react';
import { ABOUT, PROFILE } from '../data/content';
import { ChapterTitle, CountUp, Reveal, SectionShell, StageFooter, StatusDot, Tilt } from '../components/ui';

const METRIC_ICONS = [Award, Layers, GitBranch, Activity];

/** Decorative barcode strip for the ID card */
const Barcode: React.FC = () => {
  const bars = [3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2];
  return (
    <div className="flex h-7 items-stretch gap-[2px] opacity-70" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} className="bg-ink-soft" style={{ width: w * 1.6 }} />
      ))}
    </div>
  );
};

export const About: React.FC = () => {
  const initials = 'AP';

  return (
    <SectionShell id="about" labelledBy="about-title">
      <ChapterTitle id="about" status={ABOUT.status} />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* ------- left: operator ID + statement ------- */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Reveal x={-24} y={0}>
            <Tilt className="panel panel-accent relative overflow-hidden p-6 sm:p-7">
              {/* holographic wash */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(255,95,168,0.35), rgba(157,107,255,0.12) 60%, transparent 72%)' }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <span className="hud-label">{ABOUT.dossier.heading}</span>
                <span className="chip !border-vice-teal/30 !bg-vice-teal/10 !text-vice-mint">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {ABOUT.dossier.verified}
                </span>
              </div>

              <div className="relative mt-6 flex items-center gap-5">
                <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 rounded-2xl bg-sunset p-[2px] shadow-glow">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-night-900">
                    <span className="font-display text-[2.6rem] leading-none text-sunset">{initials}</span>
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-night-900">
                    <StatusDot ping />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[1.65rem] uppercase leading-[1.02] text-ink sm:text-[1.9rem]">{PROFILE.name}</p>
                  <p className="mt-2 font-hud text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-vice-gold">
                    {PROFILE.title}
                  </p>
                </div>
              </div>

              <dl className="relative mt-6 grid grid-cols-2 gap-2.5">
                {ABOUT.dossier.fields.map((f) => (
                  <div key={f.label} className="rounded-md border border-white/[0.07] bg-white/[0.035] px-3.5 py-3">
                    <dt className="hud-label !text-[0.66rem]">{f.label}</dt>
                    <dd className="mt-1.5 font-hud text-[0.92rem] font-semibold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="relative mt-6 flex items-end justify-between gap-4 border-t border-white/[0.08] pt-4">
                <Barcode />
                <div className="text-right">
                  {ABOUT.footnotes.map((n, i) => (
                    <p key={n} className={`font-mono text-[0.7rem] leading-relaxed ${i === 0 ? 'text-ink-soft' : 'text-ink-mute'}`}>
                      {n}
                    </p>
                  ))}
                </div>
              </div>
            </Tilt>
          </Reveal>

          <Reveal x={-24} y={0} delay={0.08}>
            <figure className="panel relative p-6 sm:p-7">
              <Quote className="h-7 w-7 text-vice-pink/80" aria-hidden="true" />
              <blockquote className="mt-3 text-[1.08rem] font-medium leading-relaxed text-ink">“{ABOUT.quote}”</blockquote>
              <figcaption className="mt-5 rounded-md border-l-2 border-vice-pink bg-white/[0.035] px-4 py-3">
                <span className="hud-label !text-vice-gold">{ABOUT.focusLabel}</span>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{ABOUT.focus}</p>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* ------- right: discipline, education, metrics ------- */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal>
            <p className="hud-label">{ABOUT.kicker}</p>
            <h2
              id="about-title"
              className="mt-3 font-display text-[clamp(1.9rem,3.5vw,3.15rem)] uppercase leading-[1.04] tracking-[0.005em] text-ink"
            >
              {ABOUT.headline}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Reveal delay={0.05}>
              <p className="text-[1rem] leading-[1.75] text-ink-soft">{ABOUT.body}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="panel h-full border-l-2 !border-l-vice-pink p-5">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 text-vice-pink" aria-hidden="true" />
                  <span className="hud-label !text-ink-soft">{ABOUT.education.label}</span>
                </div>
                <p className="mt-3 text-[1rem] font-semibold leading-snug text-ink">{ABOUT.education.school}</p>
                <p className="mt-2 font-mono text-[0.8rem] text-ink-mute">{ABOUT.education.detail}</p>
              </div>
            </Reveal>
          </div>

          {/* stat cards */}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ABOUT.metrics.map((m, i) => {
              const Icon = METRIC_ICONS[i];
              return (
                <Reveal as="li" key={m.id} delay={0.06 * i}>
                  <div className="panel panel-hover group flex h-full flex-col gap-4 p-4 hover:-translate-y-1 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="hud-label !text-[0.64rem]">{m.id}</span>
                      <Icon className="h-4 w-4 text-ink-mute transition-colors duration-300 group-hover:text-vice-pink" aria-hidden="true" />
                    </div>
                    <CountUp value={m.value} className="stat-num text-[2.5rem] text-sunset sm:text-[2.7rem]" />
                    <div>
                      <p className="font-hud text-[0.82rem] font-bold uppercase leading-tight tracking-[0.1em] text-ink">{m.unit}</p>
                      <p className="mt-1.5 text-[0.78rem] leading-snug text-ink-mute">{m.subtitle}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          {/* research domains */}
          <Reveal>
            <div className="flex items-center justify-between gap-4">
              <span className="hud-label">{ABOUT.domainsLabel}</span>
              <span className="hud-label hidden sm:block">{ABOUT.domainsCount}</span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {ABOUT.domains.map((d) => (
                <li
                  key={d}
                  className="chip !whitespace-normal !px-3.5 !py-2 !text-[0.74rem] !text-ink transition-colors duration-300 hover:!border-vice-pink/60 hover:!bg-vice-pink/10"
                >
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <StageFooter id="about" left={ABOUT.footer[0]} right={ABOUT.footer[1]} />
    </SectionShell>
  );
};
