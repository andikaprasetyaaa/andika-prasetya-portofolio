import { useSyncExternalStore } from 'react';

export type MotionPref = 'full' | 'reduced';
export type QualityPref = 'auto' | 'high' | 'low';

export interface Settings {
  sound: boolean;
  motion: MotionPref;
  quality: QualityPref;
}

export interface UiState {
  /** Pause menu overlay */
  menuOpen: boolean;
  /** Any modal layer that should freeze the world + page scroll */
  modalOpen: boolean;
  /** The intro curtain has finished */
  booted: boolean;
}

const STORAGE_KEY = 'ap-portfolio-settings-v1';

function systemPrefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function loadSettings(): Settings {
  const base: Settings = {
    sound: false,
    motion: systemPrefersReducedMotion() ? 'reduced' : 'full',
    quality: 'auto',
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<Settings>;
    return {
      // Sound is always opt-in per visit: never start a page with audio on.
      sound: false,
      motion: saved.motion === 'full' || saved.motion === 'reduced' ? saved.motion : base.motion,
      quality: saved.quality === 'high' || saved.quality === 'low' || saved.quality === 'auto' ? saved.quality : 'auto',
    };
  } catch {
    return base;
  }
}

type Listener = () => void;

function createStore<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set: (patch: Partial<T>) => {
      state = { ...state, ...patch };
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

export const settingsStore = createStore<Settings>(
  typeof window === 'undefined' ? { sound: false, motion: 'full', quality: 'auto' } : loadSettings(),
);

export const uiStore = createStore<UiState>({ menuOpen: false, modalOpen: false, booted: false });

function applyMotionAttribute(motion: MotionPref) {
  if (typeof document !== 'undefined') document.documentElement.dataset.motion = motion;
}

if (typeof window !== 'undefined') {
  applyMotionAttribute(settingsStore.get().motion);
  settingsStore.subscribe(() => {
    const s = settingsStore.get();
    applyMotionAttribute(s.motion);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ motion: s.motion, quality: s.quality }));
    } catch {
      /* storage unavailable — settings just won't persist */
    }
  });
}

export function useSettings(): Settings {
  return useSyncExternalStore(settingsStore.subscribe, settingsStore.get, settingsStore.get);
}

export function useUi(): UiState {
  return useSyncExternalStore(uiStore.subscribe, uiStore.get, uiStore.get);
}

export function useReducedMotionPref(): boolean {
  return useSettings().motion === 'reduced';
}

/** Low-power heuristics used when quality is "auto". */
export function detectLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 520;
  const lowMem = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const fewCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  return Boolean((coarse && small) || lowMem || (coarse && fewCores));
}

export function resolveQuality(q: QualityPref): 'high' | 'low' {
  if (q === 'auto') return detectLowPower() ? 'low' : 'high';
  return q;
}
