// Terraria Audio Manager: Authentic OST playback + Web Audio API Chiptune SFX

class TerrariaAudioManager {
  private dayAudio: HTMLAudioElement | null = null;
  private nightAudio: HTMLAudioElement | null = null;
  private currentTrack: 'day' | 'night' = 'day';
  private isPlaying: boolean = false;
  private volume: number = 0.45;
  private sfxEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initTracks();
    }
  }

  private initTracks() {
    try {
      this.dayAudio = new Audio('/audio/day.mp3');
      this.dayAudio.loop = true;
      this.dayAudio.volume = this.volume;

      this.nightAudio = new Audio('/audio/night.mp3');
      this.nightAudio.loop = true;
      this.nightAudio.volume = 0;

      this.dayAudio.onerror = () => {
        if (this.dayAudio) this.dayAudio.src = '/audio/day.mp4';
      };
      this.nightAudio.onerror = () => {
        if (this.nightAudio) this.nightAudio.src = '/audio/night.mp4';
      };
    } catch (e) {
      console.warn('Audio init warning:', e);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    if (!this.dayAudio || !this.nightAudio) this.initTracks();
    const active = this.currentTrack === 'day' ? this.dayAudio : this.nightAudio;
    const inactive = this.currentTrack === 'day' ? this.nightAudio : this.dayAudio;

    if (inactive) {
      inactive.pause();
      inactive.currentTime = 0;
    }

    if (active) {
      active.volume = this.volume;
      active.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((err) => {
        console.log('Autoplay blocked or user gesture required:', err);
      });
    }
  }

  public pause() {
    if (this.dayAudio) this.dayAudio.pause();
    if (this.nightAudio) this.nightAudio.pause();
    this.isPlaying = false;
    this.notify();
  }

  public switchTheme(mode: 'day' | 'night') {
    if (this.currentTrack === mode) return;
    this.currentTrack = mode;

    this.playThemeChangeSound(mode);

    if (!this.isPlaying) {
      this.notify();
      return;
    }

    const incoming = mode === 'day' ? this.dayAudio : this.nightAudio;
    const outgoing = mode === 'day' ? this.nightAudio : this.dayAudio;

    if (outgoing) {
      outgoing.pause();
      outgoing.currentTime = 0;
    }

    if (incoming) {
      incoming.volume = this.volume;
      incoming.play().catch(() => {});
    }

    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.dayAudio && this.currentTrack === 'day') this.dayAudio.volume = this.volume;
    if (this.nightAudio && this.currentTrack === 'night') this.nightAudio.volume = this.volume;
    this.notify();
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    this.notify();
    return this.sfxEnabled;
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
      sfxEnabled: this.sfxEnabled,
    };
  }

  public playClickSound() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  public playPickupSound() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [587.33, 880, 1174.66];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.15 * this.volume, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.15);
      });
    } catch {
      // ignore
    }
  }

  public playMineSound() {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // ignore
    }
  }

  public playThemeChangeSound(mode: 'day' | 'night') {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (mode === 'day') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.15 * this.volume, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.22);
        });
      } else {
        [440, 392, 329.63, 220].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.16 * this.volume, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.35);
        });
      }
    } catch {
      // ignore
    }
  }
}

export const audioManager = new TerrariaAudioManager();

