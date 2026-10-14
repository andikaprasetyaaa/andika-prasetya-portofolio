import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS, Project } from '../lib/projectsData';
import { ProjectModal } from '../components/ProjectModal';
import { soundManager } from '../components/SoundManager';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { ProjectVisualizer3D } from '../three/ProjectVisualizer3D';

const SHAPE_LABELS: Record<string, string> = {
  boxing: '3D PRO BOXING GLOVE',
  'ufc-octagon': '3D UFC OCTAGON CAGE',
  newspaper: '3D NEWS DOCUMENT SCAN',
  'fashion-hanger': '3D GARMENT & HANGER',
  'discount-tag': '3D DISCOUNT PRICE TAG',
  'shopping-cart': '3D SHOPPING CART & PULSE',
  'chat-shield': '3D CHAT BUBBLE & SHIELD',
  'vision-apple': '3D VISION AI RETICLE',
};

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (direction: 'left' | 'right') => {
    soundManager.playSlide();
    if (!trackRef.current) return;
    const cardWidth = 560;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const cardWidth = 560;
    const index = Math.min(
      PROJECTS.length,
      Math.max(1, Math.round(trackRef.current.scrollLeft / cardWidth) + 1)
    );
    setActiveIndex(index);
  };

  const openModal = (proj: Project) => {
    soundManager.playClick();
    setSelectedProject(proj);
  };

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen px-gutter-mobile md:px-gutter lg:px-margin py-space-xl flex flex-col justify-between border-t border-[#1c1b1b] bg-[#0a0a0a]/75 backdrop-blur-[2px] select-none overflow-hidden"
    >
      {/* Ambient background flares */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]"></div>

      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 relative z-10">
        {/* Section Header */}
        <header className="w-full mb-space-lg">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-sm">
              <span className="w-2 h-2 bg-white"></span>
              <span className="font-mono text-[11px] text-[#c4c7c8] tracking-wider uppercase font-semibold">
                [ 03 // SELECTED WORKS &amp; SYSTEM DEPLOYMENTS ]
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2">
              <div>
                <h2 className="font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
                  PRODUCTION PROTOCOLS
                </h2>
                <p className="font-mono text-xs text-[#8e9192] mt-1 uppercase tracking-widest">
                  MISSION-CRITICAL NEURAL AGENTS &amp; EDGE DISTRIBUTIONS
                </p>
              </div>

              {/* Slider Controls & Counter */}
              <div className="flex items-center gap-space-md">
                <div className="bg-[#1c1b1b] border border-[#2a2a2a] px-3.5 py-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span className="font-mono text-[11px] text-white tracking-widest uppercase">
                    CARD [0{activeIndex} / 0{PROJECTS.length}]
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollTrack('left')}
                    aria-label="Previous Project"
                    className="px-3 py-1.5 bg-[#1c1b1b] hover:bg-white text-[#e5e2e1] hover:text-black font-mono text-[11px] uppercase transition-colors flex items-center gap-1 border border-[#2a2a2a]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PREV</span>
                  </button>
                  <button
                    onClick={() => scrollTrack('right')}
                    aria-label="Next Project"
                    className="px-3 py-1.5 bg-white text-black hover:bg-[#c7c6c6] font-mono text-[11px] uppercase transition-colors flex items-center gap-1 font-semibold"
                  >
                    <span className="hidden sm:inline">NEXT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Horizontal Scroll Track */}
        <div className="relative w-full my-auto py-2">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="w-full flex gap-space-lg overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar focus:outline-none"
          >
            {PROJECTS.map((proj, idx) => (
              <motion.article
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="snap-start shrink-0 w-[90vw] sm:w-[500px] lg:w-[540px] bg-[#131313] border border-[#201f1f] group flex flex-col justify-between p-space-lg transition-all duration-300 hover:border-[#444748] hover:bg-[#1a1919] shadow-2xl relative cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Subtle Hover Gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex flex-col gap-space-md">
                  {/* Card Header ID */}
                  <div className="flex items-center justify-between pb-space-xs bg-[#0e0e0e] border border-[#201f1f] px-space-sm py-1">
                    <span className="font-mono text-[9px] text-white uppercase tracking-widest font-semibold">
                      DEPLOYMENT_ID // {proj.deploymentId}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#e5e2e1] bg-[#201f1f] px-2 py-0.5 uppercase border border-[#2a2a2a]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {proj.badge}
                    </span>
                  </div>

                  {/* 3D Wireframe Telemetry Viewport */}
                  <div className="w-full h-32 bg-[#0a0a0a] border border-[#201f1f] relative overflow-hidden flex flex-col justify-between p-2">
                    <div className="flex items-center justify-between text-[#8e9192] font-mono text-[9px] z-10">
                      <span>[ {SHAPE_LABELS[proj.wireframeShape] || '3D SCHEMATIC'} ]</span>
                      <span className="flex items-center gap-1 text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        ONLINE
                      </span>
                    </div>

                    {/* 3D Interactive Model (Optimized: rendered for active and hovered cards) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {Math.abs(idx + 1 - activeIndex) <= 1 || hoveredIdx === idx ? (
                        <ProjectVisualizer3D shape={proj.wireframeShape} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(#201f1f_1px,transparent_1px)] [background-size:12px_12px] opacity-60">
                          <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '14s' }}>
                            <div className="w-4 h-4 border border-white/40 rotate-45" />
                          </div>
                          <span className="font-mono text-[8px] text-[#8e9192] uppercase tracking-widest mt-2">
                            STANDBY // HOVER FOR 3D
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center font-mono text-[9px] text-[#c4c7c8] z-10 bg-[#0e0e0e]/80 px-2 py-0.5 backdrop-blur-sm border-t border-[#1c1b1b]">
                      <span>{proj.metricLabel}</span>
                      <span className="text-white font-bold">{proj.metricValue}</span>
                    </div>
                  </div>

                  {/* Project Titles */}
                  <div>
                    <p className="font-mono text-[10px] text-[#8e9192] uppercase tracking-wider mb-1">
                      {proj.subtitle}
                    </p>
                    <h3 className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-white transition-colors">
                      {proj.title}
                    </h3>
                  </div>

                  {/* Narrative snippet */}
                  <p className="font-sans text-xs sm:text-sm text-[#c4c7c8] leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>
                </div>

                {/* Footer Tag Pills & Buttons */}
                <div className="relative z-10 mt-space-md flex flex-col gap-space-sm pt-space-sm border-t border-[#201f1f]">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#1c1b1b] border border-[#2a2a2a] font-mono text-[9px] text-[#e5e2e1] uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openModal(proj)}
                      className="flex-1 py-2 px-3 bg-white text-black hover:bg-[#c7c6c6] font-mono text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>INSPECT PROTOCOL</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View GitHub Repository"
                      className="p-2 bg-[#1c1b1b] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white transition-colors flex items-center justify-center"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom Telemetry Bar */}
        <footer className="w-full pt-space-md mt-space-sm flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#1c1b1b] opacity-60">
          <div className="flex items-center gap-space-md font-mono text-[9px] text-[#8e9192] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>CAROUSEL ACTIVE // DRAG OR HORIZONTAL SCROLL</span>
            </span>
            <span className="hidden md:inline">/</span>
            <span className="hidden md:inline">STAGE [03 / 06]</span>
          </div>

          <div className="flex items-center gap-space-sm font-mono text-[9px] text-[#c4c7c8]">
            <span className="text-white font-bold">TOTAL VERIFIED DEPLOYMENTS: 06</span>
          </div>
        </footer>
      </div>

      {/* Blueprint Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

