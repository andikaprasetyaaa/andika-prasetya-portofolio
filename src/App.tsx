import React, { Component, Suspense, lazy, useCallback, useEffect, useState, type ReactNode } from 'react';
import { initScroll, scrollToIndex } from './lib/scroll';
import { uiStore } from './lib/settings';
import { sound } from './lib/sound';
import { SECTIONS } from './data/content';
import { Cursor } from './hud/Cursor';
import { LoadingScreen } from './hud/LoadingScreen';
import { Minimap } from './hud/Minimap';
import { PauseMenu } from './hud/PauseMenu';
import { Toasts } from './hud/Toasts';
import { TopBar } from './hud/TopBar';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Stack } from './sections/Stack';
import { Timeline } from './sections/Timeline';

const WorldCanvas = lazy(() => import('./world/WorldCanvas'));

/** If WebGL is unavailable the page simply keeps its painted sunset backdrop. */
class WorldBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export const App: React.FC = () => {
  const [worldReady, setWorldReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [bootGone, setBootGone] = useState(false);

  useEffect(() => initScroll(), []);

  // Never hold the visitor on the loading screen: fonts or the world may be slow, the page is not.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && setFontsReady(true)).catch(() => alive && setFontsReady(true));
    const timeout = window.setTimeout(() => {
      setFontsReady(true);
      setWorldReady(true);
    }, 5000);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, []);

  const markWorldReady = useCallback(() => setWorldReady(true), []);
  const onLift = useCallback(() => uiStore.set({ booted: true }), []);
  const onBootDone = useCallback(() => setBootGone(true), []);

  // keyboard shortcuts: M = menu, 1–6 = fast travel, Esc = back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const ui = uiStore.get();
      if (!ui.booted || ui.modalOpen) return;

      if (e.key === 'Escape') {
        if (ui.menuOpen) {
          sound.close();
          uiStore.set({ menuOpen: false });
        }
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        if (ui.menuOpen) sound.close();
        else sound.open();
        uiStore.set({ menuOpen: !ui.menuOpen });
        return;
      }
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= SECTIONS.length) {
        sound.click(660);
        if (ui.menuOpen) uiStore.set({ menuOpen: false });
        window.setTimeout(() => scrollToIndex(n - 1), ui.menuOpen ? 60 : 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-night-900 focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      {/* the living world */}
      <div className="world-fallback" aria-hidden="true" />
      <WorldBoundary onFail={markWorldReady}>
        <Suspense fallback={null}>
          <WorldCanvas onReady={markWorldReady} />
        </Suspense>
      </WorldBoundary>
      <div className="fx-vignette" aria-hidden="true" />

      <TopBar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Timeline />
        <Contact />
      </main>

      <Minimap />
      <Toasts />
      <PauseMenu />
      <Cursor />
      <div className="fx-grain" aria-hidden="true" />

      {!bootGone && <LoadingScreen ready={worldReady && fontsReady} onLift={onLift} onDone={onBootDone} />}
    </div>
  );
};

export default App;
