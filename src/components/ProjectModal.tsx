import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../lib/projectsData';
import { X, ExternalLink, Github, Cpu, Database, Server } from 'lucide-react';
import { soundManager } from './SoundManager';
import { ProjectVisualizer3D } from '../three/ProjectVisualizer3D';

const SHAPE_LABELS: Record<string, string> = {
  boxing: '3D BOXING RING // 4-ROPE PRO',
  'ufc-octagon': '3D UFC OCTAGON CAGE',
  newspaper: '3D NEWS DOCUMENT SCAN',
  'fashion-hanger': '3D GARMENT & HANGER',
  'discount-tag': '3D DISCOUNT PRICE TAG',
  'shopping-cart': '3D SHOPPING CART & PULSE',
  'chat-shield': '3D CHAT BUBBLE & SHIELD',
  'vision-apple': '3D VISION AI RETICLE',
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-[#131313] border border-[#353534] shadow-2xl z-10 max-h-[90vh] overflow-y-auto flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-space-md border-b border-[#201f1f] bg-[#0e0e0e]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="font-mono text-[10px] text-white tracking-widest uppercase">
                  DEPLOYMENT // {project.deploymentId}
                </span>
                <span className="text-[#444748]">|</span>
                <span className="font-mono text-[10px] text-[#8e9192] uppercase">
                  {project.category}
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close blueprint modal"
                className="p-1 text-[#8e9192] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-space-lg md:p-space-xl flex flex-col gap-space-lg">
              {/* Title Header */}
              <div>
                <span className="font-mono text-[11px] text-[#8e9192] uppercase tracking-wider block mb-1">
                  {project.subtitle}
                </span>
                <h2 className="font-headline text-2xl md:text-3xl text-white font-bold tracking-tight">
                  {project.title}
                </h2>
              </div>

              {/* 3D Wireframe CAD Inspection Window */}
              <div className="w-full h-44 sm:h-52 bg-[#0a0a0a] border border-[#201f1f] relative overflow-hidden flex flex-col justify-between p-3">
                <div className="flex items-center justify-between text-[#8e9192] font-mono text-[9px] z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white uppercase font-bold tracking-wider">
                      {SHAPE_LABELS[project.wireframeShape] || '3D CAD SCHEMATIC'}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-[#444748]">PROCEDURAL R3F RENDER</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <ProjectVisualizer3D shape={project.wireframeShape} className="w-full h-full" />
                </div>

                <div className="flex items-center justify-between font-mono text-[9px] text-[#8e9192] z-10 bg-[#0e0e0e]/80 px-2 py-0.5 backdrop-blur-sm border-t border-[#1c1b1b]">
                  <span>RENDER ENGINE: WEBGL / THREE.JS</span>
                  <span className="text-white font-semibold">INTERACTIVE TELEMETRY</span>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-[#1c1b1b] p-3 border border-[#2a2a2a]">
                <div>
                  <span className="font-mono text-[9px] text-[#8e9192] uppercase block">
                    {project.metricLabel}
                  </span>
                  <span className="font-mono text-sm text-white font-bold">
                    {project.metricValue}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#8e9192] uppercase block">
                    {project.architectureLabel}
                  </span>
                  <span className="font-mono text-sm text-white font-semibold">
                    {project.architectureValue}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="font-mono text-[9px] text-[#8e9192] uppercase block">
                    VERIFICATION
                  </span>
                  <span className="font-mono text-sm text-white font-semibold">
                    SHA-256 AUDITED
                  </span>
                </div>
              </div>

              {/* Overview Narrative */}
              <div>
                <h3 className="font-mono text-xs text-[#8e9192] uppercase tracking-wider mb-2">
                  // ARCHITECTURAL OVERVIEW
                </h3>
                <p className="font-sans text-sm md:text-base text-[#e5e2e1] leading-relaxed">
                  {project.fullOverview}
                </p>
              </div>

              {/* Key Features List */}
              <div>
                <h3 className="font-mono text-xs text-[#8e9192] uppercase tracking-wider mb-2">
                  // PROTOCOL CAPABILITIES &amp; SUBROUTINES
                </h3>
                <ul className="flex flex-col gap-2">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-sans text-xs md:text-sm text-[#c4c7c8]">
                      <span className="font-mono text-[10px] text-white pt-0.5">&gt;</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0e0e0e] p-3 border border-[#201f1f]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8e9192] shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#8e9192] uppercase">RUNTIME</span>
                    <span className="font-mono text-[10px] text-white">{project.specs.runtime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#8e9192] shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#8e9192] uppercase">THROUGHPUT</span>
                    <span className="font-mono text-[10px] text-white">{project.specs.throughput}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#8e9192] shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#8e9192] uppercase">STORAGE</span>
                    <span className="font-mono text-[10px] text-white">{project.specs.storage}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-[#201f1f] text-[#e5e2e1] font-mono text-[10px] uppercase border border-[#2a2a2a]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-space-md border-t border-[#201f1f] bg-[#0e0e0e] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8e9192]">
                STATUS: PRODUCTION REPOSITORY
              </span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-mono text-xs font-semibold uppercase hover:bg-[#c7c6c6] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>OPEN REPOSITORY</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

