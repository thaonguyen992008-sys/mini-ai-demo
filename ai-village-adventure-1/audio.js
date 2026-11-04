'use strict';
/* =========================================================
   The AI Village Adventure – Giải cứu Làng AI
   audio.js: THE AUDIO SYSTEM (no sound files needed)

   • Music and sound effects are made by the browser itself
     with the Web Audio API (oscillators + noise).
   • Character voices use the browser's built-in speech
     (Web Speech API, speechSynthesis).
   • Nothing plays until the player clicks or presses a key
     (browsers block sound before that).
   • If a browser can't do something, that part is switched
     off and the game keeps working.

   The game calls this file through the "Sound" object, e.g.
     Sound.sfx('correct')      Sound.speak('Wang', 'Hello!')
   This file is loaded BEFORE script.js and only uses the
   game's variables inside functions.
   ========================================================= */


/* ---------- A. SETTINGS (saved in this browser) ---------- */
const AUDIO_SAVE_KEY = 'aiVillageAdventure.audio.v1';
const AUDIO_DEFAULTS = {
  music: { on: true, vol: 50 },
  sfx: { on: true, vol: 70 },
  voice: { on: true, vol: 80 },
};

function loadAudioSettings() {
  const settings = JSON.parse(JSON.stringify(AUDIO_DEFAULTS));
  try {
    const saved = JSON.parse(localStorage.getItem(AUDIO_SAVE_KEY) || 'null');
    if (saved) {
      for (const ch of ['music', 'sfx', 'voice']) {
        if (saved[ch] && typeof saved[ch].on === 'boolean') settings[ch].on = saved[ch].on;
        if (saved[ch] && Number.isFinite(saved[ch].vol)) settings[ch].vol = Math.max(0, Math.min(100, saved[ch].vol));
      }
    }
  } catch (error) { /* storage blocked or broken: use defaults */ }
  return settings;
}

function saveAudioSettings() {
  try { localStorage.setItem(AUDIO_SAVE_KEY, JSON.stringify(Sound.settings)); } catch (error) { /* ignore */ }
}


/* ---------- B. CHARACTER VOICES (Web Speech API) ----------
   pitch: 0 (lowest) – 2 (highest), rate: speaking speed (1 = normal).
   "voice" picks a male- or female-sounding voice when the
   browser offers one; otherwise the browser's default is used. */
const VOICE_PROFILES = {
  'NIAN':            { pitch: 0.85, rate: 0.92, voice: 'male' },     // calm, older
  'Wang':            { pitch: 1.75, rate: 1.15, voice: 'robot' },    // high, quick little robot
  'BUG.exe':         { pitch: 0.15, rate: 0.82, voice: 'male', glitch: true },  // deep, slow, glitchy
  'Loudspeaker':     { pitch: 0.15, rate: 0.9, voice: 'male', glitch: true },   // BUG.exe's loudspeaker
  'Cô Lan':          { pitch: 1.15, rate: 1.0, voice: 'female' },
  'Ông Tư':          { pitch: 0.7, rate: 0.85, voice: 'male' },
  'Anh Dũng':        { pitch: 1.0, rate: 1.08, voice: 'male' },
  'Chị Thu':         { pitch: 1.2, rate: 1.05, voice: 'female' },
  'Bà Hương':        { pitch: 0.95, rate: 0.85, voice: 'female' },
  'Chú Minh':        { pitch: 0.9, rate: 0.95, voice: 'male' },
  'Cô Hoa':          { pitch: 1.3, rate: 1.05, voice: 'female' },
  'Bác Trưởng thôn': { pitch: 0.8, rate: 0.9, voice: 'male' },
  'Thầy Khoa':       { pitch: 1.0, rate: 0.95, voice: 'male' },
};


/* ---------- C. MUSIC (notes are MIDI numbers: 60 = middle C) ----------
   Each track is a loop of eighth-note steps. null = rest. */
