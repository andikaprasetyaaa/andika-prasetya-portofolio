import React, { useState } from 'react';
import { soundManager } from './SoundManager';
import { scrollToSection } from '../lib/lenis';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderNavProps {
  activeSection: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: '01. HERO' },
    { id: 'about', label: '02. ABOUT' },
    { id: 'projects', label: '03. PROJECTS' },
    { id: 'stack', label: '04. STACK' },
    { id: 'timeline', label: '05. TIMELINE' },
    { id: 'contact', label: '06. CONTACT' },
  ];

  const handleNavClick = (id: string) => {
    soundManager.playClick();
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#131313]/85 backdrop-blur-xl border-b border-[#201f1f]">
      <div className="h-14 w-full px-gutter flex items-center justify-between">
        {/* Brand Left */}
        <div className="flex items-center gap-space-md">
          {/* Geometric Monogram */}
          <button
            onClick={() => handleNavClick('hero')}
            aria-label="Scroll to Hero"
            className="w-8 h-8 border border-white flex items-center justify-center bg-black shadow-sm shrink-0 hover:bg-white hover:text-black transition-colors"
          >
            <span className="font-headline font-bold text-base tracking-tighter">P</span>
          </button>

          <button
            onClick={() => handleNavClick('hero')}
            className="font-headline text-base sm:text-lg text-primary tracking-tight font-bold hover:opacity-80 transition-opacity"
          >
            PORTFOLIO
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-[#201f1f] rounded border border-[#2a2a2a]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="font-mono text-[9px] text-[#e5e2e1] uppercase">
              AVAILABLE FOR HIRE
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-space-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-mono text-[11px] tracking-wider transition-colors py-1 ${
                  isActive
                    ? 'text-white font-bold border-b border-white'
                    : 'text-[#c4c7c8] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-space-md">
          {/* Resume Quick Trigger */}
          <button
            onClick={() => handleNavClick('contact')}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 bg-white text-black font-mono text-[11px] font-semibold uppercase hover:bg-[#c7c6c6] transition-colors gap-1"
          >
            <span>RESUME</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white hover:text-white/80"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#0e0e0e] border-b border-[#201f1f] px-gutter py-4 flex flex-col gap-3 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="font-mono text-xs tracking-wider text-left py-2 border-b border-[#1c1b1b] text-[#c4c7c8] hover:text-white flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-[10px] text-[#8e9192]">SELECT</span>
            </button>
          ))}
          <div className="pt-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8e9192]">BALI, INDONESIA // REMOTE</span>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-3 py-1 bg-white text-black font-mono text-[10px] font-bold uppercase"
            >
              TRANSMIT DOSSIER
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
