/**
 * Generative Web Audio Ambient Engine
 * Synthesizes a quiet, warm celestial pad and crystalline harmonic resonances.
 * Operates without external asset dependencies and complies strictly with browser autoplay policies.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low-pass filter for velvety night warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(440, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);
      filter.connect(this.masterGain);

      // Peaceful chord frequencies: F3, C4, E4, A4, C5 (F maj7 / lush romantic resonance)
      const freqs = [174.61, 261.63, 329.63, 440.0, 523.25];

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.8, this.ctx.currentTime);

        // Soft relative balance
        const vol = 0.08 / (idx + 1);
        oscGain.gain.setValueAtTime(vol, this.ctx.currentTime);

        // Slow LFO modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(vol * 0.4, this.ctx.currentTime);
        lfo.connect(lfoGain.gain);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();

        this.oscillators.push(osc);
      });

      this.isRunning = true;
    } catch {
      // AudioContext unavailable or denied
    }
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMuted) {
      this.unmute();
      return true;
    } else {
      this.mute();
      return false;
    }
  }

  public unmute() {
    if (!this.ctx || !this.masterGain) return;
    this.isMuted = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 3.0);
  }

  public mute() {
    if (!this.ctx || !this.masterGain) return;
    this.isMuted = true;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
  }

  public playGentleChime(noteFreq: number = 880) {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.5);
    } catch {
      // Silent catch
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const ambientSound = new AmbientSoundEngine();