const MUSIC_TRACKS = {
  // Calm village tune in a pentatonic scale (D E F# A B)
  village: {
    bpm: 96, leadInst: 'pluck', bassInst: 'soft',
    melody: [74, null, 76, null, 78, null, 81, null,  78, null, 76, null, 74, null, null, null,
             71, null, 74, null, 76, null, 78, null,  76, null, 74, null, 71, null, null, null,
             78, null, 81, null, 83, null, 81, null,  78, null, 76, null, 78, null, null, null,
             76, null, 74, null, 71, null, 69, null,  71, null, 74, null, 74, null, null, null],
    bass:   [50, null, null, null, 57, null, null, null,  47, null, null, null, 54, null, null, null,
             43, null, null, null, 50, null, null, null,  45, null, null, null, 52, null, null, null,
             50, null, null, null, 57, null, null, null,  47, null, null, null, 54, null, null, null,
             43, null, null, null, 45, null, null, null,  50, null, null, null, 50, null, null, null],
  },
  // Thoughtful arpeggios while solving puzzles and quizzes
  mission: {
    bpm: 84, leadInst: 'bell', bassInst: 'soft',
    melody: [69, 72, 76, 72, 69, 72, 76, 79,  67, 71, 74, 71, 67, 71, 74, 76,
             65, 69, 72, 69, 65, 69, 72, 76,  64, 67, 71, 67, 64, 67, 71, 74],
    bass:   [45, null, null, null, null, null, null, null,  43, null, null, null, null, null, null, null,
             41, null, null, null, null, null, null, null,  40, null, null, null, null, null, null, null],
  },
  // Dark, uneasy drone while the cosmic hole is open
  corrupted: {
    bpm: 70, leadInst: 'glass', bassInst: 'drone', glitchy: true,
    melody: [62, null, null, 65, null, null, 63, null,  null, null, 62, null, null, 58, null, null,
             62, null, null, 65, null, 68, null, null,  67, null, null, 63, null, null, null, null],
    bass:   [38, null, null, null, null, null, null, null,  38, null, null, null, null, null, null, null,
             37, null, null, null, null, null, null, null,  38, null, null, null, null, null, null, null],
  },
  // Driving battle music in E minor with drums
  boss: {
    bpm: 140, leadInst: 'square', bassInst: 'pulse',
    melody: [64, null, 67, null, 71, null, 70, 71,  null, 67, null, 64, 66, null, 67, null,
             64, null, 67, null, 71, null, 74, 72,  null, 71, null, 67, 69, null, 71, null],
    bass:   [40, 40, 52, 40, 40, 52, 40, 52,  36, 36, 48, 36, 38, 38, 50, 38,
             40, 40, 52, 40, 40, 52, 40, 52,  43, 43, 55, 43, 42, 42, 54, 47],
    kick:   [1, 0, 0, 0, 1, 0, 0, 0,  1, 0, 0, 0, 1, 0, 1, 0,  1, 0, 0, 0, 1, 0, 0, 0,  1, 0, 0, 0, 1, 0, 1, 1],
    snare:  [0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 1, 1, 0],
    hat:    [0, 1, 0, 1, 0, 1, 0, 1,  0, 1, 0, 1, 0, 1, 0, 1,  0, 1, 0, 1, 0, 1, 0, 1,  0, 1, 0, 1, 0, 1, 0, 1],
  },
  // Bright, happy fanfare for the victory and celebration
  victory: {
    bpm: 120, leadInst: 'pluck', bassInst: 'soft',
    melody: [72, null, 76, null, 79, null, 84, null,  79, null, 84, null, 88, null, null, null,
             77, null, 81, null, 84, null, 81, null,  79, null, 76, null, 79, null, null, null,
             72, null, 76, null, 79, null, 84, null,  86, null, 84, null, 81, null, 79, null,
             77, null, 76, null, 74, null, 79, null,  84, null, null, null, 84, null, null, null],
    bass:   [48, null, 55, null, 48, null, 55, null,  48, null, 55, null, 52, null, 55, null,
             53, null, 60, null, 53, null, 60, null,  55, null, 62, null, 55, null, 59, null,
             48, null, 55, null, 48, null, 55, null,  53, null, 57, null, 53, null, 57, null,
             55, null, 59, null, 55, null, 59, null,  48, null, 55, null, 48, null, null, null],
    hat:    [0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,
             0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 1, 0,  0, 0, 1, 0, 0, 0, 0, 0],
  },
};


