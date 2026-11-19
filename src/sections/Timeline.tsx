import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { TIMELINE } from '../data/content';
import { pad2 } from '../lib/math';
import { useReducedMotionPref } from '../lib/settings';
import { ChapterTitle, Reveal, SectionShell, StatusDot } from '../components/ui';

export const Timeline: React.FC = () => {
  const reduced = useReducedMotionPref();
  const routeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: routeRef, offset: ['start 72%', 'end 55%'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const edu = TIMELINE.education;

  return (
    <SectionShell id="timeline" labelledBy="timeline-title">
      <ChapterTitle
        id="timeline"
        titleId="timeline-title"
        heading={
          <>
            THE <span className="text-sunset">RECORD</span>
          </>
        }
        lead={TIMELINE.lead}
      />

      {/* Clean scroll-drawn route */}
      <div ref={routeRef} className="relative pl-9 xs:pl-11 sm:pl-14">
        <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-0.5 rounded-full bg-white/10 xs:left-[13px] sm:left-[19px]" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-3 left-[11px] top-3 w-0.5 origin-top rounded-full xs:left-[13px] sm:left-[19px]"
          style={{
            scaleY: reduced ? 1 : drawn,
            background: 'linear-gradient(180deg, #ffc46b, #ff5fa8 55%, #9d6bff)',
            boxShadow: '0 0 14px rgba(255, 95, 168, 0.5)',
          }}
        />

        <ol className="flex flex-col gap-5 sm:gap-6">
          {TIMELINE.experiences.map((exp, i) => (
            <Reveal as="li" key={exp.role} delay={0.05 * i} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-9 top-5 flex h-6 w-6 items-center justify-center rounded-full border font-hud text-[0.7rem] font-bold xs:-left-11 xs:h-7 xs:w-7 sm:-left-14 sm:top-6 sm:h-9 sm:w-9 sm:text-xs ${
                  exp.current
                    ? 'border-transparent bg-sunset text-night-950 shadow-glow'
                    : 'border-white/20 bg-night-850 text-ink-soft'
                }`}
              >
                {pad2(i + 1)}
              </span>

              <article className={`panel panel-hover p-5 sm:p-7 ${exp.current ? 'panel-accent' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-hud text-xs font-bold tracking-[0.16em] text-vice-amber sm:text-sm">{exp.period}</span>
                  <span className="hud-label flex items-center gap-2 !text-[0.72rem] !text-ink-soft">
                    <StatusDot tone={exp.current ? 'teal' : 'amber'} ping={exp.current} />
                    {exp.status}
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-[clamp(1.4rem,2.6vw,2.05rem)] font-bold uppercase leading-[1.06] tracking-[0.02em] text-ink">
                  {exp.role} <span className="text-ink-faint">&mdash;</span> <span className="text-sunset">{exp.company}</span>
                </h3>

                <p className="mt-2.5 max-w-3xl text-sm leading-[1.7] text-ink-soft sm:text-base">{exp.description}</p>

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

          {/* Education finale */}
          <Reveal as="li" delay={0.12} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-9 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-vice-amber/60 bg-night-850 text-vice-amber xs:-left-11 xs:h-7 xs:w-7 sm:-left-14 sm:top-6 sm:h-9 sm:w-9"
            >
              <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>

            <article className="panel panel-accent relative overflow-hidden p-5 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(255,196,107,0.2), transparent 70%)' }}
              />

              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="font-hud text-xs font-bold tracking-[0.18em] text-vice-amber sm:text-sm">{edu.badge}</span>
                  <h3 className="mt-1.5 font-display text-[clamp(1.65rem,3vw,2.5rem)] font-bold uppercase leading-tight tracking-[0.02em] text-ink">
                    {edu.school}
                  </h3>
                  <p className="mt-1 font-hud text-sm font-semibold uppercase tracking-[0.1em] text-ink-soft sm:text-base">
                    {edu.degree}
                  </p>
                </div>
                <p className="stat-num text-[2rem] text-sunset sm:text-[2.7rem]">{edu.gpa}</p>
              </div>

              <p className="relative mt-3.5 max-w-3xl text-sm leading-[1.7] text-ink-soft sm:text-base">{edu.description}</p>

              <ul className="relative mt-5 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                {edu.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </ol>
      </div>
    </SectionShell>
  );
};
