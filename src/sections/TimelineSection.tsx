import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const experiences = [
    {
      period: '7 SEP 2026 — PRESENT',
      status: 'PRODUCTION ACTIVE',
      role: 'AI Automation Specialist',
      company: 'PT In Fashion',
      description:
        'Architected fashion logistics and inventory neural pipelines with computer vision semantic segmentation, multi-camera OCR barcode tracking, and distributed telemetry syncing.',
      tags: ['CV SEGMENTATION', 'OCR PIPELINE', 'NEURAL AUTOMATION', 'DOCKER'],
    },
    {
      period: 'APR 2026 — JUN 2026',
      status: 'ANALYTICS & BI',
      role: 'Data Analyst',
      company: 'PT Indo Apps Solusindo',
      description:
        'Spearheaded enterprise data modeling, automated ETL pipelines, predictive customer retention scoring, and high-frequency analytical dashboards across multi-client software ecosystems.',
      tags: ['ETL PIPELINES', 'PREDICTIVE MODELING', 'BUSINESS TELEMETRY', 'SQL'],
    },
    {
      period: '2024',
      status: 'GOOGLE & GOTO CONSORTIUM',
      role: 'Android Developer',
      company: 'Bangkit Academy 2024',
      description:
        'Graduated with distinction; built native Android applications integrating on-device TensorFlow Lite neural models, clean architecture with Jetpack Compose, and background task management.',
      tags: ['KOTLIN / COMPOSE', 'TENSORFLOW LITE', 'CLEAN ARCHITECTURE'],
    },
  ];

  return (
    <section
      id="timeline"
      className="relative w-full min-h-screen px-gutter-mobile md:px-gutter lg:px-margin py-space-xl flex flex-col justify-between border-t border-[#1c1b1b] bg-[#0a0a0a]/75 backdrop-blur-[2px] select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 relative z-10">
        {/* Top Header */}
        <div className="w-full pb-6 mb-4 border-b border-[#1c1b1b]">
          <div className="flex items-center gap-space-sm mb-2">
            <span className="w-2 h-2 bg-white"></span>
            <span className="font-mono text-[11px] text-[#8e9192] tracking-widest uppercase">
              [ 05 // CHRONOLOGY &amp; ENGINEERING PRACTICE ]
            </span>
            <span className="text-[#353534]">/</span>
            <span className="font-mono text-[9px] text-[#8e9192] uppercase">
              DEPT: AI AUTOMATION &amp; DATA SYSTEMS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <h2 className="font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
              EXPERIENCE &amp; TECHNICAL RECORD
            </h2>
            <div className="flex items-center gap-space-sm font-mono text-[9px] text-[#8e9192] uppercase pb-1">
              <span className="px-2 py-0.5 bg-[#1c1b1b] text-white border border-[#2a2a2a]">
                STATUS: PRODUCTION SPECIALIST
              </span>
              <span className="px-2 py-0.5 bg-[#1c1b1b] text-white border border-[#2a2a2a]">
                GPA: 3.91 HIGHEST DISTINCTION
              </span>
            </div>
          </div>
        </div>

        {/* Chronological Grid */}
        <div className="flex flex-col gap-6 my-auto py-4">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1c1b1b]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-white" />
              <h3 className="font-mono text-xs text-white uppercase font-bold tracking-wider">
                PROFESSIONAL INDUSTRY ROLES
              </h3>
            </div>
            <span className="font-mono text-[9px] text-[#8e9192] uppercase">
              [ 3 PRODUCTION MILESTONES ]
            </span>
          </div>

          {/* 3 Industry Roles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experiences.map((exp, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-space-md bg-[#131313] border border-[#201f1f] hover:border-[#444748] transition-colors shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-space-sm mb-2">
                    <span className="font-mono text-[9px] text-white bg-[#201f1f] px-2 py-0.5 font-semibold">
                      {exp.period}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-wider">
                        {exp.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-headline font-bold text-lg text-white">
                    {exp.role} <span className="text-[#8e9192] font-normal">//</span> {exp.company}
                  </h4>

                  <p className="font-sans text-xs text-[#c4c7c8] mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-1.5 mt-auto">
                  {exp.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] text-[#c4c7c8] bg-[#0e0e0e] px-2 py-0.5 border border-[#1a1919]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Prominent Education Block */}
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-space-md lg:p-space-lg bg-[#131313] border border-[#201f1f] border-l-4 border-l-white hover:border-[#444748] transition-colors shadow-md mt-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[10px] text-white bg-[#201f1f] px-2.5 py-1 font-bold">
                CLASS OF 2026 // ACCREDITED DEGREE
              </span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-white" />
                <span className="font-mono text-[10px] text-white font-bold tracking-wider uppercase">
                  GPA: 3.91 / 4.00 (SUMMA CUM LAUDE EQUIVALENT)
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-white shrink-0" />
                <h4 className="font-headline font-bold text-xl text-white">
                  Universitas Udayana
                </h4>
              </div>
              <span className="font-mono text-xs text-[#e5e2e1] font-semibold">
                B.Sc. Information Technology <span className="text-[#8e9192] font-normal">// Specialization in Data Science</span>
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#c4c7c8] mt-3 leading-relaxed max-w-4xl">
              Rigorous academic curriculum in Artificial Intelligence, Linear Algebra, Distributed Systems, Deep Learning Optimization, and Natural Language Processing. Undergraduate thesis solving factual hallucination in low-resource Indonesian summarization via IndoBERT NLI and IndoT5.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#1c1b1b] mt-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[9px] text-[#c4c7c8] bg-[#0e0e0e] px-2 py-0.5 border border-[#1a1919]">
                  MAJOR: DATA SCIENCE
                </span>
                <span className="font-mono text-[9px] text-[#c4c7c8] bg-[#0e0e0e] px-2 py-0.5 border border-[#1a1919]">
                  THESIS: NLP &amp; NLI SUMMARIZATION
                </span>
                <span className="font-mono text-[9px] text-white bg-[#201f1f] px-2 py-0.5 font-semibold">
                  GPA 3.91 / 4.00
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#8e9192]">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>INSTITUTION ID: #UNUD-TI-2026 // VERIFIED AUDIT</span>
              </div>
            </div>
          </motion.article>
        </div>

        {/* Bottom Section Footprint */}
        <div className="w-full pt-space-md border-t border-[#1c1b1b] flex flex-col sm:flex-row items-center justify-between gap-2 opacity-60">
          <span className="font-mono text-[9px] text-[#8e9192] uppercase">
            STAGE [05 / 06] // VERIFIED PROFESSIONAL &amp; ACADEMIC RECORD
          </span>
          <span className="font-mono text-[9px] text-white uppercase font-semibold">
            STATUS: ACTIVE PRODUCTION SPECIALIST
          </span>
        </div>
      </div>
    </section>
  );
};
