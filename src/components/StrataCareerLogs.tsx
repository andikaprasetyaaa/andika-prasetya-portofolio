import React, { useState } from 'react';
import { History, Award, Briefcase, GraduationCap, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

interface StrataCareerLogsProps {
  theme: 'day' | 'night';
}

export const StrataCareerLogs: React.FC<StrataCareerLogsProps> = ({ theme }) => {
  const isNight = theme === 'night';
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playPickupSound();
    navigator.clipboard.writeText('andikaprasetyaa@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const logs = [
    {
      period: '7 SEP 2026 - PRESENT',
      role: 'AI AUTOMATION SPECIALIST',
      org: 'PT IN FASHION • Autonomous Systems & Workflow Automation',
      depth: 'DEPTH: -720m',
      status: 'ACTIVE RUN',
      statusColor: 'text-[#58a038] border-[#58a038]',
      icon: Briefcase,
    },
    {
      period: 'APR 2026 - JUN 2026',
      role: 'DATA ANALYST',
      org: 'PT INDO APPS SOLUSINDO • OLAP Telemetry & Business Insights',
      depth: 'DEPTH: -540m',
      status: 'COMPLETED',
      statusColor: isNight ? 'text-cyan-400 border-cyan-800' : 'text-cyan-700 border-cyan-300',
      icon: History,
    },
    {
      period: '2024',
      role: 'ANDROID DEVELOPER',
      org: 'BANGKIT ACADEMY 2024 • Led by Google, Tokopedia, GoTo & Traveloka',
      depth: 'DEPTH: -310m',
      status: 'GRADUATE DISTINCTION',
      statusColor: isNight ? 'text-amber-400 border-amber-800' : 'text-amber-700 border-amber-300',
      icon: Award,
    },
    {
      period: 'ACADEMIA',
      role: 'BACHELOR OF INFORMATION TECHNOLOGY',
      org: 'Udayana University',
      depth: 'DEPTH: -120m',
      status: 'SECURED',
      statusColor: isNight ? 'text-purple-400 border-purple-800' : 'text-purple-700 border-purple-300',
      icon: GraduationCap,
    },
  ];

  return (
    <section
      id="strata-logs"
      className={`w-full py-24 px-6 md:px-12 border-t-2 transition-colors duration-500 ${
        isNight
          ? 'bg-[#0d0e17] border-slate-800 text-slate-100'
          : 'bg-[#f1f5f9] border-slate-300 text-[#0f172a]'
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
              <span>STRATUM 04 // DRILL LOGS &amp; CHRONOLOGY [-720m]</span>
            </div>
            <h2
              className={`font-pixel text-xl md:text-2xl mt-2 ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              TRAJECTORY &amp; CORE EXTRACTS
            </h2>
          </div>
          <div
            className={`font-silkscreen text-xs ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            RECORD COUNT: 4 VERIFIED ENTRIES
          </div>
        </div>

        {/* Career Chronology Rows */}
        <div className="flex flex-col gap-3 font-silkscreen text-xs">
          {logs.map((log) => {
            const Icon = log.icon;
            return (
              <div
                key={log.role}
                className={`border-2 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isNight
                    ? 'bg-[#141524] border-slate-800 hover:border-[#58a038]'
                    : 'bg-white border-slate-300 hover:border-[#58a038] shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#58a038]" />
                    <span
                      className={`font-pixel text-[10px] px-3 py-1.5 border ${
                        isNight
                          ? 'text-white bg-black/60 border-slate-800'
                          : 'text-[#0f172a] bg-slate-100 border-slate-300'
                      }`}
                    >
                      {log.period}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`font-pixel text-xs ${
                        isNight ? 'text-white' : 'text-[#0f172a]'
                      }`}
                    >
                      {log.role}
                    </span>
                    <span
                      className={`text-xs mt-1 ${
                        isNight ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {log.org}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px]">
                  <span className={isNight ? 'text-slate-500' : 'text-slate-400 font-bold'}>
                    [{log.depth}]
                  </span>
                  <span
                    className={`px-2.5 py-1 border ${
                      isNight ? 'bg-black/60' : 'bg-slate-50 shadow-sm'
                    } ${log.statusColor}`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Deck: CV Dossier & Direct Email Dispatch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CV Dossier Card */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-2 transition-colors ${
              isNight
                ? 'bg-[#141524] border-slate-800'
                : 'bg-white border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-amber-500 animate-pulse"></span>
              <div className="flex flex-col">
                <span
                  className={`font-pixel text-xs ${
                    isNight ? 'text-white' : 'text-[#0f172a]'
                  }`}
                >
                  CURRICULUM VITAE DOSSIER
                </span>
                <span
                  className={`font-silkscreen text-[10px] ${
                    isNight ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  GOOGLE DRIVE CLOUD PAYLOAD
                </span>
              </div>
            </div>
            <a
              href="https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 font-pixel text-[10px] uppercase transition-colors flex items-center gap-2 border self-stretch sm:self-auto justify-center ${
                isNight
                  ? 'bg-slate-800 hover:bg-[#58a038] text-white hover:text-black border-slate-700'
                  : 'bg-[#58a038] hover:bg-[#46822c] text-black font-bold border-[#86efac] shadow-sm'
              }`}
            >
              <span>RETRIEVE CV [PDF]</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Direct Email Card with Copy & Click-to-Redirect */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-2 transition-colors ${
              isNight
                ? 'bg-[#141524] border-slate-800'
                : 'bg-white border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#58a038] animate-ping"></span>
              <div className="flex flex-col">
                <span
                  className={`font-pixel text-xs ${
                    isNight ? 'text-white' : 'text-[#0f172a]'
                  }`}
                >
                  OFFICIAL TRANSMISSION
                </span>
                <a
                  href="mailto:andikaprasetyaa@gmail.com"
                  className="font-silkscreen text-[11px] text-[#58a038] hover:underline font-bold flex items-center gap-1"
                  title="Click to send email"
                >
                  <span>andikaprasetyaa@gmail.com</span>
                  <Mail className="w-3 h-3 inline" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <a
                href="mailto:andikaprasetyaa@gmail.com"
                className={`px-3 py-2 font-pixel text-[9px] uppercase transition-colors flex items-center gap-1.5 border ${
                  isNight
                    ? 'bg-black/60 hover:bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0f172a] border-slate-300 shadow-sm'
                }`}
                title="Directly launch mail client"
              >
                <Mail className="w-3 h-3 text-[#58a038]" />
                <span>DIRECT</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className={`px-3 py-2 font-pixel text-[9px] uppercase transition-colors flex items-center gap-1.5 border ${
                  isNight
                    ? 'bg-slate-800 hover:bg-[#58a038] text-white hover:text-black border-slate-700'
                    : 'bg-[#58a038] hover:bg-[#46822c] text-black font-bold border-[#86efac] shadow-sm'
                }`}
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
