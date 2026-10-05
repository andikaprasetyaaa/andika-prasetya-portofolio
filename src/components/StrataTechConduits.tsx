import React from 'react';
import { Database, Brain, Terminal, Cloud } from 'lucide-react';

interface StrataTechConduitsProps {
  theme: 'day' | 'night';
}

export const StrataTechConduits: React.FC<StrataTechConduitsProps> = ({ theme }) => {
  const isNight = theme === 'night';

  const conduits = [
    {
      id: 'CONDUIT_01',
      title: 'STORAGE & OLAP',
      sub: 'High-Throughput Repositories',
      icon: Database,
      color: isNight ? 'text-emerald-400' : 'text-emerald-600',
      skills: [
        { name: 'PostgreSQL / Citus', level: 'EXPERT' },
        { name: 'ClickHouse Columnar', level: 'ADVANCED' },
        { name: 'Apache Kafka / Redpanda', level: 'EXPERT' },
        { name: 'Redis & Valkey', level: 'ADVANCED' },
        { name: 'Qdrant / Milvus Vector', level: 'ADVANCED' },
      ],
    },
    {
      id: 'CONDUIT_02',
      title: 'AI / NLP & SWARMS',
      sub: 'Machine Learning Subroutines',
      icon: Brain,
      color: isNight ? 'text-purple-400' : 'text-purple-600',
      skills: [
        { name: 'PyTorch & HuggingFace', level: 'ADVANCED' },
        { name: 'LangGraph / Agentic DAGs', level: 'EXPERT' },
        { name: 'vLLM & Ollama Serving', level: 'ADVANCED' },
        { name: 'LoRA & Quantization (GGUF)', level: 'PRACTICAL' },
        { name: 'RAG Evaluation (Ragas)', level: 'ADVANCED' },
      ],
    },
    {
      id: 'CONDUIT_03',
      title: 'BACKEND RUNTIMES',
      sub: 'Concurrency & Systems Logic',
      icon: Terminal,
      color: isNight ? 'text-blue-400' : 'text-blue-600',
      skills: [
        { name: 'Python 3.12 (FastAPI, Asyncio)', level: 'EXPERT' },
        { name: 'Golang (Goroutines, Channels)', level: 'ADVANCED' },
        { name: 'gRPC & Protocol Buffers', level: 'ADVANCED' },
        { name: 'RESTful / OpenAPI Specs', level: 'EXPERT' },
        { name: 'Rust Core Primitives', level: 'STUDYING' },
      ],
    },
    {
      id: 'CONDUIT_04',
      title: 'DEV & CLOUD OPS',
      sub: 'Infrastructure as Code',
      icon: Cloud,
      color: isNight ? 'text-amber-400' : 'text-amber-600',
      skills: [
        { name: 'Docker & Multi-stage Builds', level: 'EXPERT' },
        { name: 'Kubernetes (k8s) & Helm', level: 'ADVANCED' },
        { name: 'CI/CD (GitHub Actions)', level: 'EXPERT' },
        { name: 'Linux SysAdmin (Debian/RHEL)', level: 'EXPERT' },
        { name: 'Prometheus & Grafana', level: 'ADVANCED' },
      ],
    },
  ];

  return (
    <section
      id="strata-conduits"
      className={`w-full py-24 px-6 md:px-12 border-t-2 transition-colors duration-500 ${
        isNight
          ? 'bg-[#12121a] border-slate-800 text-slate-100'
          : 'bg-[#e2e8f0] border-slate-300 text-[#0f172a]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b ${
            isNight ? 'border-slate-800' : 'border-slate-300'
          }`}
        >
          <div>
            <div className="font-silkscreen text-xs text-[#58a038] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#58a038]"></span>
              <span>STRATUM 03 // LITHOSPHERE CONDUITS [-380m]</span>
            </div>
            <h2
              className={`font-pixel text-xl md:text-2xl mt-2 ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              TECHNICAL ARTERY &amp; PROTOCOL MATRIX
            </h2>
          </div>
          <div
            className={`font-silkscreen text-xs ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            CAPACITY: 4 CORE REGISTERS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conduits.map((conduit) => {
            const Icon = conduit.icon;
            return (
              <div
                key={conduit.id}
                className={`border-2 p-6 flex flex-col justify-between gap-6 transition-colors shadow-lg ${
                  isNight
                    ? 'bg-[#181824] border-slate-800 hover:border-slate-600'
                    : 'bg-white border-slate-300 hover:border-[#58a038] shadow-sm'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-6 h-6 ${conduit.color}`} />
                    <span className="font-silkscreen text-[10px] text-slate-400">
                      {conduit.id}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <h3
                      className={`font-pixel text-xs ${
                        isNight ? 'text-white' : 'text-[#0f172a]'
                      }`}
                    >
                      {conduit.title}
                    </h3>
                    <span
                      className={`font-silkscreen text-[10px] mt-1 ${
                        isNight ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {conduit.sub}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 font-silkscreen text-xs pt-2">
                    {conduit.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`flex justify-between items-center py-1.5 px-2 border ${
                          isNight
                            ? 'bg-black/40 border-slate-800/80 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="text-[10px]">{skill.name}</span>
                        <span
                          className={`text-[9px] font-bold ${
                            skill.level === 'EXPERT'
                              ? 'text-[#58a038]'
                              : skill.level === 'ADVANCED'
                              ? isNight ? 'text-blue-400' : 'text-blue-600'
                              : isNight ? 'text-amber-400' : 'text-amber-600'
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};