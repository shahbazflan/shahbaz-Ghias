/**
 * Ambient Studio Soundscape Engine
 * Pure Web Audio API procedural synthesis:
 * Generates an ultra-soft, cinematic ambient studio drone with warm analog harmonics,
 * slow low-frequency breath modulation, and subtle binaural stereo spatialization.
 * Zero external audio file dependencies, zero buffering, seamless infinite loop.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private isInitialized = false;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private cleanupFns: Array<() => void> = [];

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public subscribe(callback: (playing: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  private initEngine() {
    if (this.isInitialized && this.ctx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      // Master Gain for smooth cross-fades
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Warm analog lowpass filter (removes any harsh digital highs)
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(320, this.ctx.currentTime);
      lowpass.Q.setValueAtTime(1.2, this.ctx.currentTime);
      lowpass.connect(this.masterGain);

      // Slow LFO for filter breathing (0.07 Hz = ~14s period)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.07, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(lowpass.frequency);
      lfo.start();

      // Ambient chords: D1 (36.71 Hz), A1 (55.00 Hz), D2 (73.42 Hz), F#2 (92.50 Hz), A2 (110.00 Hz)
      const droneFrequencies = [
        { freq: 36.71, gain: 0.12, type: 'sine' as OscillatorType, pan: 0 },
        { freq: 55.00, gain: 0.08, type: 'triangle' as OscillatorType, pan: -0.25 },
        { freq: 73.42, gain: 0.07, type: 'sine' as OscillatorType, pan: 0.25 },
        { freq: 110.00, gain: 0.05, type: 'sine' as OscillatorType, pan: -0.4 },
        { freq: 164.81, gain: 0.035, type: 'triangle' as OscillatorType, pan: 0.35 },
      ];

      const nodesToStop: AudioNode[] = [lfo];

      droneFrequencies.forEach(({ freq, gain, type, pan }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Micro-detuning for lush analog chorus warmth
        osc.detune.setValueAtTime((Math.random() - 0.5) * 6, this.ctx.currentTime);
        
        oscGain.gain.setValueAtTime(gain, this.ctx.currentTime);

        if (this.ctx.createStereoPanner) {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(pan, this.ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(panner);
          panner.connect(lowpass);
        } else {
          osc.connect(oscGain);
          oscGain.connect(lowpass);
        }

        osc.start();
        nodesToStop.push(osc);
      });

      // Soft tape warmth generator (ultra-quiet filtered pink noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.015;
      }
      
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.018, this.ctx.currentTime);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noiseSource.start();
      nodesToStop.push(noiseSource);

      this.cleanupFns.push(() => {
        nodesToStop.forEach((node) => {
          try {
            if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
              (node as AudioScheduledSourceNode).stop();
            }
          } catch {
            // ignore
          }
        });
      });

      this.isInitialized = true;
    } catch (err) {
      console.warn('Ambient Audio initialization error:', err);
    }
  }

  public async toggle(): Promise<boolean> {
    if (!this.isPlaying) {
      return this.play();
    } else {
      return this.pause();
    }
  }

  public async play(): Promise<boolean> {
    this.initEngine();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('Audio resume error:', e);
      }
    }

    // Smooth studio fade-in (1.2 seconds to comfortable ambient level)
    const targetGain = 0.14;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 1.2);

    this.isPlaying = true;
    this.notify();
    return true;
  }

  public async pause(): Promise<boolean> {
    if (!this.ctx || !this.masterGain) {
      this.isPlaying = false;
      this.notify();
      return false;
    }

    // Smooth studio fade-out (0.6 seconds)
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.6);

    setTimeout(() => {
      this.isPlaying = false;
      this.notify();
    }, 600);

    return false;
  }
}

export const ambientAudio = new AmbientAudioEngine();
