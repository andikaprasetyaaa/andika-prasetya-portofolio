import React, { useState, useRef, useEffect } from 'react';
import { audioManager } from '../utils/audioManager';
import { Terminal, Copy, Check, Github, Linkedin, FileText, ArrowUp, Send, ExternalLink, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StrataObsidianCoreProps {
  theme: 'day' | 'night';
  onThemeToggle: () => void;
}

interface TermOutput {
  id: number;
  text: string;
  css: string;
}

export const StrataObsidianCore: React.FC<StrataObsidianCoreProps> = ({
  theme,
  onThemeToggle,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const isNight = theme === 'night';

  const [logs, setLogs] = useState<TermOutput[]>([
    { id: 1, text: 'Andika Core OS [Version 2.8.4-obsidian-runtime]', css: 'text-slate-400' },
    { id: 2, text: '(c) 2026 I Putu Andika Prasetya. All rights reserved.', css: 'text-slate-500' },
    { id: 3, text: "Available commands: 'help', 'status', 'projects', 'strata', 'theme', 'play', 'cv', 'ping', 'clear'", css: 'text-[#58a038] font-bold mt-1' },
    { id: 4, text: "Type 'help' and press ENTER to explore core routines.", css: 'text-yellow-400/90' },
  ]);

  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyEmail = () => {
    audioManager.playPickupSound();
    navigator.clipboard.writeText('andikaprasetyaa@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    audioManager.playClickSound();

    const newLogs: TermOutput[] = [
      ...logs,
      { id: Date.now(), text: `> ${cmd}`, css: 'text-white font-bold' },
    ];

    setInputVal('');

    switch (cmd) {
      case 'help':
        newLogs.push({
          id: Date.now() + 1,
          text: `COMMAND MATRIX:
 - status     : Query core drill vitals & operational specs
 - projects   : List all 6 verified GitHub repositories
 - experience : List verified professional career logs
 - email      : Dispatch direct mailto:andikaprasetyaa@gmail.com
 - strata     : Enumerate depth geological waypoints
 - theme      : Toggle Day / Night celestial atmosphere
 - play       : Start authentic Terraria OST soundtrack
 - ping       : Send subterranean telemetry ping
 - cv         : Retrieve curriculum vitae dossier (Google Drive)
 - clear      : Flush the terminal buffer`,
          css: 'text-slate-300',
        });
        break;

      case 'email':
      case 'contact':
        window.location.href = 'mailto:andikaprasetyaa@gmail.com';
        newLogs.push({
          id: Date.now() + 1,
          text: 'DISPATCHING DIRECT TRANSMISSION: Opening mailto:andikaprasetyaa@gmail.com...',
          css: 'text-[#58a038]',
        });
        break;

      case 'experience':
      case 'logs':
        newLogs.push({
          id: Date.now() + 1,
          text: `VERIFIED CAREER TRAJECTORY:
 1. AI AUTOMATION SPECIALIST | PT IN FASHION (7 Sep 2026 - Present)
 2. DATA ANALYST | PT INDO APPS SOLUSINDO (Apr 2026 - June 2026)
 3. ANDROID DEVELOPER | BANGKIT ACADEMY 2024 (Google, GoTo, Traveloka)
 4. BACHELOR OF COMPUTER SCIENCE (S.Kom) | Magna Cum Laude`,
          css: 'text-amber-300',
        });
        break;

      case 'status':
        newLogs.push({
          id: Date.now() + 1,
          text: `[CORE STATUS: NOMINAL]
DRILL MOTOR         : ONLINE (60 FPS)
BEDROCK PRESSURE    : 142.4 MPa
HEAT SINK DISPERSION: 44.8°C
AUDIO DRIVER        : AUTHENTIC TERRARIA (SCOTT LLOYD SHELLY)
ACTIVE THEME        : ${theme.toUpperCase()} MODE
GITHUB ACCOUNT      : github.com/andikaprasetyaaa`,
          css: 'text-[#58a038]',
        });
        break;

      case 'projects':
        newLogs.push({
          id: Date.now() + 1,
          text: `VERIFIED GITHUB REPOSITORIES (github.com/andikaprasetyaaa):
 1. leveraging-textual-entailment-for-hybrid-summarization (Jupyter)
 2. UFC-GraphRAG (Python / Knowledge Graph)
 3. fashion-ops-dashboard (PLpgSQL / PostgreSQL)
 4. boxing-coach-automation (Python / MediaPipe Vision)
 5. discount-alert-automation (Python / Shopify GraphQL)
 6. shopify-store-pulse (Python / Telemetry Alerting)`,
          css: 'text-cyan-300',
        });
        break;

      case 'strata':
        newLogs.push({
          id: Date.now() + 1,
          text: `GEOLOGICAL STRATA TAXONOMY:
 +120m : Stratum 00 (Surface Horizon & Overworld)
  000m : Stratum 01 (Subsurface Lithostratigraphy)
 -140m : Stratum 02 (Subterranean Research Labs)
 -380m : Stratum 03 (Lithosphere Technical Conduits)
 -720m : Stratum 04 (Drill Logs & Chronology)
 -1250m: Stratum 05 (Obsidian Core & Terminal)`,
          css: 'text-indigo-300',
        });
        break;

      case 'theme':
        onThemeToggle();
        newLogs.push({
          id: Date.now() + 1,
          text: `ATMOSPHERE SHIFTED: Now in ${theme === 'day' ? 'NIGHT' : 'DAY'} mode.`,
          css: 'text-amber-400',
        });
        break;

      case 'play':
        audioManager.play();
        newLogs.push({
          id: Date.now() + 1,
          text: `TERRARIA SOUNDTRACK PLAYING: ${theme === 'day' ? 'Overworld Day' : 'Overworld Night'} OST.`,
          css: 'text-[#58a038]',
        });
        break;

      case 'ping':
        newLogs.push({
          id: Date.now() + 1,
          text: 'PONG // 127.0.0.1:8080 latency = 0.84ms. Subterranean conduit optimal.',
          css: 'text-[#58a038]',
        });
        break;

      case 'cv':
        window.open('https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing', '_blank');
        newLogs.push({
          id: Date.now() + 1,
          text: 'DISPATCHING DOSSIER PAYLOAD -> Opening CV Google Drive in new tab...',
          css: 'text-purple-300',
        });
        break;

      case 'clear':
        setLogs([]);
        return;

      default:
        newLogs.push({
          id: Date.now() + 1,
          text: `ERR: Command not recognized: "${cmd}". Type 'help' for command directory.`,
          css: 'text-red-400',
        });
        break;
    }

    setLogs(newLogs);
  };

  const handleAscent = () => {
    audioManager.playClickSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.9 } });
    const el = document.getElementById('strata-surface');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="strata-core"
      className={`w-full py-24 px-6 md:px-12 border-t-2 transition-colors duration-500 ${
        isNight
          ? 'bg-[#0b0b10] border-slate-800 text-slate-100'
          : 'bg-[#e2e8f0] border-slate-300 text-[#0f172a]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b ${
            isNight ? 'border-slate-800' : 'border-slate-300'
          }`}
        >
          <div>
            <div className="font-silkscreen text-xs text-[#58a038] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#58a038] animate-ping"></span>
              <span>STRATUM 05 // OBSIDIAN CORE [-1250m]</span>
            </div>
            <h2
              className={`font-pixel text-xl md:text-3xl mt-2 ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              LET'S BUILD SOMETHING USEFUL.
            </h2>
          </div>
          <div
            className={`font-silkscreen text-xs px-3 py-1.5 border ${
              isNight
                ? 'text-yellow-400 bg-black/60 border-slate-800'
                : 'text-amber-700 bg-amber-50 border-amber-200 shadow-sm'
            }`}
          >
            CORE HEAT: NOMINAL // STATUS: DISPATCH READY
          </div>
        </div>

        {/* Core Layout: Terminal + Channels Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Terminal Emulator */}
          <div
            className={`lg:col-span-7 border-2 p-5 flex flex-col gap-3 shadow-2xl transition-colors ${
              isNight
                ? 'bg-[#14141d] border-slate-800'
                : 'bg-white border-slate-300 shadow-md'
            }`}
          >
            {/* Terminal Top Bar */}
            <div
              className={`flex items-center justify-between font-silkscreen text-xs pb-2 border-b ${
                isNight
                  ? 'text-slate-400 border-slate-800'
                  : 'text-slate-600 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#58a038]"></span>
                <span
                  className={`font-pixel text-[10px] ${
                    isNight ? 'text-white' : 'text-[#0f172a]'
                  }`}
                >
                  ANDIKA_CORE_SHELL_V2
                </span>
              </div>
              <span className="text-[10px]">TTY: /dev/core_05</span>
            </div>

            {/* Terminal Logs Window */}
            <div
              ref={screenRef}
              className={`p-4 h-72 overflow-y-auto flex flex-col gap-1.5 font-mono text-xs border selection:bg-[#58a038] ${
                isNight
                  ? 'bg-black/90 border-slate-900'
                  : 'bg-[#0f172a] border-slate-800 shadow-inner'
              }`}
            >
              {logs.map((log) => (
                <div key={log.id} className={`${log.css} whitespace-pre-wrap leading-relaxed`}>
                  {log.text}
                </div>
              ))}
            </div>

            {/* Command Input Bar */}
            <form
              onSubmit={handleCommandSubmit}
              className={`flex items-center gap-2 p-2 border ${
                isNight
                  ? 'bg-black/90 border-slate-800'
                  : 'bg-[#0f172a] border-slate-800 text-white'
              }`}
            >
              <span className="font-pixel text-xs text-[#58a038]">&gt;</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type command (e.g. status, projects, cv, theme)..."
                className="w-full bg-transparent font-mono text-xs text-white focus:outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 hover:bg-[#58a038] text-white hover:text-black font-pixel text-[9px] uppercase transition-colors flex items-center gap-1 border border-slate-700"
              >
                <span>RUN</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Direct Transmission Hub */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div
              className={`border-2 p-6 flex flex-col gap-4 shadow-lg transition-colors ${
                isNight
                  ? 'bg-[#14141d] border-slate-800'
                  : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <h3
                className={`font-pixel text-xs md:text-sm flex items-center gap-2 ${
                  isNight ? 'text-white' : 'text-[#0f172a]'
                }`}
              >
                <Terminal className="w-4 h-4 text-[#58a038]" />
                <span>ESTABLISH DIRECT CONDUIT</span>
              </h3>
              <p
                className={`font-silkscreen text-xs leading-relaxed ${
                  isNight ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Looking for a systems-level data engineer, distributed pipeline builder, or AI infrastructure architect? Transmit your signal directly.
              </p>

              {/* Copy & Direct Email Box */}
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border mt-1 ${
                  isNight
                    ? 'bg-black/70 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-silkscreen text-[9px] text-slate-500 uppercase">
                    TRANSMISSION FREQUENCY // DIRECT DISPATCH
                  </span>
                  <a
                    href="mailto:andikaprasetyaa@gmail.com"
                    className={`font-mono text-xs font-bold hover:underline flex items-center gap-1.5 mt-0.5 ${
                      isNight ? 'text-[#58a038]' : 'text-[#386a24]'
                    }`}
                    title="Click to directly launch mailto"
                  >
                    <span>andikaprasetyaa@gmail.com</span>
                    <Mail className="w-3.5 h-3.5 inline opacity-70" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="mailto:andikaprasetyaa@gmail.com"
                    className={`px-3 py-1.5 font-pixel text-[9px] uppercase transition-colors flex items-center gap-1.5 border ${
                      isNight
                        ? 'bg-black/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#0f172a] border-slate-300 shadow-sm'
                    }`}
                    title="Launch mail client directly"
                  >
                    <Mail className="w-3 h-3 text-[#58a038]" />
                    <span>DIRECT</span>
                  </a>

                  <button
                    onClick={handleCopyEmail}
                    className={`px-3 py-1.5 font-pixel text-[9px] uppercase transition-colors flex items-center gap-1.5 border ${
                      isNight
                        ? 'bg-slate-800 hover:bg-[#58a038] text-white hover:text-black border-slate-700'
                        : 'bg-[#58a038] hover:bg-[#46822c] text-black font-bold border-[#86efac]'
                    }`}
                    title="Copy email to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Channels Grid with Real GitHub and CV Links */}
            <div className="grid grid-cols-2 gap-3 font-silkscreen text-xs">
              <a
                href="https://github.com/andikaprasetyaaa?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClickSound()}
                className={`p-4 border-2 flex flex-col gap-2 transition-all group ${
                  isNight
                    ? 'bg-[#14141d] hover:bg-[#1f1f2e] border-slate-800 hover:border-slate-600 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-[#58a038] text-[#0f172a] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Github className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
                <span className="font-pixel text-[10px]">GITHUB REPO</span>
                <span className="text-slate-500 text-[9px]">andikaprasetyaaa</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClickSound()}
                className={`p-4 border-2 flex flex-col gap-2 transition-all group ${
                  isNight
                    ? 'bg-[#14141d] hover:bg-[#1f1f2e] border-slate-800 hover:border-slate-600 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-[#58a038] text-[#0f172a] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Linkedin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
                <span className="font-pixel text-[10px]">LINKEDIN</span>
                <span className="text-slate-500 text-[9px]">Professional Record</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playPickupSound()}
                className={`p-4 border-2 flex flex-col gap-2 transition-all text-left group ${
                  isNight
                    ? 'bg-[#14141d] hover:bg-[#1f1f2e] border-slate-800 hover:border-slate-600 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-[#58a038] text-[#0f172a] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
                <span className="font-pixel text-[10px]">RETRIEVE CV</span>
                <span className="text-slate-500 text-[9px]">Google Drive Dossier</span>
              </a>

              <button
                onClick={handleAscent}
                className="p-4 bg-[#58a038] hover:bg-[#68bd42] text-black border-2 border-[#86efac] flex flex-col gap-2 transition-transform hover:-translate-y-1 shadow-lg text-left"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="font-pixel text-[10px] font-bold">SURFACE ASCENT</span>
                <span className="text-black/80 text-[9px] font-mono">+120m Return Vector</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};