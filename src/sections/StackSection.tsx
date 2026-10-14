import React from 'react';
import { motion } from 'framer-motion';
import { StackOrbit } from '../three/StackOrbit';
import { Terminal, Database, Cpu, Layers } from 'lucide-react';

export const StackSection: React.FC = () => {
  const stackCategories = [
    {
      id: 'CAT_01',
      title: 'AI & MACHINE LEARNING',
      icon: Cpu,
      skills: [
        { name: 'Python', role: 'Core Lang' },
        { name: 'PyTorch', role: 'Deep Learning' },
        { name: 'TensorFlow', role: 'Neural Nets' },
        { name: 'Hugging Face', role: 'Transformers' },
        { name: 'Jupyter', role: 'Notebooks' },
      ],
    },
    {
      id: 'CAT_02',
      title: 'NLP & LLM ARCHITECTURE',
      icon: Layers,
      skills: [
        { name: 'RAG Systems', role: 'Retrieval' },
        { name: 'FAISS / ANN', role: 'Vector Search' },
        { name: 'BM25', role: 'Hybrid Rank' },
        { name: 'Gemini API', role: 'Multimodal' },
        { name: 'Cohere', role: 'Embeddings' },
      ],
    },
    {
      id: 'CAT_03',
      title: 'DATA ENGINEERING & OLAP',
      icon: Database,
      skills: [
        { name: 'PostgreSQL', role: 'Relational' },
        { name: 'Pandas / NumPy', role: 'Vectorized' },
        { name: 'MySQL', role: 'Transactions' },
        { name: 'MongoDB', role: 'Document' },
        { name: 'Neo4j', role: 'Graph DB' },
      ],
    },
    {
      id: 'CAT_04',
      title: 'BACKEND & INFRASTRUCTURE',
      icon: Terminal,
      skills: [
        { name: 'FastAPI', role: 'REST / Async' },
        { name: 'Docker', role: 'Containers' },
        { name: 'n8n', role: 'Automation' },
        { name: 'Streamlit', role: 'UI Dashboards' },
        { name: 'Git & CI/CD', role: 'VCS Workflow' },
      ],
    },
  ];

  return (
    <section
      id="stack"
      className="relative w-full min-h-screen px-gutter-mobile md:px-gutter lg:px-margin py-space-xl flex flex-col justify-between border-t border-[#1c1b1b] bg-[#0e0e0e]/75 backdrop-blur-[2px] select-none overflow-hidden"
    >
      {/* Background Microdot Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/5 rounded-full blur-[140px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#1c1b1b]">
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            <div className="flex items-center gap-space-sm bg-[#131313] px-space-md py-1 border border-[#201f1f]">
              <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
              <span className="font-mono text-[11px] tracking-widest text-white uppercase font-semibold">
                [ 04 // TECHNICAL MATRIX &amp; TOOLCHAIN ]
              </span>
            </div>

            <div className="flex items-center gap-space-md font-mono text-[9px] text-[#8e9192] uppercase">
              <span>CLOCK: 3.4 GHz TENSOR-PIPE</span>
              <span>•</span>
              <span className="text-white font-bold">STATE: REAL-TIME ARBITRAGE</span>
            </div>
          </div>

          <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-headline font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-white uppercase leading-none max-w-3xl">
              CAPABILITIES &amp; COMPUTATIONAL RIGOR
            </h2>
            <p className="font-mono text-xs text-[#c4c7c8] max-w-md tracking-wide lg:text-right">
              Hardened architectural models, deterministic orchestration, and high-throughput vector compute pipelines.
            </p>
          </div>
        </div>

        {/* Central 3D Orbit & 4-Category Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-6 items-center">
          {/* Left: 3D Orbiting Centerpiece (5 cols) */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 w-full flex items-center justify-center border border-[#201f1f] bg-[#131313]/60 backdrop-blur-md">
            <div className="absolute top-2 left-2 font-mono text-[9px] text-[#8e9192] uppercase">
              // 3D ORBITAL TENSOR RUNTIME
            </div>
            <div className="absolute top-2 right-2 font-mono text-[9px] text-[#8e9192] uppercase">
              FPS // 60.0
            </div>
            <StackOrbit />
          </div>

          {/* Right: 4 Detailed Register Blocks (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stackCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-[#131313] border border-[#201f1f] p-4 flex flex-col justify-between gap-3 hover:border-[#444748] transition-colors shadow-md group"
                >
                  <div className="flex items-center justify-between border-b border-[#1c1b1b] pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-white" />
                      <span className="font-mono text-[10px] text-white uppercase font-bold tracking-wider">
                        {cat.title}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-[#8e9192]">{cat.id}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between py-1 px-2 bg-[#0e0e0e] border border-[#1a1919] font-mono text-xs group-hover:border-[#2a2a2a] transition-colors"
                      >
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-[10px] text-[#8e9192]">{skill.role}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section Footprint */}
        <div className="w-full pt-space-md border-t border-[#1c1b1b] flex flex-col sm:flex-row items-center justify-between gap-2 opacity-60">
          <span className="font-mono text-[9px] text-[#8e9192] uppercase">
            STAGE [04 / 06] // SYSTEM ARCHITECTURE &amp; CAPABILITIES
          </span>
          <span className="font-mono text-[9px] text-white uppercase font-semibold">
            COMPUTATIONAL DISCIPLINE: 100% PRODUCTION COMPLIANT
          </span>
        </div>
      </div>
    </section>
  );
};

