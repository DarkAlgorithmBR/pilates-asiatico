/**
 * Desafio Pilates de Parede - 28 Dias
 * Especialista: Beatriz Araujo
 * Módulo de Efeitos Sonoros com Web Audio API Nativo
 * 100% livre de arquivos de áudio externos, ultra rápido e responsivo
 */

const SoundEngine = {
  ctx: null,
  muted: false,

  init() {
    // Carregar preferência salva
    const saved = localStorage.getItem('pilates_audio_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  },

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },

  isMuted() {
    return this.muted;
  },

  setMuted(val) {
    this.muted = Boolean(val);
    localStorage.setItem('pilates_audio_muted', this.muted);
    return this.muted;
  },

  toggleMute() {
    return this.setMuted(!this.muted);
  },

  /**
   * Bip de contagem regressiva suave (3, 2, 1)
   */
  playCountdownBeep(freq = 880) {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  },

  /**
   * Som de Início / Valendo (Acorde duplo brilhante)
   */
  playStartSound() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [1046.5, 1318.5].forEach((freq, i) => { // C6 + E6
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.22, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.36);
      });
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  },

  /**
   * Som de Descanso (Sino relaxante)
   */
  playRestSound() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4); // A4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  },

  /**
   * Fanfarra da Vitória / Treino Concluído (Arpejo edificante)
   */
  playVictorySound() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const time = now + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.25, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (idx === notes.length - 1 ? 0.8 : 0.25));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + (idx === notes.length - 1 ? 0.85 : 0.28));
      });
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }
};

SoundEngine.init();
