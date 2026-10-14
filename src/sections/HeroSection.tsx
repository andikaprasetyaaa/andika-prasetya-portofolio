import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroMesh } from '../three/HeroMesh';
import { useMousePosition } from '../hooks/useMousePosition';
import { scrollToSection } from '../lib/lenis';
import { ArrowDown, Cpu, Activity, Zap } from 'lucide-react';
import { soundManager } from '../components/SoundManager';

export const HeroSection: React.FC = () => {
  const mouse = useMousePosition();
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = [
    'AI ENGINEER',
    'MACHINE LEARNING',
    'DATA ENGINEERING',
    'NLP & LLMS',
    'AGENTIC WORKFLOWS',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles.length]);

  const handleCtaClick = (id: string) => {
    soundManager.playClick();
    scrollToSection(id);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between pt-16 pb-12 px-gutter-mobile md:px-gutter lg:px-margin select-none overflow-hidden"
    >
      {/* Atmospheric Monochromatic Ambient Flares */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="pointer-events-none absolute top-1/3 -right-24 w-[550px] h-[550px] bg-gradient-to-bl from-white/10 via-[#2a2a2a]/20 to-transparent rounded-full blur-3xl opacity-40"></div>

      {/* Top Decorative Monospace Vector Line */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 opacity-60 z-10">
        <div className="flex items-center gap-space-sm font-mono text-[9px] text-[#c4c7c8] uppercase tracking-widest">
          <span>LOC // 8.3405° S, 115.0920° E</span>
          <span className="w-1 h-1 bg-[#8e9192]"></span>
          <span>NODE // ID_DPS_CORE</span>
        </div>
        <div className="hidden sm:flex items-center gap-space-xs font-mono text-[9px] text-[#8e9192] tracking-widest uppercase">
          <span>SECURITY_LAYER: ED25519</span>
          <span>•</span>
          <span className="text-white font-bold">SHA-256 VERIFIED</span>
        </div>
      </div>

      {/* Central Editorial Split Composition */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center my-auto z-10">
        {/* Left Column: Monumental Typographic Block (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col z-10"
        >
          {/* Subhead Tag */}
          <div className="inline-flex items-center gap-space-sm self-start px-space-sm py-1 bg-[#1c1b1b] text-[#c4c7c8] border border-[#2a2a2a] mb-space-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="font-mono text-[11px] uppercase text-[#e5e2e1] tracking-wider font-medium">
              [ 01 // ARTIFICIAL INTELLIGENCE &amp; SYSTEMS AUTOMATION ]
            </span>
          </div>

          {/* Monolithic Title */}
          <div className="relative">
            <h1 className="font-headline font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[78px] leading-tight text-white tracking-tighter uppercase drop-shadow-sm select-none">
              I PUTU ANDIKA PRASETYA
            </h1>
            <div className="flex items-center gap-space-md mt-space-xs">
              <span className="font-mono text-xs sm:text-sm text-[#8e9192] tracking-widest uppercase font-medium">
                AI ENGINEER &amp; AUTOMATION SPECIALIST
              </span>
              <span className="hidden sm:inline-block w-8 h-px bg-[#444748]"></span>
            </div>
          </div>

          {/* Dynamic Monospace Ticker */}
          <div className="mt-space-lg flex items-center gap-space-sm bg-[#0e0e0e] border border-[#201f1f] px-space-md py-space-sm self-start shadow-xl">
            <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-widest">
              ROLE //
            </span>
            <div className="relative h-6 overflow-hidden w-64 md:w-80 font-mono text-[13px] font-semibold tracking-wider text-white">
              <motion.div
                key={roleIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-6 flex items-center"
              >
                {roles[roleIndex]}
              </motion.div>
            </div>
          </div>

          {/* Precision Micro-Editorial Paragraph */}
          <p className="mt-space-lg max-w-xl font-sans text-base sm:text-lg text-[#c4c7c8] leading-relaxed">
            Engineering deterministic intelligence, autonomous agentic workflows, and high-throughput natural language systems with mathematical rigor.
          </p>

          {/* High-Impact Action Triggers */}
          <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
            <button
              onClick={() => handleCtaClick('projects')}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-headline text-base font-bold hover:bg-[#c7c6c6] transition-all duration-300 rounded-none shadow-xl cursor-pointer"
            >
              <span className="flex items-center gap-2">
                EXPLORE ARTIFACTS
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
              </span>
            </button>

            <button
              onClick={() => handleCtaClick('about')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2a2a2a] text-[#e5e2e1] font-mono text-xs uppercase hover:bg-[#3a3939] hover:text-white transition-all duration-200 border border-[#444748] rounded-none shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>SYSTEM VITALS [3.91 GPA]</span>
            </button>
          </div>

          {/* Micro Feature Metric Badges */}
          <div className="mt-space-lg pt-space-md flex flex-wrap items-center gap-space-lg text-[#444748] font-mono text-[9px] border-t border-[#1c1b1b]">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-white" />
              <span className="text-white font-bold">12+</span>
              <span className="text-[#c4c7c8]">AUTONOMOUS PIPELINES</span>
            </div>
            <span className="hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-white" />
              <span className="text-white font-bold">99.8%</span>
              <span className="text-[#c4c7c8]">RAG FIDELITY</span>
            </div>
            <span className="hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-white" />
              <span className="text-white font-bold">&lt; 150MS</span>
              <span className="text-[#c4c7c8]">EDGE INFERENCE</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive 3D Spatial Visualizer (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          {/* Radar Telemetry Geometric Rings */}
          <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#0e0e0e]/80 border border-[#201f1f] flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-[#2a2a2a]/60 flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full border border-[#353534]/40"></div>
            </div>
          </div>

          {/* Precision Hairline Reticles */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-px bg-[#201f1f]"></div>
            <div className="h-full w-px bg-[#201f1f] absolute"></div>
          </div>

          {/* Corner Notations */}
          <div className="absolute top-2 left-2 font-mono text-[9px] text-[#8e9192] uppercase tracking-widest z-20 pointer-events-none">
            [ 3D_VIEWPORT // SPATIAL_MATRIX ]
          </div>
          <div className="absolute top-2 right-2 font-mono text-[9px] text-[#8e9192] tracking-widest z-20 pointer-events-none">
            +48.192.00
          </div>
          <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#8e9192] uppercase tracking-widest z-20 pointer-events-none">
            INSPECTOR: ACTIVE
          </div>
          <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[#8e9192] tracking-widest z-20 pointer-events-none">
            FPS // 60.0
          </div>

          {/* Primary Focal Three.js Container */}
          <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] xl:w-[480px] xl:h-[480px] z-10 flex items-center justify-center bg-[#0e0e0e]/60 backdrop-blur-md border border-[#2a2a2a] shadow-2xl overflow-hidden">
            <HeroMesh mouse={mouse} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-4 opacity-50 z-10">
        <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-wider">
          SCROLL TO COMMENCE INQUIRY
        </span>
        <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-wider">
          STAGE [01 / 06]
        </span>
      </div>
    </section>
  );
};

