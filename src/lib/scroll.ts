import Lenis from 'lenis';
import { useSyncExternalStore } from 'react';
import { SECTION_IDS, type SectionId } from '../data/content';
import { clamp } from './math';
import { settingsStore, uiStore } from './settings';

/**
 * Mutable scroll + pointer state. The 3D world and the HUD read this every frame
 * without going through React, so scrolling never causes re-renders.
 */
export const scrollState = {
  y: 0,
  max: 1,
  /** 0 → 1 across the whole page */
  progress: 0,
  velocity: 0,
  /** Continuous section position: 0 = hero top, 1 = about top, … */
  journey: 0,
  /** Index of the section currently under the reading line */
  active: 0,
  vw: 1280,
  vh: 800,
  /** Pointer in -1..1 (x right, y up) */
  pointerX: 0,
  pointerY: 0,
};

let lenis: Lenis | null = null;
let rafId = 0;
let tops: number[] = [];
let lastY = 0;
let lastT = 0;

const activeListeners = new Set<() => void>();
const frameListeners = new Set<() => void>();

function measure() {
  if (typeof window === 'undefined') return;
  scrollState.vw = window.innerWidth;
  scrollState.vh = window.innerHeight;
  const sy = window.scrollY;
  tops = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + sy : 0;
  });
  scrollState.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  update();
}

function update() {
  const y = window.scrollY;
  const now = performance.now();
  const dt = Math.max(1, now - lastT);
  // px per ms, lightly smoothed
  const v = (y - lastY) / dt;
  scrollState.velocity = scrollState.velocity * 0.7 + v * 0.3;
  lastY = y;
  lastT = now;

  scrollState.y = y;
  scrollState.progress = clamp(y / scrollState.max);

  if (tops.length === SECTION_IDS.length) {
    // journey: where the top of the viewport sits between section starts
    const docEnd = scrollState.max + scrollState.vh;
    let j = 0;
    for (let i = tops.length - 1; i >= 0; i--) {
      if (y >= tops[i] - 0.5) {
        const next = i < tops.length - 1 ? tops[i + 1] : docEnd;
        j = i + clamp((y - tops[i]) / Math.max(1, next - tops[i]));
        break;
      }
    }
    scrollState.journey = j;

    // active: section under a reading line 40% down the viewport
    const line = y + scrollState.vh * 0.4;
    let active = 0;
    for (let i = tops.length - 1; i >= 0; i--) {
      if (line >= tops[i]) {
        active = i;
        break;
      }
    }
    // the very bottom of the page always belongs to the last section
    if (y >= scrollState.max - 4) active = tops.length - 1;
    if (active !== scrollState.active) {
      scrollState.active = active;
      activeListeners.forEach((l) => l());
    }
  }
  frameListeners.forEach((l) => l());
}

function createLenis() {
  destroyLenis();
  if (settingsStore.get().motion === 'reduced') return;
  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });
  (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;
  const loop = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  applyLock();
}

function destroyLenis() {
  cancelAnimationFrame(rafId);
  if (lenis) {
    lenis.destroy();
    lenis = null;
    (window as unknown as { __lenis?: Lenis | null }).__lenis = null;
  }
}

function applyLock() {
  const ui = uiStore.get();
  const locked = ui.menuOpen || ui.modalOpen || !ui.booted;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/** Boot smooth scrolling + scroll tracking. Returns a cleanup function. */
export function initScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  createLenis();
  measure();

  const onScroll = () => update();
  const onResize = () => measure();
  const onPointer = (e: PointerEvent) => {
    scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointer, { passive: true });

  // Section offsets move when fonts load or content reflows.
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  document.fonts?.ready.then(() => measure()).catch(() => {});

  let motion = settingsStore.get().motion;
  const unsubSettings = settingsStore.subscribe(() => {
    const next = settingsStore.get().motion;
    if (next !== motion) {
      motion = next;
      createLenis();
    }
  });
  const unsubUi = uiStore.subscribe(applyLock);
  applyLock();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointer);
    ro.disconnect();
    unsubSettings();
    unsubUi();
    destroyLenis();
    document.documentElement.style.overflow = '';
  };
}

export function scrollToSection(id: SectionId | string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.3 });
  } else {
    const reduced = settingsStore.get().motion === 'reduced';
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
}

export function scrollToIndex(index: number) {
  const id = SECTION_IDS[clamp(index, 0, SECTION_IDS.length - 1)];
  scrollToSection(id);
}

/** Subscribe to scroll updates without React (used to invalidate on-demand rendering). */
export function onScrollFrame(listener: () => void): () => void {
  frameListeners.add(listener);
  return () => {
    frameListeners.delete(listener);
  };
}

function subscribeActive(listener: () => void) {
  activeListeners.add(listener);
  return () => {
    activeListeners.delete(listener);
  };
}

/** Index of the section the visitor is currently reading. */
export function useActiveSection(): number {
  return useSyncExternalStore(
    subscribeActive,
    () => scrollState.active,
    () => 0,
  );
}
