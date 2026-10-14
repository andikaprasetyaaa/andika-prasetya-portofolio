import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, GitBranch, Layers, Activity } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const metrics = [
    {
      id: 'METRIC_01',
      value: '3.91',
      unit: '/ 4.00 GPA',
      subtitle: 'Highest Distinction',
      icon: Award,
    },
    {
      id: 'METRIC_02',
      value: '18+',
      unit: 'AI Systems',
      subtitle: 'Shipped To Production',
      icon: Layers,
    },
    {
      id: 'METRIC_03',
      value: '08',
      unit: 'Core Protocols',
      subtitle: 'Featured AI Projects',
      icon: GitBranch,
    },
    {
      id: 'METRIC_04',
      value: '99.4%',
      unit: 'Pipeline SLA',
      subtitle: 'Automated Uptime',
      icon: Activity,
    },
  ];

  const domains = [
    'LLM RAG & Knowledge Graphs',
    'Low-Resource Multilingual NLP',
    'High-Throughput ETL & Event Streams',
    'Computer Vision Kinematics',
    'Autonomous Multi-Agent Swarms',
  ];

  return (
    <section
      id="about"
      className="relative w-full min-h-screen px-gutter-mobile md:px-gutter lg:px-margin py-space-xl flex flex-col justify-between border-t border-[#1c1b1b] bg-[#0e0e0e]/75 backdrop-blur-[2px] select-none"
    >
      {/* Ambient Radial Spotlight */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.04)_0%,transparent_60%)]"></div>

      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 relative z-10">
        {/* Top Technical Tracker Header */}
        <div className="w-full flex items-center justify-between pb-space-lg mb-space-md border-b border-[#1c1b1b]">
          <div className="flex items-center gap-space-sm">
            <span className="w-2 h-2 bg-white"></span>
            <span className="font-mono text-[11px] text-white tracking-widest uppercase font-semibold">
              [ 02 // PERSONA &amp; QUANTITATIVE RECORD ]
            </span>
          </div>

          <div className="hidden md:flex items-center gap-space-lg font-mono text-[9px] text-[#8e9192] uppercase">
            <span className="flex items-center gap-1.5 text-[#c4c7c8]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              SYS_STATUS: NOMINAL
            </span>
            <span className="text-[#353534]">|</span>
            <span>INDEX REF: ARCH-PERS-2026</span>
            <span className="text-[#353534]">|</span>
            <span className="text-white font-semibold">SECURITY TIER: ALPHA</span>
          </div>
        </div>

        {/* Asymmetric 12-Column Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-space-xl items-start my-auto py-4">
          {/* Left Column: Portrait & Cryptic Telemetry (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col gap-space-lg"
          >
            {/* Technical Specification Dossier Card */}
            <div className="bg-[#131313] border border-[#201f1f] p-space-md flex flex-col gap-space-sm shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-space-xs border-b border-[#201f1f]">
                <span className="font-mono text-[9px] text-[#8e9192] tracking-widest uppercase">
                  OPERATOR // DOSSIER
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  VERIFIED IDENT
                </span>
              </div>

              <div className="flex flex-col gap-1 py-1">
                <span className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight">
                  I PUTU ANDIKA PRASETYA
                </span>
                <span className="font-mono text-xs text-[#c4c7c8] tracking-wider uppercase">
                  AI ENGINEER & AUTOMATION SPECIALIST
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1c1b1b] font-mono text-[10px]">
                <div className="bg-[#1c1b1b] p-2 flex flex-col gap-0.5">
                  <span className="text-[#8e9192] text-[9px] uppercase">DEGREE</span>
                  <span className="text-white font-semibold">S.Kom (Data Science)</span>
                </div>
                <div className="bg-[#1c1b1b] p-2 flex flex-col gap-0.5">
                  <span className="text-[#8e9192] text-[9px] uppercase">GPA RECORD</span>
                  <span className="text-white font-semibold">3.91 / 4.00 (Summa)</span>
                </div>
                <div className="bg-[#1c1b1b] p-2 flex flex-col gap-0.5">
                  <span className="text-[#8e9192] text-[9px] uppercase">SYSTEM CORE</span>
                  <span className="text-white font-semibold">NLP & GraphRAG</span>
                </div>
                <div className="bg-[#1c1b1b] p-2 flex flex-col gap-0.5">
                  <span className="text-[#8e9192] text-[9px] uppercase">AVAILABILITY</span>
                  <span className="text-white font-semibold">OPEN FOR HIRE</span>
                </div>
              </div>
            </div>

            {/* Monospace Micro-Bio Callout Box */}
            <div className="bg-[#131313] border border-[#201f1f] p-space-md relative overflow-hidden shadow-lg">
              <div className="flex items-start gap-space-sm">
                <span className="font-mono text-sm text-white font-bold select-none">&gt;</span>
                <p className="font-mono text-xs sm:text-[13px] text-[#e5e2e1] leading-relaxed">
                  "I build intelligent systems from raw data to something that actually works. Models, retrieval, APIs, automation, databases."
                </p>
              </div>

              <div className="mt-space-sm p-space-sm bg-[#1c1b1b] border-l-2 border-white">
                <span className="font-mono text-[9px] text-white uppercase font-semibold tracking-wider block">
                  Current Focus:
                </span>
                <p className="font-mono text-[11px] text-[#c4c7c8] mt-0.5">
                  Making machines understand text, retrieve the right context, and do useful things with it.
                </p>
              </div>

              <div className="mt-space-sm pt-space-xs flex items-center justify-between text-[#8e9192] border-t border-[#1c1b1b]">
                <span className="font-mono text-[9px] tracking-wider">DOMAIN: andikaprasetya.dev</span>
                <span className="font-mono text-[9px] tracking-wider text-white">INFERENCE: FP8_OPTIMIZED</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Discourse & Metrics Matrix (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col justify-between gap-space-lg"
          >
            {/* Macro Display Headline */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-widest">
                DISCIPLINE // CORE ARCHITECTURE
              </span>
              <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-[40px] leading-tight text-white tracking-tighter uppercase">
                ENGINEERING AT THE INTERSECTION OF DEEP LEARNING &amp; DETERMINISTIC SCALE.
              </h2>
            </div>

            {/* Editorial Discourse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
              <div className="flex flex-col gap-space-xs">
                <p className="font-sans text-sm sm:text-base text-[#c4c7c8] leading-relaxed text-justify">
                  Bridging foundational algorithmic rigor with production systems engineering. My trajectory anchors on resolving computational friction within multilingual NLP frameworks and transforming probabilistic LLM uncertainty into deterministic execution graphs.
                </p>
              </div>

              <div className="flex flex-col gap-space-xs bg-[#131313] p-space-md border border-[#201f1f] border-l-2 border-l-white">
                <span className="font-mono text-[9px] text-white uppercase tracking-widest font-semibold">
                  EDUCATION // BACKGROUND
                </span>
                <p className="font-sans text-sm sm:text-base text-white font-semibold mt-1">
                  Universitas Udayana — B.Sc. Information Technology (Data Science)
                </p>
                <p className="font-mono text-xs text-[#c4c7c8]">
                  GPA 3.91 (Highest Distinction), Graduated 2026
                </p>
              </div>
            </div>

            {/* Key Quantitative Metrics Grid (4 Stat Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              {metrics.map((m) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.id}
                    className="group bg-[#131313] p-space-md flex flex-col justify-between gap-space-sm border border-[#201f1f] transition-all duration-300 hover:-translate-y-1 hover:border-[#444748] hover:bg-[#1c1b1b] shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-[#8e9192] uppercase">{m.id}</span>
                      <IconComponent className="w-3.5 h-3.5 text-[#8e9192] group-hover:text-white transition-colors" />
                    </div>
                    <div className="font-headline text-3xl font-bold text-white tracking-tight">
                      {m.value}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-white uppercase font-medium">
                        {m.unit}
                      </span>
                      <span className="font-mono text-[9px] text-[#8e9192]">{m.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Research Interests Pill Tags */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-wider">
                  PRIMARY INVESTIGATION DOMAINS
                </span>
                <span className="font-mono text-[9px] text-[#c4c7c8]">
                  [ N=05 AXES ]
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {domains.map((dom) => (
                  <span
                    key={dom}
                    className="px-3 py-1 bg-[#131313] border border-[#201f1f] text-white hover:bg-white hover:text-black transition-colors font-mono text-[10px] uppercase cursor-default"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section Bottom Indicator */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-[#1c1b1b] opacity-50">
          <span className="font-mono text-[9px] text-[#8e9192] uppercase">
            STAGE [02 / 06] // QUANTITATIVE PROFILE
          </span>
          <span className="font-mono text-[9px] text-[#8e9192] uppercase">
            STATUS: CERTIFIED
          </span>
        </div>
      </div>
    </section>
  );
};