/* ---------- D. THE SOUND SYSTEM ---------- */
// Loudness. Music and effects are made from quiet oscillators, so they are
// boosted here; the limiter above stops them from crackling.
const MASTER_BOOST = 2.2;   // overall loudness
const MUSIC_LEVEL = 1.4;    // music at 100% volume
const SFX_LEVEL = 1.6;      // sound effects at 100% volume

const Sound = {
  settings: loadAudioSettings(),
  supported: {
    webAudio: !!(window.AudioContext || window.webkitAudioContext),
    speech: 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function',
  },
  ctx: null,              // the AudioContext (created on the first click/key press)
  unlocked: false,
  buses: null,            // master, music and effects volume controls
  track: null,            // music that is playing now
  wantedTrack: null,
  noise: null,            // reusable white-noise sample
  voices: [],
  speaking: false,
  lastSfx: {},
  stats: { sfx: {}, speak: 0, lastVoice: null, trackChanges: 0 },   // for testing

  /* -- starting up -- */
  unlock() {
    if (this.unlocked) {
      // some browsers pause audio again (e.g. after switching tabs); resume on the next click
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    this.unlocked = true;
    if (this.supported.webAudio) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        const master = this.ctx.createGain();
        const music = this.ctx.createGain();
        const sfx = this.ctx.createGain();
        master.gain.value = MASTER_BOOST;
        // a limiter: keeps loud moments (boss hits, fanfare) from crackling
        let out = this.ctx.destination;
        try {
          const limiter = this.ctx.createDynamicsCompressor();
          limiter.threshold.value = -8;
          limiter.knee.value = 6;
          limiter.ratio.value = 12;
          limiter.attack.value = 0.003;
          limiter.release.value = 0.25;
          limiter.connect(this.ctx.destination);
          out = limiter;
        } catch (e) { /* no limiter in this browser: play without it */ }
        master.connect(out);
        music.connect(master);
        sfx.connect(master);
        this.buses = { master, music, sfx };
        this.noise = this.makeNoise();
        this.applyVolumes();
        if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
        this.scheduler = setInterval(() => this.schedule(), 40);
      } catch (error) {
        this.supported.webAudio = false;
        this.ctx = null;
      }
    }
    if (this.supported.speech) this.loadVoices();
    renderAudioPanel();
  },

  // Music, effects and voice volumes from the settings
  applyVolumes() {
    if (!this.buses) return;
    const now = this.ctx.currentTime;
    const music = this.settings.music.on ? (this.settings.music.vol / 100) * MUSIC_LEVEL : 0;
    const duck = this.speaking ? 0.6 : 1;   // music gets quieter while someone speaks
    this.buses.music.gain.setTargetAtTime(music * duck, now, 0.08);
    this.buses.sfx.gain.setTargetAtTime(this.settings.sfx.on ? (this.settings.sfx.vol / 100) * SFX_LEVEL : 0, now, 0.03);
  },

  setChannel(channel, on, vol) {
    if (typeof on === 'boolean') this.settings[channel].on = on;
    if (Number.isFinite(vol)) this.settings[channel].vol = vol;
    saveAudioSettings();
    this.applyVolumes();
    if (channel === 'voice' && !this.settings.voice.on) this.stopSpeech();
  },

  /* -- music: pick the track for what is happening in the game -- */
  tick() {
    if (!this.ctx) return;
    const wanted = this.sceneTrack();
    if (wanted !== this.wantedTrack) {
      this.wantedTrack = wanted;
      this.playTrack(wanted);
    }
  },

  sceneTrack() {
    if (typeof gameState === 'undefined') return 'village';
    if (gameState === 'ENDING' || (typeof finale !== 'undefined' && finale.celebrating)) return 'victory';
    if (typeof inBattle === 'function' && inBattle()) {
      return battle.phase === 'victory' ? 'victory' : 'boss';
    }
    if (typeof finale !== 'undefined' && finale.cutscene && finale.cutscene.name === 'heal') return 'victory';
    if (typeof progress !== 'undefined' && (progress.finale === 'portal' || (finale && finale.focus))) return 'corrupted';
    if (gameState === 'ACTIVITY') return 'mission';
    return 'village';
  },

  playTrack(name) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const old = this.track;
    if (old) {                                     // fade the old music out
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setValueAtTime(old.gain.gain.value, now);
      old.gain.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => { try { old.gain.disconnect(); } catch (e) { /* already gone */ } }, 900);
    }
    const def = MUSIC_TRACKS[name];
    if (!def) { this.track = null; return; }
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + 0.8);   // fade the new music in
    gain.connect(this.buses.music);
    this.track = { name, def, gain, step: 0, nextTime: now + 0.12 };
    this.stats.trackChanges++;
  },

  // Look a little ahead and schedule the next notes (keeps the beat steady)
  schedule() {
    if (!this.ctx || !this.track || this.ctx.state !== 'running') return;
    const t = this.track, def = t.def;
    const stepTime = 60 / def.bpm / 2;
    while (t.nextTime < this.ctx.currentTime + 0.15) {
      const i = t.step;
      const at = t.nextTime;
      const note = def.melody[i % def.melody.length];
      if (note != null) this.instrument(def.leadInst, note, at, stepTime, t.gain);
      const bass = def.bass && def.bass[i % def.bass.length];
      if (bass != null) this.instrument(def.bassInst, bass, at, stepTime, t.gain);
      if (def.kick && def.kick[i % def.kick.length]) this.kick(at, t.gain);
      if (def.snare && def.snare[i % def.snare.length]) this.noiseHit(at, 0.12, 1800, 0.35, t.gain);
      if (def.hat && def.hat[i % def.hat.length]) this.noiseHit(at, 0.04, 7000, 0.12, t.gain);
      if (def.glitchy && Math.random() < 0.06) this.noiseHit(at, 0.05, 3000 + Math.random() * 4000, 0.08, t.gain);
      t.step++;
      t.nextTime += stepTime;
    }
  },

  /* -- instruments -- */
  freq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); },

  tone(type, freq, at, dur, vol, dest, opts) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    if (opts && opts.slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slideTo), at + dur);
    const attack = (opts && opts.attack) || 0.01;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    let out = g;
    if (opts && opts.lowpass) {
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = opts.lowpass;
      g.connect(f);
      out = f;
    }
    o.connect(g);
    out.connect(dest);
    o.start(at);
    o.stop(at + dur + 0.05);
  },

  instrument(kind, midi, at, step, dest) {
    const f = this.freq(midi);
    switch (kind) {
      case 'pluck':  this.tone('triangle', f, at, step * 1.8, 0.22, dest); break;
      case 'bell':   this.tone('sine', f, at, step * 2.5, 0.16, dest); this.tone('sine', f * 2, at, step, 0.04, dest); break;
      case 'glass':  this.tone('sine', f, at, step * 3, 0.12, dest, { attack: 0.08 }); this.tone('sine', f * 1.5, at, step * 2, 0.03, dest); break;
      case 'square': this.tone('square', f, at, step * 0.9, 0.09, dest, { lowpass: 2200 }); break;
      case 'pulse':  this.tone('sawtooth', f, at, step * 0.8, 0.12, dest, { lowpass: 900 }); break;
      case 'drone':  this.tone('sawtooth', f, at, step * 8, 0.1, dest, { attack: 0.6, lowpass: 400 }); break;
      default:       this.tone('sine', f, at, step * 3.5, 0.2, dest, { attack: 0.03 }); break;   // 'soft' bass
    }
  },

  makeNoise() {
    const length = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  },

  noiseHit(at, dur, filterFreq, vol, dest, sweepTo) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(filterFreq, at);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, at + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(at, Math.random() * 0.5);
    src.stop(at + dur + 0.05);
  },

  kick(at, dest) {
    this.tone('sine', 140, at, 0.18, 0.5, dest, { slideTo: 45, attack: 0.002 });
  },

  /* -- sound effects -- */
  sfx(name) {
    this.stats.sfx[name] = (this.stats.sfx[name] || 0) + 1;
    if (!this.ctx || !this.settings.sfx.on || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    // the same effect can't repeat too fast (e.g. many glitch bolts at once)
    const gapNeeded = { attack: 0.22, glitch: 0.3 }[name] || 0.05;
    if (this.lastSfx[name] && now - this.lastSfx[name] < gapNeeded) return;
    this.lastSfx[name] = now;
    const d = this.buses.sfx;
    const n = m => this.freq(m);
    try {
      switch (name) {
        case 'correct':   // two rising chimes
          this.tone('triangle', n(84), now, 0.18, 0.3, d);
          this.tone('triangle', n(91), now + 0.1, 0.3, 0.3, d);
          break;
        case 'wrong':     // low falling buzz
          this.tone('square', 220, now, 0.28, 0.22, d, { slideTo: 140, lowpass: 1200 });
          break;
        case 'collect':   // sparkling arpeggio (Seals, charged Seal)
          [84, 88, 91, 96].forEach((m, i) => this.tone('triangle', n(m), now + i * 0.07, 0.25, 0.22, d));
          this.tone('sine', n(103), now + 0.3, 0.4, 0.08, d);
          break;
        case 'portal':    // deep swirling whoosh
          this.noiseHit(now, 2.2, 300, 0.5, d, 2400);
          this.tone('sine', 620, now, 2.2, 0.22, d, { slideTo: 70, attack: 0.3 });
          this.tone('sawtooth', 90, now, 2.4, 0.08, d, { attack: 0.5, lowpass: 300 });
          break;
        case 'quake':     // rumble
          this.noiseHit(now, 2.8, 90, 0.9, d, 50);
          this.tone('sine', 48, now, 2.8, 0.35, d, { attack: 0.2 });
          break;
        case 'jump':      // falling into the hole
          this.tone('triangle', 700, now, 0.9, 0.2, d, { slideTo: 120 });
          this.noiseHit(now + 0.2, 1.6, 1200, 0.35, d, 200);
          break;
        case 'attack':    // BUG.exe throws glitch blocks
          this.tone('sawtooth', 900, now, 0.14, 0.14, d, { slideTo: 260, lowpass: 3000 });
          break;
        case 'hurt':      // NIAN is hit
          this.noiseHit(now, 0.25, 600, 0.6, d, 150);
          this.tone('square', 160, now, 0.2, 0.12, d, { slideTo: 80, lowpass: 900 });
          break;
        case 'strike':    // NIAN fires a Seal
          this.tone('square', 300, now, 0.25, 0.2, d, { slideTo: 1400, lowpass: 4000 });
          break;
        case 'bossHit':   // the Seal hits BUG.exe
          this.noiseHit(now, 0.6, 400, 0.9, d, 60);
          this.tone('sine', 110, now, 0.5, 0.4, d, { slideTo: 40 });
          [88, 91].forEach((m, i) => this.tone('triangle', n(m), now + 0.05 + i * 0.08, 0.2, 0.15, d));
          break;
        case 'glitch':    // BUG.exe's voice crackle
          for (let i = 0; i < 4; i++) this.noiseHit(now + i * 0.06, 0.04, 2000 + Math.random() * 5000, 0.25, d);
          break;
        case 'victory':   // fanfare
          [72, 76, 79, 84].forEach((m, i) => this.tone('square', n(m), now + i * 0.12, 0.22, 0.12, d, { lowpass: 3500 }));
          this.tone('square', n(84), now + 0.5, 0.8, 0.14, d, { lowpass: 3500 });
          this.tone('triangle', n(60), now + 0.5, 0.8, 0.2, d);
          break;
        case 'test':
          this.tone('triangle', n(79), now, 0.2, 0.25, d);
          break;
      }
    } catch (error) { /* a missing audio feature: just stay quiet */ }
  },

  // Right or wrong answers in puzzles, quizzes and the battle
  feedback(kind) {
    if (kind === 'good') this.sfx('correct');
    else if (kind === 'bad') this.sfx('wrong');
  },

  /* -- voices -- */
  loadVoices() {
    const read = () => {
      try { this.voices = window.speechSynthesis.getVoices() || []; } catch (e) { this.voices = []; }
      this.voiceCache = {};
    };
    read();
    try { window.speechSynthesis.addEventListener('voiceschanged', read); } catch (e) {
      window.speechSynthesis.onvoiceschanged = read;
    }
  },

  // Pick a different-sounding English voice for each kind of character, if the browser has several
  pickVoice(kind) {
    if (!this.voices.length) return null;
    this.voiceCache = this.voiceCache || {};
    if (kind in this.voiceCache) return this.voiceCache[kind];
    const english = this.voices.filter(v => /^en([-_]|$)/i.test(v.lang));
    const pool = english.length ? english : this.voices;
    const female = /female|zira|samantha|victoria|karen|moira|tessa|susan|hazel|libby|sonia|aria|jenny|fiona|serena|catherine|allison|ava/i;
    const male = /\bmale\b|david|daniel|alex\b|fred|george|guy|mark|james|ryan|thomas|aaron|arthur|oliver|tom\b/i;
    const males = pool.filter(v => male.test(v.name) && !female.test(v.name));
    const females = pool.filter(v => female.test(v.name));
    let voice = null;
    if (kind === 'male') voice = males[0] || pool[0];
    else if (kind === 'female') voice = females[0] || pool[0];
    else if (kind === 'robot') voice = females[1] || males[1] || pool[1] || pool[0];   // differs from NIAN's voice
    this.voiceCache[kind] = voice || null;
    return this.voiceCache[kind];
  },

  // Text tidied up for speaking (no emoji or source tags, names said as words)
  speakableText(text) {
    return String(text)
      .replace(/\s*\((?:[^()]*§[^()]*|Worked Example|Key Takeaways|Common misconceptions|Try it[^()]*)\)/g, '')
      .replace(/BUG\.exe/g, 'Bug exe')
      .replace(/\bNIAN\b/g, 'Nian')
      .replace(/\bWASD\b/g, 'W A S D')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\.\.\.|…/g, '.');
  },

  speak(speaker, text) {
    this.stats.speak++;
    this.stats.lastVoice = speaker;
    if (!this.supported.speech || !this.unlocked || !this.settings.voice.on) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();   // stop the previous line first
      const profile = VOICE_PROFILES[speaker] || { pitch: 1, rate: 1, voice: 'male' };
      const u = new SpeechSynthesisUtterance(this.speakableText(text));
      const voice = this.pickVoice(profile.voice);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-US'; }
      u.pitch = profile.pitch;
      u.rate = profile.rate;
      u.volume = this.settings.voice.vol / 100;
      u.onstart = () => { this.speaking = true; this.applyVolumes(); };
      u.onend = u.onerror = () => { this.speaking = false; this.applyVolumes(); };
      // some browsers never report the end of a line: un-quiet the music anyway
      clearTimeout(this.duckTimer);
      this.duckTimer = setTimeout(() => { this.speaking = false; this.applyVolumes(); },
        Math.min(20000, 1500 + u.text.length * 90 / profile.rate));
      if (profile.glitch) this.sfx('glitch');
      synth.speak(u);
    } catch (error) { /* speech not available right now */ }
  },

  stopSpeech() {
    if (!this.supported.speech) return;
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    this.speaking = false;
    this.applyVolumes();
  },
};

