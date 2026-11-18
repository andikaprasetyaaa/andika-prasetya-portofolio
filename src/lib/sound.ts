// Tiny Web Audio synth for interface feedback. No audio files, nothing plays until the visitor opts in.
import { settingsStore } from './settings';

type AudioCtor = typeof AudioContext;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastHover = 0;

  private get enabled() {
    return settingsStore.get().sound;
  }

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor: AudioCtor | undefined =
        window.AudioContext || (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return null;
      try {
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
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
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    try {
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = opts.type ?? 'sine';
      osc.frequency.setValueAtTime(opts.freq, t0);
      if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur);
      const peak = opts.gain ?? 0.05;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + opts.dur + 0.03);
    } catch {
      /* ignore audio errors */
    }
  }

  /** Soft tick when moving across menu items */
  hover() {
    const now = performance.now();
    if (now - this.lastHover < 70) return;
    this.lastHover = now;
    this.tone({ freq: 1150, to: 1320, dur: 0.045, type: 'sine', gain: 0.018 });
  }

  /** Confirm / select */
  click(freq = 520) {
    this.tone({ freq, to: freq * 1.5, dur: 0.07, type: 'triangle', gain: 0.045 });
  }

  /** Lateral move (carousel, tabs) */
  slide() {
    this.tone({ freq: 320, to: 480, dur: 0.1, type: 'triangle', gain: 0.035 });
  }

  /** Menu / modal opening */
  open() {
    this.tone({ freq: 220, to: 520, dur: 0.16, type: 'sine', gain: 0.04 });
    this.tone({ freq: 660, to: 880, dur: 0.12, type: 'sine', gain: 0.025, delay: 0.07 });
  }

  /** Menu / modal closing */
  close() {
    this.tone({ freq: 520, to: 240, dur: 0.14, type: 'sine', gain: 0.035 });
  }

  /** Positive confirmation (copied, sent) */
  success() {
    this.tone({ freq: 660, dur: 0.11, type: 'triangle', gain: 0.045 });
    this.tone({ freq: 880, dur: 0.12, type: 'triangle', gain: 0.045, delay: 0.09 });
    this.tone({ freq: 1320, dur: 0.2, type: 'sine', gain: 0.03, delay: 0.18 });
  }

  /** Returns the new state */
  toggle(): boolean {
    const next = !settingsStore.get().sound;
    settingsStore.set({ sound: next });
    if (next) {
      this.ensure();
      this.success();
    }
    return next;
  }
}

export const sound = new SoundEngine();
