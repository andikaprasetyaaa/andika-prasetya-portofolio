import React from 'react';
import { Layers, Database, Cpu, HardDrive, Server } from 'lucide-react';

interface StrataTopsoilProps {
  theme: 'day' | 'night';
}

export const StrataTopsoil: React.FC<StrataTopsoilProps> = ({ theme }) => {
  const isNight = theme === 'night';

  return (
    <section
      id="strata-topsoil"
      className={`w-full py-20 px-6 md:px-12 border-t-4 transition-colors duration-500 relative ${
        isNight
          ? 'bg-[#15151c] border-[#386a24] text-slate-100'
          : 'bg-[#e2e8f0] border-[#58a038] text-[#0f172a]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b ${
            isNight ? 'border-slate-800' : 'border-slate-300'
          }`}
        >
          <div>
            <div className="font-silkscreen text-xs text-[#58a038] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#58a038]"></span>
              <span>STRATUM 01 // CROSS-SECTION [0m to -80m]</span>
            </div>
            <h2
              className={`font-pixel text-xl md:text-2xl mt-2 ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              SUBSURFACE LITHOSTRATIGRAPHY
            </h2>
          </div>
          <div
            className={`font-silkscreen text-[10px] px-3 py-1.5 border self-start md:self-auto ${
              isNight
                ? 'text-slate-400 bg-black/60 border-slate-800'
                : 'text-slate-600 bg-white/80 border-slate-300 shadow-sm'
            }`}
          >
            DRILL_PASS: PASS_01 // CORE EXTRACTION #4489
          </div>
        </div>

        {/* Stratigraphy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Specimen Bar Core Sample */}
          <div
            className={`lg:col-span-4 border p-6 flex flex-col justify-between gap-4 transition-colors ${
              isNight
                ? 'bg-black/50 border-slate-800'
                : 'bg-white border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between font-silkscreen text-[10px]">
              <span className={isNight ? 'text-white' : 'text-[#0f172a] font-bold'}>
                SPECIMEN_ID: CO-88
              </span>
              <span className={isNight ? 'text-slate-400' : 'text-slate-500'}>
                RES: 1px / 0.05m
              </span>
            </div>

            {/* Stepped Cross Section Bar */}
            <div className="w-full h-80 flex gap-3">
              {/* Depth Scale Ticks */}
              <div
                className={`w-10 flex flex-col justify-between font-silkscreen text-[9px] py-1 ${
                  isNight ? 'text-slate-500' : 'text-slate-400 font-bold'
                }`}
              >
                <span>+00m</span>
                <span>-20m</span>
                <span>-40m</span>
                <span>-60m</span>
                <span>-80m</span>
              </div>

              {/* Stratified Core */}
              <div
                className={`flex-1 flex flex-col justify-between p-1 border gap-1 font-silkscreen ${
                  isNight
                    ? 'bg-black border-slate-800'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                {/* Layer A */}
                <div
                  className={`h-16 border-l-4 flex flex-col justify-between p-2 ${
                    isNight
                      ? 'bg-[#5c3a21] border-[#58a038]'
                      : 'bg-[#854d0e]/20 border-[#16a34a]'
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold ${
                      isNight ? 'text-emerald-300' : 'text-emerald-800'
                    }`}
                  >
                    LAYER_A: ACTIVE HUMUS
                  </span>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-[#58a038]"></span>
                    <span className="w-2 h-2 bg-[#865439]"></span>
                    <span className="w-2 h-2 bg-[#eab308]"></span>
                  </div>
                </div>

                {/* Layer B */}
                <div
                  className={`h-20 border-l-4 flex flex-col justify-between p-2 ${
                    isNight
                      ? 'bg-[#3d2719] border-amber-600'
                      : 'bg-amber-100 border-amber-600'
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold ${
                      isNight ? 'text-amber-300' : 'text-amber-900'
                    }`}
                  >
                    LAYER_B: DENSE SILT MATRIX
                  </span>
                  <div className="grid grid-cols-6 gap-1 opacity-75">
                    <div className="h-1 bg-amber-500"></div>
                    <div className="h-1 bg-stone-500"></div>
                    <div className="h-1 bg-amber-500"></div>
                    <div className="h-1 bg-stone-500"></div>
                    <div className="h-1 bg-amber-500"></div>
                    <div className="h-1 bg-stone-500"></div>
                  </div>
                </div>

                {/* Layer C */}
                <div
                  className={`h-20 border-l-4 flex flex-col justify-between p-2 ${
                    isNight
                      ? 'bg-[#27272a] border-slate-400'
                      : 'bg-slate-200 border-slate-500'
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold ${
                      isNight ? 'text-slate-300' : 'text-slate-800'
                    }`}
                  >
                    LAYER_C: FRACTURED SHALE
                  </span>
                  <div className="flex justify-between items-center text-[8px] text-slate-500">
                    <span>ROOT_DEPTH_MAX</span>
                    <span
                      className={`font-bold ${
                        isNight ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      98.4% COMPACT
                    </span>
                  </div>
                </div>

                {/* Layer D */}
                <div
                  className={`flex-1 border-l-4 flex items-center justify-between p-2 ${
                    isNight
                      ? 'bg-[#18181b] border-purple-500'
                      : 'bg-purple-50 border-purple-600'
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold ${
                      isNight ? 'text-purple-300' : 'text-purple-900'
                    }`}
                  >
                    LAYER_D: BEDROCK BOUNDARY
                  </span>
                  <span className="w-2 h-2 bg-purple-500 animate-pulse"></span>
                </div>
              </div>
            </div>

            <div
              className={`font-silkscreen text-[9px] text-center border-t pt-2 ${
                isNight
                  ? 'text-slate-400 border-slate-800'
                  : 'text-slate-500 border-slate-200'
              }`}
            >
              CORE APERTURE: HYDRAULIC RETENTION CONFIRMED
            </div>
          </div>

          {/* Systems Overview & Foundation Columns */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6">
            <div
              className={`border p-6 md:p-8 flex flex-col gap-4 transition-colors ${
                isNight
                  ? 'bg-black/50 border-slate-800'
                  : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <h3
                className={`font-pixel text-sm md:text-base flex items-center gap-2 ${
                  isNight ? 'text-white' : 'text-[#0f172a]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#58a038]" />
                <span>// ARCHITECTURAL ANCHOR &amp; FOUNDATIONS</span>
              </h3>
              <p
                className={`font-silkscreen text-xs leading-relaxed ${
                  isNight ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Just as deep subsoils anchor mountain biomes, high-reliability applications demand deterministic data ingestion, decoupled event streams, and verifiable storage paradigms. My core competency bridges low-latency pipeline engineering with enterprise AI model execution.
              </p>

              {/* 4 Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-silkscreen">
                <div
                  className={`border p-3 flex flex-col gap-1 ${
                    isNight
                      ? 'bg-[#181822] border-slate-800'
                      : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-slate-500 text-[9px] uppercase">PIPELINES</span>
                  <span
                    className={`font-bold text-xs flex items-center gap-1 ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    <Database className="w-3 h-3 text-[#58a038]" />
                    Real-Time ETL
                  </span>
                  <span className={isNight ? 'text-slate-400' : 'text-slate-600 text-[9px]'}>
                    Kafka &amp; Spark
                  </span>
                </div>

                <div
                  className={`border p-3 flex flex-col gap-1 ${
                    isNight
                      ? 'bg-[#181822] border-slate-800'
                      : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-slate-500 text-[9px] uppercase">AI ENGINE</span>
                  <span
                    className={`font-bold text-xs flex items-center gap-1 ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    <Cpu className="w-3 h-3 text-purple-500" />
                    Agent Swarms
                  </span>
                  <span className={isNight ? 'text-slate-400' : 'text-slate-600 text-[9px]'}>
                    LangGraph / Ollama
                  </span>
                </div>

                <div
                  className={`border p-3 flex flex-col gap-1 ${
                    isNight
                      ? 'bg-[#181822] border-slate-800'
                      : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-slate-500 text-[9px] uppercase">WAREHOUSE</span>
                  <span
                    className={`font-bold text-xs flex items-center gap-1 ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    <HardDrive className="w-3 h-3 text-blue-500" />
                    Columnar OLAP
                  </span>
                  <span className={isNight ? 'text-slate-400' : 'text-slate-600 text-[9px]'}>
                    ClickHouse &amp; PgSQL
                  </span>
                </div>

                <div
                  className={`border p-3 flex flex-col gap-1 ${
                    isNight
                      ? 'bg-[#181822] border-slate-800'
                      : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-slate-500 text-[9px] uppercase">DEPLOYMENT</span>
                  <span
                    className={`font-bold text-xs flex items-center gap-1 ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    <Server className="w-3 h-3 text-amber-500" />
                    Zero-Downtime
                  </span>
                  <span className={isNight ? 'text-slate-400' : 'text-slate-600 text-[9px]'}>
                    Docker / K8s / Argo
                  </span>
                </div>
              </div>
            </div>

            {/* Live Telemetry Monitors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`border p-4 flex items-center justify-between transition-colors ${
                  isNight
                    ? 'bg-black/60 border-slate-800'
                    : 'bg-white border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`font-pixel text-[11px] ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    INGESTION PRESSURE
                  </span>
                  <span
                    className={`font-silkscreen text-[9px] ${
                      isNight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    MAX DENSITY BUFFER
                  </span>
                </div>
                <span className="font-pixel text-xs text-[#58a038] font-bold">
                  45,000 evt/s
                </span>
              </div>

              <div
                className={`border p-4 flex items-center justify-between transition-colors ${
                  isNight
                    ? 'bg-black/60 border-slate-800'
                    : 'bg-white border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`font-pixel text-[11px] ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    VECTOR RECALL
                  </span>
                  <span
                    className={`font-silkscreen text-[9px] ${
                      isNight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    HNSW ANN INDEX
                  </span>
                </div>
                <span className="font-pixel text-xs text-[#58a038] font-bold">
                  99.2% @ 12ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};