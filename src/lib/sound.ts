// Real GTA Theme Audio Player (/audio/*.mp3) + Web Audio UI SFX Engine.
// Plays authentic recorded GTA Theme MP3s (GTA Vice City Official Theme, GTA San Andreas Main Theme HQ,
// and GTA Vice City Synthwave Theme) with instant station switching and auto-unlock on first interaction.

import { settingsStore } from './settings';

type AudioCtor = typeof AudioContext;

export interface RadioStation {
  id: number;
  freq: string;
  name: string;
  track: string;
  src: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 0,
    freq: '86.9 FM',
    name: 'VICE CITY FM',
    track: 'GTA Vice City Main Theme',
    src: '/audio/gta-vice-city.mp3',
  },
  {
    id: 1,
    freq: '104.2 FM',
    name: 'SAN ANDREAS FM',
    track: 'GTA San Andreas Theme [HQ]',
    src: '/audio/gta-san-andreas.mp3',
  },
  {
    id: 2,
    freq: '98.5 FM',
    name: 'VICE SYNTH FM',
    track: 'GTA Vice City Synthwave',
    src: '/audio/gta-vice-synth.mp3',
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxBus: GainNode | null = null;
  private audio: HTMLAudioElement | null = null;
  private currentSrc = '';
  private isPlayingMusic = false;
  private lastHover = 0;
  private unlockBound = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.bindAutoUnlock();
      let prevSound = settingsStore.get().sound;
      let prevStation = settingsStore.get().station;

      settingsStore.subscribe(() => {
        const { sound, station } = settingsStore.get();
        if (sound !== prevSound) {
          prevSound = sound;
          if (sound) this.startMusic();
          else this.stopMusic();
        }
        if (station !== prevStation) {
          prevStation = station;
          if (sound) this.loadAndPlayStation();
        }
      });
    }
  }

  private get enabled() {
    return settingsStore.get().sound;
  }

  public get station(): RadioStation {
    const idx = settingsStore.get().station % RADIO_STATIONS.length;
    return RADIO_STATIONS[idx] ?? RADIO_STATIONS[0];
  }

  private bindAutoUnlock() {
    if (this.unlockBound) return;
    this.unlockBound = true;
    const unlock = () => {
      if (this.enabled && !this.isPlayingMusic) {
        this.startMusic();
      }
      if (this.isPlayingMusic && this.audio && !this.audio.paused) {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      }
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  private ensureAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      const el = new Audio();
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0.55;
      this.audio = el;
    }
    return this.audio;
  }

  private loadAndPlayStation() {
    const el = this.ensureAudioElement();
    if (!el) return;
    const st = this.station;
    if (this.currentSrc !== st.src) {
      this.currentSrc = st.src;
      el.src = st.src;
      el.load();
    }
    if (this.enabled) {
      el.volume = 0.55;
      const p = el.play();
      if (p) {
        p.then(() => {
          this.isPlayingMusic = true;
        }).catch(() => {
          this.isPlayingMusic = false;
        });
      }
    }
  }

  public startMusic() {
    if (!this.enabled) return;
    this.ensureSfxContext();
    const el = this.ensureAudioElement();
    if (!el) return;
    const st = this.station;
    if (this.currentSrc !== st.src) {
      this.currentSrc = st.src;
      el.src = st.src;
      el.load();
    }
    el.volume = 0.55;
    const p = el.play();
    if (p) {
      p.then(() => {
        this.isPlayingMusic = true;
      }).catch(() => {
        this.isPlayingMusic = false;
      });
    }
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.audio) {
      this.audio.pause();
    }
  }

  public nextStation(): RadioStation {
    const next = (settingsStore.get().station + 1) % RADIO_STATIONS.length;
    settingsStore.set({ station: next, sound: true });
    this.tone({ freq: 920, to: 420, dur: 0.08, type: 'sine', gain: 0.04 });
    this.loadAndPlayStation();
    return this.station;
  }

  /* ---------------- Web Audio UI SFX ---------------- */

  private ensureSfxContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor: AudioCtor | undefined =
        window.AudioContext || (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return null;
      try {
        this.ctx = new Ctor();
        this.sfxBus = this.ctx.createGain();
        this.sfxBus.gain.value = 0.5;
        this.sfxBus.connect(this.ctx.destination);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private tone(opts: {
    freq: number;
    to?: number;
    dur: number;
    type?: OscillatorType;
    gain?: number;
    delay?: number;
  }) {
    if (!this.enabled) return;
    const ctx = this.ensureSfxContext();
    if (!ctx || !this.sfxBus) return;
    try {
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = opts.type ?? 'sine';
      osc.frequency.setValueAtTime(opts.freq, t0);
      if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur);
      const peak = opts.gain ?? 0.045;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(t0);
      osc.stop(t0 + opts.dur + 0.03);
    } catch {
      /* ignore audio errors */
    }
  }

  hover() {
    const now = performance.now();
    if (now - this.lastHover < 70) return;
    this.lastHover = now;
    this.tone({ freq: 1150, to: 1320, dur: 0.04, type: 'sine', gain: 0.016 });
  }

  click(freq = 520) {
    if (this.enabled && !this.isPlayingMusic) this.startMusic();
    this.tone({ freq, to: freq * 1.5, dur: 0.065, type: 'triangle', gain: 0.04 });
  }

  slide() {
    if (this.enabled && !this.isPlayingMusic) this.startMusic();
    this.tone({ freq: 320, to: 480, dur: 0.09, type: 'triangle', gain: 0.032 });
  }

  open() {
    if (this.enabled && !this.isPlayingMusic) this.startMusic();
    this.tone({ freq: 220, to: 520, dur: 0.15, type: 'sine', gain: 0.035 });
    this.tone({ freq: 660, to: 880, dur: 0.11, type: 'sine', gain: 0.022, delay: 0.06 });
  }

  close() {
    this.tone({ freq: 520, to: 240, dur: 0.13, type: 'sine', gain: 0.032 });
  }

  success() {
    if (this.enabled && !this.isPlayingMusic) this.startMusic();
    this.tone({ freq: 660, dur: 0.1, type: 'triangle', gain: 0.04 });
    this.tone({ freq: 880, dur: 0.11, type: 'triangle', gain: 0.04, delay: 0.08 });
    this.tone({ freq: 1320, dur: 0.18, type: 'sine', gain: 0.028, delay: 0.16 });
  }

  toggle(): boolean {
    const next = !settingsStore.get().sound;
    settingsStore.set({ sound: next });
    if (next) {
      this.startMusic();
      this.success();
    } else {
      this.stopMusic();
    }
    return next;
  }
}

export const sound = new SoundEngine();
