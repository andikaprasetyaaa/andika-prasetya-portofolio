import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight, Terminal, Clock, Download, Radio, Shield, Globe } from 'lucide-react';
import { soundManager } from '../components/SoundManager';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const userEmail = 'andikaprasetyaa@gmail.com';
  const cvUrl = 'https://drive.google.com/file/d/1ds1m5DI1xfXoVL6_EQa2WoXo65RanzeZ/view?usp=sharing';

  const copyEmailToClipboard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(userEmail).then(() => {
      soundManager.playClick(880);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2600);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <section id="contact" className="relative w-full min-h-screen py-24 px-4 sm:px-6 lg:px-12 flex flex-col justify-between border-b border-[#201f1f] overflow-hidden select-none">

      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_70%)]" />

      {/* Toast Notification Overlay */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-10 right-6 sm:right-10 z-50 flex items-center gap-2 bg-white text-black px-4 py-3 shadow-2xl font-mono text-xs uppercase tracking-wider font-semibold"
          >
            <Check className="w-4 h-4 text-black" />
            <span>COPIED TO SYSTEM CLIPBOARD</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-10">
        {/* Top System Telemetry Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 bg-[#1c1b1b]/80 border border-[#2a2a2a] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white animate-pulse" />
            <span className="font-mono text-xs text-white uppercase tracking-wider">
              [ 06 // TERMINAL HANDSHAKE & TRANSMISSION ]
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-[#8e9192]">
            <span className="hidden sm:inline">PROTOCOL: SECURE_WSS_V4</span>
            <span className="text-[#444748]">/</span>
            <span>LATENCY: 12ms</span>
            <span className="text-[#444748]">/</span>
            <span className="text-white font-semibold">NODE_STATUS: LISTENING</span>
          </div>
        </div>

        {/* Monumental Hero Typography Statement */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="font-mono text-xs text-[#8e9192] uppercase tracking-widest flex items-center gap-2">
            <span>TRANSMISSION DESTINATION</span>
            <span className="text-[#444748]">—&gt;</span>
            <span className="text-white font-medium">FOUNDER / ENG LEADERSHIP</span>
          </div>

          <h2 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold tracking-tighter uppercase max-w-5xl leading-none">
            LET'S BUILD SOMETHING INTELLIGENT.
          </h2>

          <p className="font-sans text-lg sm:text-xl text-[#c4c7c8] max-w-3xl mt-2 font-light">
            Direct connection with I Putu Andika Prasetya — AI Engineer & Automation Specialist.
          </p>
        </div>

        {/* Massive Interactive Email Handshake Box */}
        <div
          onClick={() => copyEmailToClipboard()}
          className="group relative w-full cursor-pointer transition-all duration-300 border border-[#2a2a2a] hover:border-white"
        >
          <div className="relative bg-[#0e0e0e] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 group-hover:bg-white group-hover:text-black">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8e9192] group-hover:text-black/70">
                  PRIMARY COMM CHANNEL // DIRECT INBOX
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white group-hover:bg-black" />
              </div>

              <a
                href={`mailto:${userEmail}`}
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick(600);
                }}
                className="font-sans text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase transition-colors duration-200 text-white group-hover:text-black break-all hover:underline"
              >
                {userEmail.toUpperCase()}
              </a>

              <span className="font-mono text-xs text-[#8e9192] group-hover:text-black/80">
                CLICK TO COPY ENCRYPTED ADDRESS OR SEND DIRECT TRANSMISSION
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={(e) => copyEmailToClipboard(e)}
                className="px-4 py-3 bg-[#2a2a2a] group-hover:bg-black group-hover:text-white transition-colors duration-200 flex items-center gap-2 font-mono text-xs text-white uppercase cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                <span>{copied ? 'COPIED!' : 'COPY ADDRESS'}</span>
              </button>

              <a
                href={`mailto:${userEmail}`}
                title="Send Email"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick(600);
                }}
                className="w-12 h-12 flex items-center justify-center bg-[#2a2a2a] group-hover:bg-black group-hover:text-white transition-colors duration-200"
              >
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Direct Channel Transmission Grid (4 Structural Wireframe Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 01: GITHUB */}
          <a
            href="https://github.com/andikaprasetyaaa"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick(500)}
            className="group bg-[#0e0e0e] border border-[#2a2a2a] hover:border-white/60 p-6 flex flex-col justify-between gap-8 transition-colors duration-200"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[#8e9192]">
                <span className="font-mono text-[10px] tracking-widest uppercase">01 // CODEBASE</span>
                <ArrowUpRight className="w-4 h-4 text-[#8e9192] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">GITHUB</h3>
              <span className="font-mono text-xs text-[#8e9192] truncate">github.com/andikaprasetyaaa</span>
            </div>
            <div className="bg-[#1c1b1b] p-3 flex flex-col gap-1.5 group-hover:bg-[#201f1f] transition-colors border border-[#2a2a2a]">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">PUBLIC REPOS</span>
                <span className="text-white font-bold">42+</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">COMMITS & OPS</span>
                <span className="text-white font-bold">1,480+</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">STATUS</span>
                <span className="text-white font-bold">ACTIVE</span>
              </div>
            </div>
          </a>

          {/* 02: LINKEDIN */}
          <a
            href="https://linkedin.com/in/andikaprasetya"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick(500)}
            className="group bg-[#0e0e0e] border border-[#2a2a2a] hover:border-white/60 p-6 flex flex-col justify-between gap-8 transition-colors duration-200"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[#8e9192]">
                <span className="font-mono text-[10px] tracking-widest uppercase">02 // NETWORK</span>
                <ArrowUpRight className="w-4 h-4 text-[#8e9192] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">LINKEDIN</h3>
              <span className="font-mono text-xs text-[#8e9192] truncate">linkedin.com/in/andikaprasetya</span>
            </div>
            <div className="bg-[#1c1b1b] p-3 flex flex-col gap-1.5 group-hover:bg-[#201f1f] transition-colors border border-[#2a2a2a]">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">NETWORK METRICS</span>
                <span className="text-white font-bold">500+</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">FOCUS</span>
                <span className="text-white font-bold">AI & AUTOMATION</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">VERIFICATION</span>
                <span className="text-white font-bold">VERIFIED</span>
              </div>
            </div>
          </a>

          {/* 03: DOMAIN / REPO */}
          <a
            href="https://github.com/andikaprasetyaaa/andika-prasetya-portofolio"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick(500)}
            className="group bg-[#0e0e0e] border border-[#2a2a2a] hover:border-white/60 p-6 flex flex-col justify-between gap-8 transition-colors duration-200"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[#8e9192]">
                <span className="font-mono text-[10px] tracking-widest uppercase">03 // DOMAIN</span>
                <ArrowUpRight className="w-4 h-4 text-[#8e9192] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">PORTFOLIO DOMAIN</h3>
              <span className="font-mono text-xs text-[#8e9192] truncate">andikaprasetya.dev</span>
            </div>
            <div className="bg-[#1c1b1b] p-3 flex flex-col gap-1.5 group-hover:bg-[#201f1f] transition-colors border border-[#2a2a2a]">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">SSL TLS PROTOCOL</span>
                <span className="text-white font-bold">ENCRYPTED</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">STATUS</span>
                <span className="text-white font-bold">LIVE ONLINE</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">HOSTING</span>
                <span className="text-white font-bold">EDGE GLOBAL</span>
              </div>
            </div>
          </a>

          {/* 04: DOSSIER */}
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick(500)}
            className="group bg-[#0e0e0e] border border-[#2a2a2a] hover:border-white/60 p-6 flex flex-col justify-between gap-8 transition-colors duration-200"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[#8e9192]">
                <span className="font-mono text-[10px] tracking-widest uppercase">04 // DOSSIER</span>
                <Download className="w-4 h-4 text-[#8e9192] group-hover:text-white group-hover:translate-y-0.5 transition-all duration-200" />
              </div>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">CURRICULUM VITAE</h3>
              <span className="font-mono text-xs text-[#8e9192]">CV Dossier [Google Drive]</span>
            </div>
            <div className="bg-[#1c1b1b] p-3 flex flex-col gap-1.5 group-hover:bg-[#201f1f] transition-colors border border-[#2a2a2a]">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">DOCUMENT FORMAT</span>
                <span className="text-white font-bold">VERIFIED PDF</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">DEGREE</span>
                <span className="text-white font-bold">B.Sc. (GPA 3.91)</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9192] uppercase">VALIDATION</span>
                <span className="text-white font-bold">AUTHENTICATED</span>
              </div>
            </div>
          </a>
        </div>

        {/* Live Contact Status Terminal Box */}
        <div className="bg-[#0e0e0e] border border-[#2a2a2a] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-md">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white" />
              <span className="font-mono text-xs text-white uppercase font-semibold">LOCATION TELEMETRY</span>
            </div>
            <p className="font-sans text-sm text-[#c4c7c8]">
              LOCATION: BALI / UTC+8 (REMOTE WORLDWIDE)
            </p>
            <span className="font-mono text-[10px] text-[#8e9192]">
              GEO_LAT: -8.3405 / GEO_LONG: 115.0920 // TIMEZONE SYNCHRONIZATION WITH SF, NYC, LONDON & SINGAPORE
            </span>
          </div>

          <div className="w-full lg:w-px lg:h-16 bg-[#2a2a2a] hidden lg:block" />

          <div className="flex flex-col gap-1.5 max-w-md">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white" />
              <span className="font-mono text-xs text-white uppercase font-semibold">DEPLOYMENT READINESS</span>
            </div>
            <p className="font-sans text-sm text-white">
              AVAILABILITY: ACCEPTING HIGH-IMPACT AI & AUTOMATION ROLES
            </p>
            <span className="font-mono text-[10px] text-[#8e9192]">
              FULL-CYCLE ARCHITECTURE / AI AUTOMATION / RAG & LLM SYSTEMS
            </span>
          </div>

          <div className="w-full lg:w-px lg:h-16 bg-[#2a2a2a] hidden lg:block" />

          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#201f1f] flex items-center justify-center relative">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-white relative" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#8e9192] uppercase">SYSTEM HEARTBEAT</span>
              <span className="font-mono text-xs text-white font-bold">100% OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Editorial Minimal Terminal Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#201f1f]">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
              DESIGN SYSTEM: OBSIDIAN KINETIC MONOCHROME
            </span>
            <span className="font-mono text-[10px] text-[#8e9192] uppercase tracking-wider">
              ARCHITECTURAL BRUTALISM // COMPUTATIONAL MONOCHROME CORE
            </span>
          </div>
          <div className="flex items-center">
            <p className="font-mono text-xs text-[#8e9192] uppercase">
              © {new Date().getFullYear()} I PUTU ANDIKA PRASETYA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