// Browsers only allow sound after the player interacts with the page
['pointerdown', 'mousedown', 'click', 'keydown', 'keyup', 'touchstart', 'touchend'].forEach(type => {
  window.addEventListener(type, () => Sound.unlock(), { capture: true, passive: true });
});


/* ---------- E. AUDIO SETTINGS PANEL ---------- */
const audioBtn = document.getElementById('audio-btn');
const audioPanel = document.getElementById('audio-panel');
const audioNote = document.getElementById('audio-note');
const AUDIO_CHANNELS = ['music', 'sfx', 'voice'];

function renderAudioPanel() {
  if (!audioPanelReady()) return;   // older index.html without the panel: sound still works
  const s = Sound.settings;
  for (const ch of AUDIO_CHANNELS) {
    const unsupported = ch === 'voice' ? !Sound.supported.speech : !Sound.supported.webAudio;
    const toggle = document.getElementById(`audio-${ch}-toggle`);
    const slider = document.getElementById(`audio-${ch}-vol`);
    const value = document.getElementById(`audio-${ch}-value`);
    const test = document.getElementById(`audio-${ch}-test`);
    const on = s[ch].on && !unsupported;
    toggle.textContent = unsupported ? 'N/A' : on ? 'ON' : 'OFF';
    toggle.setAttribute('aria-pressed', String(on));
    toggle.classList.toggle('off', !on);
    toggle.disabled = unsupported;
    slider.value = String(s[ch].vol);
    slider.disabled = unsupported;
    value.textContent = `${s[ch].vol}%`;
    if (test) test.disabled = unsupported;
  }
  const notes = [];
  if (!Sound.supported.webAudio) notes.push('Music and sound effects are not supported in this browser.');
  if (!Sound.supported.speech) notes.push('Character voices are not supported in this browser.');
  else if (Sound.unlocked && !Sound.voices.length) notes.push('Voices use your browser’s default speech voice.');
  if (!Sound.unlocked) notes.push('Sound starts after your first click or key press.');
  audioNote.textContent = notes.join(' ');
  audioBtn.textContent = (s.music.on || s.sfx.on || s.voice.on) ? '🔊 Audio' : '🔇 Audio';
}

