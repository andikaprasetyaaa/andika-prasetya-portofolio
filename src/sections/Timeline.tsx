import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Award, Briefcase, CheckCircle2, GraduationCap } from 'lucide-react';
import { TIMELINE } from '../data/content';
import { useReducedMotionPref } from '../lib/settings';
import { ChapterTitle, Reveal, SectionShell, StageFooter, StatusDot } from '../components/ui';

export const Timeline: React.FC = () => {
  const reduced = useReducedMotionPref();
  const routeRef = useRef<HTMLDivElement>(null);
  // the route line "draws" itself as you travel down the list, like a GPS trace
  const { scrollYProgress } = useScroll({ target: routeRef, offset: ['start 72%', 'end 55%'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const edu = TIMELINE.education;

  return (
    <SectionShell id="timeline" labelledBy="timeline-title">
      <ChapterTitle id="timeline" status={[TIMELINE.dept]} />

      <Reveal className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
        <h2
          id="timeline-title"
          className="font-display text-[clamp(2.2rem,5vw,4.1rem)] uppercase leading-[0.98] tracking-[0.005em] text-ink"
        >
          {TIMELINE.heading}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {TIMELINE.chips.map((c) => (
            <li key={c} className="chip !py-2 !text-ink">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Briefcase className="h-4 w-4 text-vice-pink" aria-hidden="true" />
          <h3 className="font-hud text-[0.86rem] font-bold uppercase tracking-[0.16em] text-ink">{TIMELINE.rolesLabel}</h3>
        </div>
        <span className="hud-label hidden sm:block">{TIMELINE.rolesCount}</span>
      </Reveal>

      {/* route with waypoints */}
      <div ref={routeRef} className="relative pl-10 sm:pl-16">
        <span aria-hidden="true" className="absolute bottom-3 left-[13px] top-3 w-0.5 rounded-full bg-white/10 sm:left-[23px]" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-3 left-[13px] top-3 w-0.5 origin-top rounded-full sm:left-[23px]"
          style={{
            scaleY: reduced ? 1 : drawn,
            background: 'linear-gradient(180deg, #ffc46b, #ff5fa8 55%, #9d6bff)',
            boxShadow: '0 0 14px rgba(255, 95, 168, 0.55)',
          }}
        />
        <ol className="flex flex-col gap-6">

        {TIMELINE.experiences.map((exp, i) => (
          <Reveal as="li" key={exp.role} delay={0.05 * i} className="relative">
            {/* waypoint marker */}
            <span
              aria-hidden="true"
              className={`absolute -left-10 top-6 flex h-7 w-7 items-center justify-center rounded-md border font-hud text-[0.72rem] font-bold sm:-left-16 sm:h-8 sm:w-12 ${
                exp.current
                  ? 'border-transparent bg-sunset text-night-950 shadow-glow'
                  : 'border-white/20 bg-night-850 text-ink-soft'
              }`}
            >
              <span className="hidden sm:inline">WP&nbsp;</span>
              {i + 1}
            </span>

            <article className={`panel panel-hover p-5 sm:p-6 ${exp.current ? 'panel-accent' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <span className="rounded-[4px] bg-white/[0.07] px-2.5 py-1 font-mono text-[0.76rem] font-semibold text-ink">{exp.period}</span>
                <span className="hud-label flex items-center gap-2 !text-ink-soft">
                  <StatusDot tone={exp.current ? 'teal' : 'amber'} ping={exp.current} />
                  {exp.status}
                </span>
              </div>
              <h4 className="mt-4 font-display text-[1.55rem] uppercase leading-[1.05] text-ink sm:text-[1.9rem]">
                {exp.role} <span className="text-ink-faint">//</span> <span className="text-sunset">{exp.company}</span>
              </h4>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-[1.7] text-ink-soft">{exp.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {exp.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}

        {/* education — the destination marker */}
        <Reveal as="li" delay={0.1} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-10 top-6 flex h-7 w-7 items-center justify-center rounded-md border border-vice-amber/60 bg-night-850 text-vice-amber sm:-left-16 sm:h-8 sm:w-12"
          >
            <GraduationCap className="h-4 w-4" />
          </span>

          <article className="panel relative overflow-hidden p-5 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,196,107,0.22), transparent 70%)' }}
            />
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-sunset" />

            <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
              <span className="rounded-[4px] bg-white/[0.07] px-2.5 py-1 font-mono text-[0.76rem] font-semibold text-ink">{edu.badge}</span>
              <span className="flex items-center gap-2 font-hud text-[0.78rem] font-bold uppercase tracking-[0.12em] text-vice-gold">
                <Award className="h-4 w-4 shrink-0" aria-hidden="true" />
                {edu.gpa}
              </span>
            </div>

            <div className="relative mt-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h4 className="font-display text-[1.8rem] uppercase leading-none text-ink sm:text-[2.3rem]">{edu.school}</h4>
              <p className="font-hud text-[0.92rem] font-semibold text-ink">
                {edu.degree} <span className="text-ink-faint">//</span> <span className="font-medium text-ink-mute">{edu.specialization}</span>
              </p>
            </div>

            <p className="relative mt-4 max-w-4xl text-[0.98rem] leading-[1.7] text-ink-soft">{edu.description}</p>

            <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
              <ul className="flex flex-wrap gap-2">
                {edu.chips.map((c, i) => (
                  <li key={c} className={`chip ${i === edu.chips.length - 1 ? '!border-vice-amber/50 !text-vice-gold' : ''}`}>
                    {c}
                  </li>
                ))}
              </ul>
              <span className="hud-label flex items-center gap-2 !text-[0.66rem]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-vice-teal" aria-hidden="true" />
                {edu.audit}
              </span>
            </div>
          </article>
        </Reveal>
        </ol>
      </div>

      <StageFooter id="timeline" left={TIMELINE.footer[0]} right={TIMELINE.footer[1]} />
    </SectionShell>
  );
};
