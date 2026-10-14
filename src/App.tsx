import React, { useState, useEffect } from 'react';
import { initLenis } from './lib/lenis';
import { CustomCursor } from './components/CustomCursor';
import { HeaderNav } from './components/HeaderNav';
import { SlideProgress } from './components/SlideProgress';
import { LocationStamp } from './components/LocationStamp';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { StackSection } from './sections/StackSection';
import { TimelineSection } from './sections/TimelineSection';
import { ContactSection } from './sections/ContactSection';
import { GlobalStarfield3D } from './three/GlobalStarfield3D';

const SECTION_IDS = ['hero', 'about', 'projects', 'stack', 'timeline', 'contact'];

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentSection, setCurrentSection] = useState<number>(1);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = initLenis();
    return () => {
      lenis.destroy();
    };
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(SECTION_IDS[i]);
          setCurrentSection(i + 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#e5e2e1] selection:bg-white selection:text-black">
      {/* Global Cinematic 3D Starfield Background */}
      <GlobalStarfield3D />

      {/* Film Grain Texture Overlay */}
      <div className="film-grain" />

      {/* Custom Spring Blend Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Header Navigation */}
      <HeaderNav activeSection={activeSection} />

      {/* Main 6 Sections Flow */}
      <main className="w-full relative">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <StackSection />
        <TimelineSection />
        <ContactSection />
      </main>

      {/* Fixed Right Slide Progress Bar (01 / 06) */}
      <SlideProgress currentSection={currentSection} />

      {/* Fixed Bottom-Left Geo Coordinates & Telemetry */}
      <LocationStamp />
    </div>
  );
};

export default App;