function audioPanelReady() {
  return Boolean(audioBtn && audioPanel && audioNote &&
    AUDIO_CHANNELS.every(ch => document.getElementById(`audio-${ch}-toggle`) && document.getElementById(`audio-${ch}-vol`)));
}

function openAudioPanel(open) {
  if (!audioPanelReady()) return;
  audioPanel.classList.toggle('hidden', !open);
  audioBtn.setAttribute('aria-expanded', String(open));
  if (open) {
    renderAudioPanel();
    document.getElementById('audio-music-toggle').focus();
  } else {
    audioBtn.focus();
  }
}

if (audioPanelReady()) {
  audioBtn.addEventListener('click', () => openAudioPanel(audioPanel.classList.contains('hidden')));
  const closeBtn = document.getElementById('audio-close');
  if (closeBtn) closeBtn.addEventListener('click', () => openAudioPanel(false));
  audioPanel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.stopPropagation(); openAudioPanel(false); }
  });

  for (const ch of AUDIO_CHANNELS) {
    document.getElementById(`audio-${ch}-toggle`).addEventListener('click', () => {
      Sound.setChannel(ch, !Sound.settings[ch].on);
      renderAudioPanel();
    });
    document.getElementById(`audio-${ch}-vol`).addEventListener('input', event => {
      const vol = Number(event.target.value);
      Sound.setChannel(ch, vol > 0 ? true : Sound.settings[ch].on, vol);
      renderAudioPanel();
    });
  }

  const sfxTestBtn = document.getElementById('audio-sfx-test');
  if (sfxTestBtn) sfxTestBtn.addEventListener('click', () => Sound.sfx('correct'));
  const voiceTestBtn = document.getElementById('audio-voice-test');
  if (voiceTestBtn) voiceTestBtn.addEventListener('click', () => {
    Sound.speak('NIAN', 'Hello, I am NIAN.');
    setTimeout(() => Sound.speak('Wang', 'Beep boop! I am Wang.'), 1600);
    setTimeout(() => Sound.speak('BUG.exe', 'And I am BUG.exe.'), 3200);
  });

  renderAudioPanel();
} else {
  console.warn('Audio settings panel not found in index.html. Sound still works with saved settings.');
}
